'use strict';

const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
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
            return returnError(400,error.stack);
        }

        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'user_id = :user_id AND template_id = :template_id',
            ExpressionAttributeValues: {
                ':template_id': TEMPLATE_ID,
                ":user_id":USER_ID
            }
        };

       try{
        const data = await   dynamodb.doc.query(params).promise()

           if (data.Items.length<1)
           {
               return {
                   statusCode:httpStatus.NOT_FOUND,
                   body:JSON.stringify({"message":"User/template didnt return values"})
               }
           }






       }
       catch (e)
       {
           return returnError(500,e.message);
       }

        return {
            statusCode:httpStatus.OK,
            body:JSON.stringify({"userId":USER_ID,"template_id":TEMPLATE_ID})
        }

    }
    catch (e) {
        console.log("catch error");
        return returnError(500, e.message);
    }
};



const returnError = (code,msg) => {
    switch(code)
    {
        case 400:
            return {
                statusCode: httpStatus.BAD_REQUEST,
                body: JSON.stringify({"message":msg})
            };
        case 404:
            return {
                statusCode: httpStatus.NOT_FOUND,
                body: JSON.stringify({"message":msg})
            };
        case 500:
            return {
                statusCode: httpStatus.INTERNAL_SERVER_ERROR,
                body: JSON.stringify({"message":msg}),

            };

    }
};
