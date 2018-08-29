"use strict";

const md5 = require("md5");
const dynamoDb = require("./dynamodb");
const {
  getEmailsByIds,
  createInQueryParams,
  getCommonIds
} = require("./helper");

module.exports.common = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (!data.friends) {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      body: {
        success: true,
        message: "Couldn't get friends"
      }
    });
    return;
  }
  const ids = data.friends.map(email => {
    return md5(email);
  });
  const params = createInQueryParams(process.env.FRIEND_TABLE, ids);
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        body: JSON.stringify({
          success: false,
          message: "Couldn't fetch emails"
        })
      });
      return;
    }
    const commonIds = getCommonIds(result.Items, ids);
    if (commonIds.length === 0) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          message: "There is no common friends for the given emails"
        })
      });
      return;
    }
    getEmailsByIds(process.env.USER_TABLE, commonIds, callback);
  });
};
