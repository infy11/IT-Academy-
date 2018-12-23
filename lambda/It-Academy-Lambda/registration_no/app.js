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
      ProjectionExpression: "registrationNo"


    };

    docClient.query(params, function (err, data) {
      console.log("inside docclient.put function")
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        reject(err);
      } else {
        if (isEmpty(data)) {
          reject("invalid reg no")
        }
        console.log("got item:", JSON.stringify(data, null, 2));

        return resolve(JSON.stringify(data, null, 2));
      }
    });

  })
}


const setRegistrationNo = async function (regNo) {

  return new Promise((resolve, reject) => {


    const regNo = JSON.parse(regNo);
    console.log("printing registration no " + regNo)

    var params = {
      TableName: table,
      Item: regNo

    }

    docClient.put(params, function (err, data) {
      console.log("inside docclient.put function")
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        reject(JSON.stringify({
          'status': err
        }));
      } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        return resolve(JSON.stringify(data, null, 2));
      }
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
