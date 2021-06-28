1- First install dynamodb local

	sls dynamodb install

2- Make changes to file 

    const dynamodb = require('serverless-dynamodb-client');

    var AWS = require('aws-sdk'),
    options = {
        region: "localhost",
        endpoint: "http://localhost:8000",
        accessKeyId: "xxxxxx",
        secretAccessKey: "xxxxxx"
    };
