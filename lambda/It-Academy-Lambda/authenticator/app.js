const nJwt = require('njwt');
const AWS = require('aws-sdk')
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

const isAuthorized = function (token) {
  if (token.sub == "admin" && token.scope == "all" && token.username == "admin") {
    return true;

  } else {
    return false;
  }


}

function AuthPolicy(principal, awsAccountId, apiOptions) {

  this.awsAccountId = awsAccountId;
  this.principalId = principal;
  this.version = '2012-10-17';
  this.pathRegex = new RegExp('^[/.a-zA-Z0-9-\*]+$');

  // These are the internal lists of allowed and denied methods. These are lists
  // of objects and each object has two properties: a resource ARN and a nullable
  // conditions statement. The build method processes these lists and generates
  // the appropriate statements for the final policy.
  this.allowMethods = [];
  this.denyMethods = [];

  if (!apiOptions || !apiOptions.restApiId) {
    this.restApiId = '*';
  } else {
    this.restApiId = apiOptions.restApiId;
  }
  if (!apiOptions || !apiOptions.region) {
    this.region = '*';
  } else {
    this.region = apiOptions.region;
  }
  if (!apiOptions || !apiOptions.stage) {
    this.stage = '*';
  } else {
    this.stage = apiOptions.stage;
  }
}

AuthPolicy.HttpVerb = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  ALL: '*',
};

AuthPolicy.prototype = (function AuthPolicyClass() {
  /**
   * Adds a method to the internal lists of allowed or denied methods. Each object in
   * the internal list contains a resource ARN and a condition statement. The condition
   * statement can be null.
   *
   * @method addMethod
   * @param {String} The effect for the policy. This can only be "Allow" or "Deny".
   * @param {String} The HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {String} The resource path. For example "/pets"
   * @param {Object} The conditions object in the format specified by the AWS docs.
   * @return {void}
   */
  function addMethod(effect, verb, resource, conditions) {
    if (verb !== '*' && !Object.prototype.hasOwnProperty.call(AuthPolicy.HttpVerb, verb)) {
      throw new Error(`Invalid HTTP verb ${verb}. Allowed verbs in AuthPolicy.HttpVerb`);
    }

    if (!this.pathRegex.test(resource)) {
      throw new Error(`Invalid resource path: ${resource}. Path should match ${this.pathRegex}`);
    }

    let cleanedResource = resource;
    if (resource.substring(0, 1) === '/') {
      cleanedResource = resource.substring(1, resource.length);
    }
    const resourceArn = `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}/${cleanedResource}`;

    if (effect.toLowerCase() === 'allow') {
      this.allowMethods.push({
        resourceArn,
        conditions,
      });
    } else if (effect.toLowerCase() === 'deny') {
      this.denyMethods.push({
        resourceArn,
        conditions,
      });
    }
  }



  function getEmptyStatement(effect) {
    const statement = {};
    statement.Action = 'execute-api:Invoke';
    statement.Effect = effect.substring(0, 1).toUpperCase() + effect.substring(1, effect.length).toLowerCase();
    statement.Resource = [];

    return statement;
  }


  function getStatementsForEffect(effect, methods) {
    const statements = [];

    if (methods.length > 0) {
      const statement = getEmptyStatement(effect);

      for (let i = 0; i < methods.length; i++) {
        const curMethod = methods[i];
        if (curMethod.conditions === null || curMethod.conditions.length === 0) {
          statement.Resource.push(curMethod.resourceArn);
        } else {
          const conditionalStatement = getEmptyStatement(effect);
          conditionalStatement.Resource.push(curMethod.resourceArn);
          conditionalStatement.Condition = curMethod.conditions;
          statements.push(conditionalStatement);
        }
      }

      if (statement.Resource !== null && statement.Resource.length > 0) {
        statements.push(statement);
      }
    }

    return statements;
  }

  return {
    constructor: AuthPolicy,

    /**
     * Adds an allow "*" statement to the policy.
     *
     * @method allowAllMethods
     */
    allowAllMethods() {
      addMethod.call(this, 'allow', '*', '*', null);
    },

    /**
     * Adds a deny "*" statement to the policy.
     *
     * @method denyAllMethods
     */
    denyAllMethods() {
      addMethod.call(this, 'deny', '*', '*', null);
    },

    /**
     * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
     * methods for the policy
     *
     * @method allowMethod
     * @param {String} The HTTP verb for the method, this should ideally come from the
     *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
     * @param {string} The resource path. For example "/pets"
     * @return {void}
     */
    allowMethod(verb, resource) {
      addMethod.call(this, 'allow', verb, resource, null);
    },

    /**
     * Adds an API Gateway method (Http verb + Resource path) to the list of denied
     * methods for the policy
     *
     * @method denyMethod
     * @param {String} The HTTP verb for the method, this should ideally come from the
     *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
     * @param {string} The resource path. For example "/pets"
     * @return {void}
     */
    denyMethod(verb, resource) {
      addMethod.call(this, 'deny', verb, resource, null);
    },

    /**
     * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
     * methods and includes a condition for the policy statement. More on AWS policy
     * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
     *
     * @method allowMethodWithConditions
     * @param {String} The HTTP verb for the method, this should ideally come from the
     *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
     * @param {string} The resource path. For example "/pets"
     * @param {Object} The conditions object in the format specified by the AWS docs
     * @return {void}
     */
    allowMethodWithConditions(verb, resource, conditions) {
      addMethod.call(this, 'allow', verb, resource, conditions);
    },

    /**
     * Adds an API Gateway method (Http verb + Resource path) to the list of denied
     * methods and includes a condition for the policy statement. More on AWS policy
     * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
     *
     * @method denyMethodWithConditions
     * @param {String} The HTTP verb for the method, this should ideally come from the
     *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
     * @param {string} The resource path. For example "/pets"
     * @param {Object} The conditions object in the format specified by the AWS docs
     * @return {void}
     */
    denyMethodWithConditions(verb, resource, conditions) {
      addMethod.call(this, 'deny', verb, resource, conditions);
    },

    /**
     * Generates the policy document based on the internal lists of allowed and denied
     * conditions. This will generate a policy with two main statements for the effect:
     * one statement for Allow and one statement for Deny.
     * Methods that includes conditions will have their own statement in the policy.
     *
     * @method build
     * @return {Object} The policy object that can be serialized to JSON.
     */
    build() {
      if ((!this.allowMethods || this.allowMethods.length === 0) &&
        (!this.denyMethods || this.denyMethods.length === 0)) {
        throw new Error('No statements defined for the policy');
      }

      const policy = {};
      policy.principalId = this.principalId;
      const doc = {};
      doc.Version = this.version;
      doc.Statement = [];

      doc.Statement = doc.Statement.concat(getStatementsForEffect.call(this, 'Allow', this.allowMethods));
      doc.Statement = doc.Statement.concat(getStatementsForEffect.call(this, 'Deny', this.denyMethods));

      policy.policyDocument = doc;

      return policy;
    },
  };
}());



