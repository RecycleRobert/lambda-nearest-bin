var mysql = require('mysql');

var pool  = mysql.createPool({
host: 'database-1.cmieupqnbab4.ap-southeast-1.rds.amazonaws.com',
user: 'admin',
password: 'password',
database: 'recyclerobert',
  });

exports.handler =  (event, context, callback) => {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
  
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(`
    select rp.*,
          st_distance(point("${event.usr_lontitude}", "${event.usr_latitude}"),
                      point(rp.longitude, rp.latitude))/1000 as euclidean_distance_km
    from recyclerobert.recycling_points rp
    where substring_index(rp.source,'.',1) = "${event.source_var}"
    order by st_distance(point("${event.usr_lontitude}", "${event.usr_latitude}"), 
                         point(rp.longitude, rp.latitude)) 
    limit 5;`, 
    function (error, results, fields) {
      
      // And done with the connection.
      connection.release();
      let addressbuildingname = [];
      let addressblockhousenumber = [];
      let addresspostalcode = [];
      let addressstreetname = [];
      let addressunitnumber = [];
      let description = [];
      let hyperlink = [];
      let longitude = [];
      let latitude = [];
      let euclidean_distance_km = []; 

      var i;
        for (i = 0; i < results.length; i++) {
          addressbuildingname.push(results[i].ADDRESSBUILDINGNAME);
          addressblockhousenumber.push(results[i].ADDRESSBLOCKHOUSENUMBER);
          addresspostalcode.push(results[i].ADDRESSPOSTALCODE);
          addressstreetname.push(results[i].ADDRESSSTREETNAME);
          addressunitnumber.push(results[i].ADDRESSUNITNUMBER);
          description.push(results[i].DESCRIPTION);
          hyperlink.push(results[i].HYPERLINK);
          longitude.push(results[i].LONGITUDE);
          latitude.push(results[i].LATITUDE);
          euclidean_distance_km.push(results[i].euclidean_distance_km);
          }
      
      // Handle error after the release.
      if (error) 
  
      // console.log(error);
      callback(error);
      else 
      callback(null, 
        {
        'addressbuildingname': addressbuildingname, 
        'addressblockhousenumber': addressblockhousenumber, 
        'addresspostalcode': addresspostalcode, 
        'addressstreetname': addressstreetname,
        'addressunitnumber': addressunitnumber, 
        'description': description, 
        'hyperlink': hyperlink, 
        'longitude': longitude,
        'latitude': latitude,
        'euclidean_distance_km': euclidean_distance_km,
        });
    });
  });
};

