'use strict';

var dynamodb = require('serverless-dynamodb-client');

var Joi = require('joi');

module.exports.create = async (event) => {


const schema = Joi.object({

	user_id : Joi.string()
		  .required(),
	
});



return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
         ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
