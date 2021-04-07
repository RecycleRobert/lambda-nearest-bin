var mysql = require('mysql');

exports.handler = async function(event, context) {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  
  connection.connect();

  var getBins = function(query) {
      return new Promise(function(resolve, reject) {
      var sql = `
      select round(rp.LATITUDE,7) as LATITUDE, round(rp.LONGITUDE,7) as LONGITUDE, rp.DESCRIPTION,
             rp.ADDRESSUNITNUMBER, rp.ADDRESSSTREETNAME, rp.ADDRESSPOSTALCODE, rp.ADDRESSBUILDINGNAME, rp.ADDRESSBLOCKHOUSENUMBER,
             round(st_distance_sphere(point("${event.usr_longtitude}", "${event.usr_latitude}"),
                                point(rp.longitude, rp.latitude))/1000,2) as euclidean_distance_km 
      from recyclerobert.recycling_points rp
      where substring_index(rp.source,'.',1) = 
            case when "${event.source_var}" = "Cash For Trash" then "cashfortrash"
                when "${event.source_var}" = "E-Waste" then 'ewaste'
                when "${event.source_var}" = "Lighting" then 'lighting'
                when "${event.source_var}" = "Recycling Bins" then 'recyclingbins' end
      and rp.ADDRESSBUILDINGNAME is not null
      order by st_distance_sphere(point("${event.usr_longtitude}", "${event.usr_latitude}"), 
                          point(rp.longitude, rp.latitude)) 
      limit 5;`;
      connection.query(sql, [query], function(err, result) {
        if (!err) {
          resolve(result);
        } else {
          resolve({
            status: "error",
            message: "Error Getting Data",
            debug: err
          });
        }
      });
    });
  };

  var endConnection = function () {
    return new Promise((resolve, reject) => {
        connection.end(error => error ? reject(error) : resolve());
    });
  }

  let results;
  let returnObj;
  try {
    results = await getBins(event.query); 
    await endConnection();
    let latitude = [];
    let longitude = [];
    let desc = [];
    let addressunitnumber = [];
    let addressstreetname = [];
    let addresspostalcode = [];
    let addressbuildingname = [];
    let addressblockhousenumber = [];
    
    for (let i = 0; i < results.length; i++) {
      latitude.push(results[i].LATITUDE);
      longitude.push(results[i].LONGITUDE);
      desc.push(results[i].DESCRIPTION);
      addressunitnumber.push(results[i].ADDRESSUNITNUMBER);
      addressstreetname.push(results[i].ADDRESSSTREETNAME);
      addresspostalcode.push(results[i].ADDRESSPOSTALCODE);
      addressbuildingname.push(results[i].ADDRESSBUILDINGNAME);
      addressblockhousenumber.push(results[i].ADDRESSBLOCKHOUSENUMBER);
    }
    returnObj = {
      'latitude': latitude,
      'longitude': longitude,
      'desc' : desc,
      'addressunitnumber': addressunitnumber,
      'addressstreetname': addressstreetname,
      'addresspostalcode': addresspostalcode,
      'addressbuildingname': addressbuildingname,
      'addressblockhousenumber': addressblockhousenumber
    }
    console.log(returnObj);
   } catch (e) {
     console.log(e);
  }

  const response = {
    statusCode: 200,
    body: returnObj
  };
  return response;
};
