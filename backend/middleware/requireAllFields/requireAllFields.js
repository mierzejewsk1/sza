const { HeaderEnum } = require("../../headersEnum");
const { StatusCodeEnum, ErrorCodeEnum } = require("../../statusCodeEnum");

function validateBodyFields(fields) {
  return function (req, res, next) {
    for (let field of fields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res
          .setHeader(
            HeaderEnum.RESPONSE_HEADER,
            ErrorCodeEnum.ALL_FIELDS_MUST_BE_FILLED
          )
          .status(StatusCodeEnum.BAD_REQUEST)
          .send();
      }
    }
    next();
  };
}

module.exports = validateBodyFields;
