const AWS=require('aws-sdk')

let response;
AWS.config.update={
    region:process.env.REGION,
    endpoint:process.env.ENDPOINT

}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Student";
const getStu=async function(regNo){
    
    return new Promise((resolve,reject)=>{
       
         
       
         var params = {
        TableName:table,
        Key:{
            regNo:regNo

        }
        
        };
        
        docClient.get(params, function(err, data) {
    console.log("inside docclient.put function")
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        reject(err);
    } else {
        if(isEmpty(data))
        {
            reject("invalid reg no")
        }
        console.log("got item:", JSON.stringify(data, null, 2));
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
        console.log("printing full event object"+JSON.stringify(event));
            response = {
            'statusCode': 200,
            'headers': headers,
          
            'body': await getStu(event.queryStringParameters.regNo)
        }
    } catch (err) {
        console.log(err);
        let errResponse = {
            'statusCode': 400,
            'headers': headers,
          
            'body': '{"status": "reg not found"}'
        }
        return errResponse;
    }

    return response
};
