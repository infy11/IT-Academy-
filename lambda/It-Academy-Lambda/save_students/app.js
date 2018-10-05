const AWS=require('aws-sdk')

let response;
AWS.config.update={
    region:process.env.REGION,
    endpoint:process.env.ENDPOINT

}
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Student";
const savestu=async function(student){
    
    return new Promise((resolve,reject)=>{
        const tmp=JSON.parse(student);
         console.log("printing student "+tmp)
       
         var params = {
        TableName:table,
        Item:tmp
        
        }
        
        docClient.put(params, function(err, data) {
    console.log("inside docclient.put function")
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        reject(JSON.stringify({
            'status':err
        }));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        return resolve(JSON.stringify(data,null,2));
    }
});
        
    })
}


const headers={
            
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods':'GET, PUT, OPTIONS, POST, DELETE',
    
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials' : true,
    'Access-Control-Allow-Headers':'Content-Type',
   
}

exports.lambdaHandler = async (event, context,cb) => {
    try {
            response = {
            'statusCode': 200,
            'headers': headers,
          
            'body': await savestu(event.body)
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
