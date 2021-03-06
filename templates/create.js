'use strict';

const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('./util');
module.exports.handler = async (event, context) => {
    const schema = Joi.object({
        user_id: Joi.string()
            .required(),
        message_text: Joi.string()
            .required(),
        template_name: Joi.string()
            .required(),
        idempotent_key:Joi.string()
            .optional()
    });
    try {
        const TABLE_NAME = process.env.TEMPLATE_TABLE;
        console.log(TABLE_NAME);

        const {value, error, warning} = schema.validate(JSON.parse(event.body),{allowUnknown:true});
        if (value["idempotent_key"])
        {
            const params = {
                TableName: TABLE_NAME,
                IndexName: 'template-id-index',
                KeyConditionExpression: 'template_id = :template_id',
                ExpressionAttributeValues: {
                    ':template_id': value['idempotent_key'],
                }
            };

            try
            {
                const  data   = await dynamodb
                    .doc.query(params)
                    .promise();

;
                if (data.Items.length >0)
                {
                    return {
                        statusCode: httpStatus.OK,
                        body: JSON.stringify(data.Items[0]),

                    }
                }
                else
                {
                    delete value['idempotent_key'];
                }

            }
            catch (err) {
               return util.returnError(500, err);
            };


        }

        value["template_id"] = uuid();
        if (!error) {

            const params = {
                TableName: TABLE_NAME,
                Item: value,
                ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
                ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
                ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
            };

            console.log(params);
           const {error,response } = await dynamodb.doc.put(params).promise();
            if (error)
            {
                throw new Error(error);
            }

            return {
                statusCode: httpStatus.CREATED,
                body: JSON.stringify(value),

            };

        } else {

            return util.returnError(400,error.stack);
        }
    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};



