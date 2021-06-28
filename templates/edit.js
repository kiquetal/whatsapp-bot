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

        console.log(USER_ID);




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
