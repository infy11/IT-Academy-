
const axios = require('axios')
const url = 'http://checkip.amazonaws.com/';
let response;


exports.lambdaHandler = async (event, context) => {
    try {
        const ret = await axios(url);
        response = {
            'statusCode': 200,
            'headers': {
            
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods':'GET, PUT, OPTIONS, POST, DELETE',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials' : True,
                'Access-Control-Allow-Headers':'Content-Type',
               
            },
            'body': JSON.stringify({
                message: 'return from save student',
                location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
