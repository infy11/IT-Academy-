const AWS = require('aws-sdk')

let response;
AWS.config.update = {
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT

}
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "registrationNo";

const getRegistrationNo = async function () {

  return new Promise((resolve, reject) => {
    var params = {
      TableName: table,
      Key: {
        id: 1

      },
      ProjectionExpression: "RegNo"


    };

    docClient.get(params, function (err, data) {

      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        reject(err);
      } else {



        return resolve(data);
      }
    });

  })
}


const setRegistrationNo = async function (regNo) {

  return new Promise((resolve, reject) => {
    var params = {
      TableName: table,
      Key: {
        'id': 1,

      },
      UpdateExpression: 'set RegNo = :t',
      ExpressionAttributeValues: {
        ':t': regNo,

      }


    }

    docClient.update(params, function (err, data) {

      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        reject(JSON.stringify({
          'status': err
        }));
      } else {
        
        return resolve(JSON.stringify(data, null, 2));
      }
    });

  })
}

const generateRegistrationNo = async function () {
  let latestRegistrationNoResponse = await getRegistrationNo();
  let latestRegistrationNo = latestRegistrationNoResponse.Item.RegNo + 1;


  await setRegistrationNo(latestRegistrationNo);

  return new Promise((resolve, reject) => {


    resolve({
      "regNo": latestRegistrationNo
    });


  })
}

const headers = {

  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS, POST, DELETE',

  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type',

}

exports.lambdaHandler = async (event, context, cb) => {
  let stringResponse=""
  console.log(event);
  try {
    stringResponse=JSON.stringify(await generateRegistrationNo());
    response = {
      'statusCode': 200,
      'headers': headers,

      'body': await stringResponse
    }
  } catch (err) {
    console.log("in the err block");
    let errResponse = {
            'statusCode': 400,
            'headers': headers,
          
            'body': {"status": err}
        }
    
    return errResponse;

  }
  console.log("error not occured"+stringResponse);

  return response
};
