const headers={
            
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods':'GET, PUT, OPTIONS, POST, DELETE',
    
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials' : true,
    'Access-Control-Allow-Headers':'Content-Type, Authorization'
   
}

exports.lambdaHandler = async (event, context) => {
    try {
            response = {
            'statusCode': 200,
            'headers': headers,
          
            'body': '',
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
