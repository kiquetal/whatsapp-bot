const httpStatus = require('http-status');
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
}

module.exports = {

    returnError: returnError

}
