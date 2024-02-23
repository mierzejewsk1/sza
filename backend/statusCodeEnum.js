const StatusCodeEnum = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

const ErrorCodeEnum = Object.freeze({
  INCORRECT_EMAIL: 100,
  ALL_FIELDS_MUST_BE_FILLED: 101,
  INCORRECT_EMAIL_OR_PASSWORD: 102,
  USER_DOES_NOT_EXIST: 103,
  PASSWORDS_DONT_MATCH: 104,
  NO_RESET_PASSWORD_TOKEN: 105,
  USER_ROOMMATE_HAS_ALREADY_EXIST: 106,
  RESET_TOKEN_EXPIRED: 107,
  ROOMMATE_REQUEST_HAS_BEEN_SENT: 108,
  USER_HAS_NO_TYPE: 109,
  USER_IS_NOT_INHABITANT: 110,
  USER_HAS_NO_EMAIL: 111,
  LACK_OF_TWO_PERSON_ROOMS: 112,
  INCORRECT_EMAIL_FORMAT: 113,
  EMAIL_WAS_TAKEN: 114,
  AUTHORIZATION_TOKEN_REQUIRED: 115,
  SESSION_EXPIRED: 116,
  INVALID_TOKEN: 117,
  CANT_ACCEPT_YOUR_OWN_REQUEST: 118,
  CANT_FIND_ROOMS_IN_DATABASE: 119,
  THERE_IS_NO_ROOM_WITH_THIS_ID: 120,
  USER_HAS_BEEN_ALREADY_ASSIGN_TO_ROOM: 121,
  ROOMMATE_HAS_ROOM_ASSIGN: 122,
  TOO_FEW_TWO_PERSON_ROOMS: 123,
  TOO_FEW_PLACES_IN_SELECTED_ROOM: 124,
  USER_HAS_NO_ROOM: 125,
  MORE_HOURS_NOT_AVAIABLE: 126,
  THERE_IS_NO_LAUNDRY_WITH_THIS_ID: 127,
  CANT_MANAGE_NOT_YOUR_ROOM: 128,
  THIS_USER_TYPE_CANNOT_DO_THIS: 129,
  INFORMATION_DOES_NOT_EXIST: 130,
  CANT_EDIT_THIS_OBJECT: 131,
  EXCHANGE_DOES_NOT_EXIST: 132,
  FAULT_DOES_NOT_EXIST: 133,
  FAULT_TYPE_DOES_NOT_EXIST: 134,
  PARAM_TYPE_IS_INAPPROPRIATE: 135,
  BAD_VARIABLE_TYPE: 136,
  VISIT_DOES_NOT_EXIST: 137,
  VISIT_HAS_ALREADY_EXIST: 138,
  CAN_NOT_ADD_MORE_VISITS: 139,
  CAN_NOT_DELETE_PAST_WASHING: 140,
  CAN_NOT_ADD_PAST_WASHING: 141,
  EMPLOYEE_WITH_THIS_EMAIL_EXIST: 142,
  EMPLOYEE_IS_ALREADY_DELETED: 143,
  INHABITANT_WITH_THIS_EMAIL_EXIST: 144,
  INHABITANT_IS_ALREADY_DELETED: 145,
});

module.exports = { StatusCodeEnum, ErrorCodeEnum };
