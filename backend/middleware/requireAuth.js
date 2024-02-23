const query = require("../queries/userQueries");
const jwt = require("jsonwebtoken");
const { StatusCodeEnum, ErrorCodeEnum } = require("../statusCodeEnum");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization === null || authorization === undefined)
    return res
      .setHeader(
        "response-header",
        ErrorCodeEnum.NO_AUTHORIZATION_TOKEN_PROVIDED
      )
      .status(StatusCodeEnum.UNAUTHORIZED)
      .send();

  const token = authorization.split(" ")[1];
  try {
    const { userID } = jwt.verify(token, process.env.SECRET);

    const [user] = await query.FindUserById(userID);

    if (user === undefined)
      return res
        .setHeader("response-header", ErrorCodeEnum.USER_DOES_NOT_EXIST)
        .status(StatusCodeEnum.BAD_REQUEST)
        .send();

    if (user.userToken !== token)
      return res
        .setHeader("response-header", ErrorCodeEnum.SESSION_EXPIRED)
        .status(StatusCodeEnum.UNAUTHORIZED)
        .send();

    req.user = { userID: user.userID };
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError)
      return res
        .setHeader("response-header", ErrorCodeEnum.SESSION_EXPIRED)
        .status(StatusCodeEnum.UNAUTHORIZED)
        .send();
    else
      return res
        .setHeader("response-header", ErrorCodeEnum.INVALID_TOKEN)
        .status(StatusCodeEnum.UNAUTHORIZED)
        .send();
  }
};

module.exports = requireAuth;
