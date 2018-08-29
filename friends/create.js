"use strict";

const md5 = require("md5");
const dynamoDb = require("./dynamodb");

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (!data.friends) {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      body: {
        success: true,
        message: "Couldn't create friends"
      }
    });
    return;
  }
  const emails = data.friends;
  const params = {
    RequestItems: {}
  };
  params.RequestItems[process.env.USER_TABLE] = emails.map(email => {
    return {
      PutRequest: {
        Item: {
          userId: md5(email),
          email
        }
      }
    };
  });
  params.RequestItems[process.env.FRIEND_TABLE] = [
    {
      PutRequest: {
        Item: {
          userId: md5(emails[0]),
          friendId: md5(emails[1])
        }
      }
    }
  ];
  dynamoDb.batchWrite(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        body: {
          success: true,
          message: "Couldn't create friends"
        }
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    };
    callback(null, response);
  });
};
