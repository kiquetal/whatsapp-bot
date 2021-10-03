'use strict';
const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('./util');
module.exports.handler = async (event, context) => {
    try {
        console.log("obtener for template_id");
        const TABLE_NAME = process.env.TEMPLATE_TABLE;
        const TEMPLATE_ID = event.pathParameters.template_id;
        const queryParam = {
            TableName: TABLE_NAME,
            IndexName:"template-id-index",
            KeyConditionExpression:"template_id = :template_id",
            ExpressionAttributeValues:{
                ":template_id":TEMPLATE_ID
            }

        }


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

