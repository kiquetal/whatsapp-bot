'use strict';

const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('../templates/util');
const AWS = require('aws-sdk');
const S3= new AWS.S3();
module.exports.handler = async (event, context) => {
    const schema = Joi.object({
        file_name: Joi.string()
            .required()
    });
    try {

        const {value, error, warning} = schema.validate(JSON.parse(event.body),{allowUnknown:true});
        if (error)
            util.returnError(400,error.stack);

        const bucketName = process.env['BUCKET_NAME'];
        console.log(bucketName);
        const bucketKey = value['file_name'];
        const contentType = value['content_type'];
        console.log(contentType);
        const params = {
            Bucket:bucketName,
            Key:bucketKey,
            ContentType:contentType
        };
        console.log(JSON.stringify(params));
        var url =  S3.getSignedUrl('putObject', params);

           return {
            statusCode: httpStatus.OK,
            body:JSON.stringify({"message":url})

        }

    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};



