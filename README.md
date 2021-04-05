# RecycleRobert-Nearest-Bin

Index.js is a node.js lambda function that queries from the RecycleRobert-RDS-DB to return the nearest 5 recycling locations. 

# lambda-nearest-bin

Sets up lambda function that returns a list of items and whether or not they can be recycled, based on a given materal.

1. **Ensure RDS database is set up.**
2. **Ensure lambda-core Lambda function is set up.**
3. **Create Lambda function**  
    1. From the AWS Lambda console, select **Create function**.
    2. Select **Author from scratch**
    3. Basic information  
        - Function name: `RecycleRobert-Item-Text`
        - Runtime: `Node.js 14.x`
    4. Advanced settings
        - Network - VPC: `RecycleRobertVPC-01`
        - Subnets: `RecycleRobertSubnet-01`; `RecycleRobertSubnet-02`
        - Security groups: `RecycleRobertSG-01`
4. **Add environment variables**  
    1. Inside the function created, go to **Configuration** then **Environment variables**.  
    2. Create the following key value pairs:  
        `DATABASE`: `recyclerobert`  
        `HOST`: `database-1.cmieupqnbab4.ap-southeast-1.rds.amazonaws.com`  
        `PASSWORD`: `password`  
        `USER`: `admin`  
5. **Add layer**  
    1. In **Function overview**, click on **Layers**.
    2. Click **Add a layer**.
    3. Click **Specify an ARN**.
    4. From the **lambda-core** function created earlier go to the **Layers** view and copy the ARN of the layer.
    5. Paste the ARN in the new lambda function created to apply the layer.
    6. Click add.
 6. **Add code**
    1. In this repository, go to **function** and open **index.js**.
    2. Copy all the code.
    3. In the lambda function created, go to **Code**, **RecycleRobert-Nearest-Bin**, **index.js**.
    4. Delete all the existing code and paste the new code there.
    5. Click **Deploy**.
 7. **Add test case**  
    1. Click on the down arrow next to **Test**.
    2. Click on **Configure test event**.
    3. Replace the default key value pairs with:  
    Insert the following test case in the AWS Lambda Function Console
    ```
    {
      "usr_longtitude": User Longitude,
      "usr_latitude": User Latitude,
      "source_var": "Cash For Trash"
    }
    ```
    4. Specify and **Event name**.
    5. Click **Create**.
 8. **Test function**
    1. Click **Test** or **Invoke** depending on which page of the dashboard you are on.
    2. The function should return details on the nearest 5 recycling bin locations
  
  
