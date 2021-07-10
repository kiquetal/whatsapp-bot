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

    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};