const verify_token = async function (token, secret, event) {
  return new Promise((resolve, reject) => {
    nJwt.verify(token, secret, function (err, verifiedJwt) {
      if (err) {
        console.log(err);
        reject(err);

      } else {
        console.log(verifiedJwt); // Will contain the header and body
        const principalId = verifiedJwt.body.jti;
        if (!isAuthorized(verifiedJwt.body)) {
          reject("not a valid token");

        }

        const apiOptions = {};
        const tmp = event.methodArn.split(':');
        const apiGatewayArnTmp = tmp[5].split('/');
        const awsAccountId = tmp[4];
        apiOptions.region = tmp[3];
        apiOptions.restApiId = apiGatewayArnTmp[0];
        apiOptions.stage = apiGatewayArnTmp[1];



        const policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
        policy.allowAllMethods();

        let authResponse = policy.build();

        console.log("printing auth response" + JSON.stringify(authResponse));
        resolve(authResponse);
      }

    });



  })


}


exports.lambdaHandler = async (event, context, callback) => {
  console.log("printing full event object" + JSON.stringify(event))
  console.log('Client token:', event.authorizationToken);
  console.log('Method ARN:', event.methodArn);
  const secret = await getSecret();
  const token = event.authorizationToken;
  try {
    const policy = await verify_token(token, secret, event);
    callback(null, policy);
  } catch (err) {
    callback(err);

  }
};
