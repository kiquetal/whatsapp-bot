'use strict';
const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('./util');
module.exports.handler = async (event, context) => {
    const schema = Joi.object({
        message_text: Joi.string()
            .required(),
        template_name: Joi.string()
            .required()
    });
    try {
        const TABLE_NAME = process.env.TEMPLATE_TABLE;
        const USER_ID = event.pathParameters.user_id;
        const TEMPLATE_ID = event.pathParameters.template_id;
        const {value, error, warning} = schema.validate(JSON.parse(event.body),{allowUnknown:true});
        if (error)
        {
            return util.returnError(400,error.stack);
        }

        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'user_id = :user_id AND template_id = :template_id',
            ExpressionAttributeValues: {
                ':template_id': TEMPLATE_ID,
                ":user_id":USER_ID
            }
        };

         const data = await   dynamodb.doc.query(params).promise()
            console.log("util"+ JSON.stringify(util));
           if (data.Items.length<1)
           {
               return {
                   statusCode:httpStatus.NOT_FOUND,
                   body:JSON.stringify({"message":"User/template didnt return values"})
               }
           }
           const updateParamas = {
               TableName: TABLE_NAME,
               Key: { 'user_id' : USER_ID,
                      'template_id': TEMPLATE_ID},
               UpdateExpression: 'SET message_text = :message_text, template_name = :template_name',
               ExpressionAttributeValues: {
                   ':message_text' : value.message_text,
                   ':template_name' : value.template_name,
               },
               ReturnValues:'ALL_NEW'
           };

           const update = await  dynamodb.doc.update(updateParamas).promise()
           return {
               statusCode:httpStatus.OK,
               body:JSON.stringify({"message":update})
           }

    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};

