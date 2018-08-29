"use strict";

const md5 = require("md5");
const dynamoDb = require("./dynamodb");
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
    let userIds = {};
    let index = 0;
    result.Items.forEach(function(item) {
      index++;
      let userIdKey = ":userId" + index;
      userIds[userIdKey.toString()] = item.friendId;
    });

    const params = {
      TableName: process.env.USER_TABLE,
      FilterExpression: "userId IN (" + Object.keys(userIds).toString() + ")",
      ExpressionAttributeValues: userIds
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
      // create a response
      const friends = result.Items.map(item => {
        return item.email;
      });
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          count: result.Count,
          friends
        })
      };
      callback(null, response);
    });
  });
};
