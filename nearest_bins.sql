set @lat1 = 103.737313; -- input user latitude
set @lon1 = 1.335046; -- input user longitude
set @pt1 = point(@lon1, @lat1);
set @source = 'cashfortrash' --input source_var

select rp.addressbuildingname,
       rp.addressblockhousenumber,
       rp.addresspostalcode,
       rp.addressstreetname, 
       rp.addressunitnumber,
       rp.description,
       rp.hyperlink,
       rp.longitude,
       rp.latitude,
       st_distance_sphere(@pt1, point(rp.longitude, rp.latitude))/1000 as euclidean_distance_km
from recyclerobert.recycling_points rp
where substring_index(rp.source,'.',1) = @source
order by st_distance_sphere(@pt1, point(rp.longitude, rp.latitude)) limit 5;
