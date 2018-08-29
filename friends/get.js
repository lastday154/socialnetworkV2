"use strict";

const md5 = require("md5");
const dynamoDb = require("./dynamodb");
const { getEmailsByIds } = require("./helper");

module.exports.get = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const email = data.email;

  const params = {
    TableName: process.env.FRIEND_TABLE,
    KeyConditionExpression: "#userId = :id",
    ExpressionAttributeNames: {
      "#userId": "userId"
    },
    ExpressionAttributeValues: {
      ":id": md5(email)
    }
  };

  dynamoDb.query(params, (error, result) => {
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
    if (result.Count === 0) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          message: "There is no friends for the given email"
        })
      });
    }
    const ids = result.Items.map(item => {
      return item.friendId;
    });
    getEmailsByIds(process.env.USER_TABLE, ids, callback);
  });
};
