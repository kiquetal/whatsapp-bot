'use strict';
const dynamodb = require('serverless-dynamodb-client');
const Joi = require('joi');
const httpStatus = require('http-status');
const uuid = require('uuid');
const util = require('../templates/util');
const AWS = require('aws-sdk');
const SQS = new AWS.SQS();
const csv = require('@fast-csv/format');
const Buffer = require("buffer");

module.exports.handler = async (event, context) => {

    const S3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER',
        endpoint: new AWS.Endpoint('http://localhost:4569'),
    });



    const schema = Joi.object({
        message:Joi.string().required(),
        user_id:Joi.string().required(),
        message_template_id:Joi.string(),
        recipient_list_file:Joi.string(),
        recipient:Joi.string()
    });
    try {

        const queueURL = process.env.QUEUE_URL;
        const queueName = process.env.QUEUE_NAME;
        const BUCKET_NAME = process.env.BUCKET_NAME
        console.log(BUCKET_NAME);
        console.log(queueURL);
        console.log(queueName);



       // writeToS3Locally(csv,S3,BUCKET_NAME);




        const {value, error, warning} = schema.validate(JSON.parse(event.body),{allowUnknown:true});
        if (error)
          return  util.returnError(400,error.stack);

        if (value.recipient_list_file !=null)
        {
            const bucketKey = value.recipient_list_file;

            console.log("bucketKey" + bucketKey);
            const params = {
                Bucket:BUCKET_NAME,
                Key:bucketKey

            };
            try{


                console.log("obtener s3 locally");
           const result = await S3.getObject(params).createReadStream();



           result.on("data",function (data) {
               console.log(data.toString());
           });

                result.on('end',function() {
                    console.log("end");
                });
           result.on('error',result=> {
               console.log(result);
           });






            }
            catch ( ex)
            {
                console.log("Error obteniendo el object " + ex.message);
            }
        }
        else
        {
            console.log("no recibido el bucketKey");
        }

        return {
            statusCode:200,
            body:event.body
            };


    }
    catch (e) {
        console.log("catch error");
        return util.returnError(500, e.message);
    }
};

const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });



function writeToS3Locally(csv,s3,BUCKET_NAME)
{

    csv.writeToBuffer([{"data":"123123"},{"data":"2312321"}],{
        headers:false
    }).then((val) => {

        s3.putObject({
            Bucket: BUCKET_NAME,
            Key: 'phones.csv',
            ContentType:'text/csv',
            Body: val
        }, () => {
            console.log("hemos escrito en local");
        } );


    });

}
