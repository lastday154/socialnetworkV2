"use strict";

const md5 = require("md5");
const dynamoDb = require("./dynamodb");
const { getRecipients } = require("./helper");
module.exports.retrieve = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (!data.sender || !data.text) {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      body: {
        success: true,
        message: "Couldn't retrieve because parameter missing"
      }
    });
    return;
  }

  const { sender: senderEmail, text } = data;
  const senderId = md5(senderEmail);
  const params = {
    TableName: process.env.FRIEND_TABLE,
    FilterExpression: "friendId = :id and #type <> :type",
    ExpressionAttributeNames: {
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":id": senderId,
      ":type": "block"
    }
  };

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
      return item.userId;
    });
    getRecipients(process.env.USER_TABLE, ids, text, callback);
  });
};
