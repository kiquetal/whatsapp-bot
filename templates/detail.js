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
        const TEMPLATE_ID = event.pathParameters.template_id;
        const queryParam = {
            TableName: TABLE_NAME,
            KeyConditionExpression:"user_id = :user_id and template_id = :template_id",
            ExpressionAttributeValues: {
              ':user_id':USER_ID,
              ':template_id':TEMPLATE_ID
            }
        };

        console.log(JSON.stringify(queryParam));

        const data = await  dynamodb.doc.query(queryParam).promise();
        if (data.Items.length<1)
        {
            return util.returnError(404,'UserId/Template does not exists.');
        }

        return {
            statusCode:httpStatus.OK,
            body:JSON.stringify({"message":data.Items[0]})
        }

    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};

