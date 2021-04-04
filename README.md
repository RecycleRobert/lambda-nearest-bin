# RecycleRobert-Nearest-Bin

Index.js is a node.js lambda function that queries from the RecycleRobert-RDS-DB to return the nearest 5 recycling locations. 

## Test Case to Test Lambda Function

Insert the following test case in the AWS Lambda Function Console

```bash
{
  "usr_longtitude": User Longitude,
  "usr_latitude": User Latitude,
  "source_var": "Cash For Trash"
}
```

# RecycleRobert-Lambda-Function-Core (Bin.js)

Bin.js is a node.js telegraf library that sends the user provided inputs (long/lat and type of recycling bin) to the RecycleRobert-Nearest-Bin lambda function. It then retrieves the results from the lambda function and returns using the Telegraf location method. 

