const AWS = require('aws-sdk')
const nJwt = require('njwt');

let response;
AWS.config.update = {
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT

}
const dndb = new AWS.DynamoDB();
const table = "Secret";
const secretParams = {
  TableName: table,
  Key: {
    'key': {
      S: 'key'
    },
  },
  ProjectionExpression: 'secret'
}
const claims = {
  sub:"admin",
  scope: "all",
  username:"admin"
}

const verify = async function (event) {

  const userParams = {
    TableName: "users",
    Key: {
      'user': {
        S: event.user
      }
    },


  }
  const signingKey=await getSecret();

  return new Promise((resolve, reject) => {
    dndb.getItem(userParams, function (err, data) {
      if (err) {
        console.log("unable to get item from user table" + err)
        reject(err);
      } else {

        console.log("data from user table" + JSON.stringify(data));
        if (event.password === data.Item.password.S) {
          const jwt=nJwt.create(claims, signingKey);
          const token=jwt.compact();
          console.log("generated token-  "+token);
          resolve('{ "token":'+ '"'+token+'" }')
          

        } else {
          reject("wrong password");
        }


      }


    })


  })

}


const getSecret = async function () {

  return new Promise((resolve, reject) => {

    dndb.getItem(secretParams, function (err, data) {

      if (err) {
        console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
        reject(JSON.stringify({
          'status': err
        }));
      } else {
        console.log("get item success:", data.Item.secret.S);
        
        return resolve(data.Item.secret.S);
      }
    });

  })
}
const secretkey = getSecret().then((key) => {



  }

)



const headers = {

  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS, POST, DELETE',

  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type',

}

exports.lambdaHandler = async (event, context, cb) => {
  try {
    const parseInfo=JSON.parse(event.body);
    //console.log("printing user"+parseInfo.user)
    
    response = {
      'statusCode': 200,
      'headers': headers,

      'body': await verify(parseInfo)
    }
  } catch (err) {
    console.log(err);
    return err;
  }

  return response
};
