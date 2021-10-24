'use strict';
const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('../templates/util');
const AWS = require('aws-sdk');
const SQS = new AWS.SQS();
module.exports.handler = async (event, context) => {


    const schema = Joi.object({
        message:Joi.string().required(),
        user_id:Joi.string().required(),
        message_template_id:Joi.string(),
        recipient_list_file:Joi.string(),
        recipient:Joi.string()
    });
    try {
        const queueURL = process.env.QUEUE_URL;
        const queueName = process.env.QUEUE_NAME;
        const BUCKET_NAME = process.env.BUCKET_NAME;
        console.log(queueURL);
        console.log(queueName);
        const {value, error, warning} = schema.validate(JSON.parse(event.body),{allowUnknown:true});
        if (error)
          return  util.returnError(400,error.stack);

        if (value.recipient_list_file !=null)
        {
            const bucketKey = value.recipient_list_file;

            console.log("file to search " + bucketKey);
            const params = {
                Bucket:BUCKET_NAME,
                Key:bucketKey,

            };
            try
            {
                const result = await S3.getObject(params).promise();
                console.log(result.Body.toJSON());
            }
            catch ( ex)
            {
                console.log("Error obteniendo el object " + ex.message);
            }
        }

        return {
            statusCode:200,
            body:event.body
            };


    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};



