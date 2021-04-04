// WENLIN
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWSACCESSKEYID, 
    secretAccessKey: process.env.AWSSECRETACCESSKEY,
    region: process.env.AWSREGION
});

const binTypes = ["Cash For Trash", "E-Waste", "Lighting", "Recycling Bins"];
const binTypeButtons = binTypes.map((binType) => {
  return [
    {
      text: binType,
      switch_inline_query_current_chat: `type ${binType}`
    }
  ]
});

module.exports = (bot) => {
  bot.inlineQuery(/info\s.+/, async ctx => {
    let input = ctx.inlineQuery.query.split(' ');
    input.shift();
    let query = input.join(' ');
    
    let results = [
      {
        type: 'article',
        id: '1',
        title: 'Info',
        input_message_content: {
          message_text: query
        },
        description: `Get information on this recycling point`
      }
    ];
    
    ctx.answerInlineQuery(results);
  })
  
  bot.inlineQuery(/^bin$/, ctx => {
    
    // GET BIN TYPE
    
    //results array containing 1 inlinequeryresult article for ctx.answerInlineQuery method
    let results = [
      {
        type: 'article',
        id: '1',
        title: 'Bin Type',
        input_message_content: {
          message_text: `Which bin type?`
        },
        description: 'Select the type of bin you are looking for',
        reply_markup: {
          inline_keyboard: binTypeButtons
        }
      }
    ];
    
    ctx.answerInlineQuery(results)
  })
  
  bot.inlineQuery(/type\s.+/, async ctx => {
    let input = ctx.inlineQuery.query.split(' '); //split string by spaces into array eg. ['type', 'Ink', 'Cartridges']
    console.log(ctx.inlineQuery.query.reply_markup);
    input.shift(); //remove first element in array eg. ['Ink', 'Cartridges']
    let query = input.join(' '); //join elements in array into string separated by spaces eg. "Ink Cartridges"

    // GET NEAREST BINS
    // User's location and Query: 
    let client = new AWS.Lambda({region: 'ap-southeast-1'});

    let payload = {
      "usr_longtitude": ctx.inlineQuery.location.longitude,
      "usr_latitude": ctx.inlineQuery.location.latitude,
      "source_var": query 
    };
    payload = JSON.stringify(payload);

    let params = {
      FunctionName: 'arn:aws:lambda:ap-southeast-1:367586388111:function:RecycleRobert-Nearest-Bin',
      InvocationType: "RequestResponse", 
      Payload: payload
    };
   
    try {
      const data = await client.invoke(params).promise();
      const queryResult = JSON.parse(data.Payload);

      let latitudes = queryResult.body.latitude;
      let longitudes = queryResult.body.longitude;
      let descs = queryResult.body.desc;
      let addressunitnumbers = queryResult.body.addressunitnumber;
      let addressstreetnames = queryResult.body.addressstreetname;
      let addresspostalcodes = queryResult.body.addresspostalcode;
      let addressbuildingnames = queryResult.body.addressbuildingname;
      let addressblockhousenumbers = queryResult.body.addressblockhousenumber;
      
      let results = latitudes.map((latitude, index) => {
        
        let address = `Blk ${addressblockhousenumbers[index]}` + " ";
        let addressstreetname = addressstreetnames[index];
        if (addressstreetname) {
          address += `${addressstreetname}` + " ";
        }
        let addressunitnumber = addressunitnumbers[index];
        if (addressunitnumber) {
          address += `#${addressunitnumber}` + " ";
        }
        let addresspostalcode = addresspostalcodes[index];
        if (addresspostalcode) {
          address += `S(${addresspostalcode})` + " ";
        }
        let desc = descs[index]
        if (desc) {
          return {
            type: 'venue',
            id: String(index),
            latitude: latitude,
            longitude : longitudes[index],
            title: addressbuildingnames[index],
            address: address,
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `Get Information`, switch_inline_query_current_chat: `info ${desc}` }
                ]
              ]
            }
          }
        } else {
          return {
            type: 'venue',
            id: String(index),
            latitude: latitude,
            longitude : longitudes[index],
            title: addressbuildingnames[index],
            address: address
          }
        }
      })
      
      ctx.answerInlineQuery(results);
    } catch (err) {
      console.log('Fail Case');
      console.log(err, err.stack);
      throw err;
    }
    
  })
}
