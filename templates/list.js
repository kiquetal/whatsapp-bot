'use strict';
const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('./util');
module.exports.handler = async (event, context) => {
    try {
        const TABLE_NAME = process.env.TEMPLATE_TABLE;
        const USER_ID = event.pathParameters.user_id;
        const queryParam = {
            TableName: TABLE_NAME,
            KeyConditionExpression:"user_id = :user_id",
            ExpressionAttributeValues: {
                ':user_id':USER_ID,
            },
            ProjectionExpression:'template_id,message_text,template_name'

        };
        console.log(queryParam);
        const data = await  dynamodb.doc.query(queryParam).promise();
        if (data.Items.length<1)
        {
            return util.returnError(404,'UserId/Template does not exists.');
        }

        return {
            statusCode:httpStatus.OK,
            body:JSON.stringify({"user":USER_ID, "message":data.Items})
        }

    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};

