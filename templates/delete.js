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
        const deleteParams = {
            TableName: TABLE_NAME,
            Key: {
              'user_id':USER_ID,
              'template_id':TEMPLATE_ID
            },
            ConditionExpression: 'attribute_exists(template_id)',
        };


                 await   dynamodb.doc.delete(deleteParams).promise()
            return {
                statusCode:httpStatus.OK,
                body:JSON.stringify({"message":`Template: ${TEMPLATE_ID} removed` })
            }

    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};

