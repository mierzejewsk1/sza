const { mysql } = require("../lib/mysql");

const UpdateImage = async (filename, userID) => {
  let query = `UPDATE o_users SET userImage = ? WHERE userID = ?
    `;
  let values = [filename, userID]
  return await mysql.app.select(query, values);
};

module.exports = {
  UpdateImage
};
