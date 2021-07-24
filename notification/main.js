'use strict';
const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('../templates/util');
const AWS = require('aws-sdk');
const S3= new AWS.S3();
const SQS = new AWS.SQS();
module.exports.handler = async (event, context) => {
    const schema = Joi.object({
        file_name: Joi.string()
            .required()
    });
    try {

        const queueURL = process.env.QUEUE_URL;
        const queueName = process.env.QUEUE_NAME;
        console.log(queueURL);
        console.log(queueName);
        const {value, error, warning} = schema.validate(JSON.parse(event.body),{allowUnknown:true});
        if (error)
            util.returnError(400,error.stack);


    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};



