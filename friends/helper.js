"use strict";

const dynamoDb = require("./dynamodb");

function getCommonIds(items, ids) {
  const friendList1 = [];
  const friendList2 = [];
  items.forEach(item => {
    if (item.userId == ids[0]) {
      friendList1.push(item.friendId);
    }
    if (item.userId == ids[1]) {
      friendList2.push(item.friendId);
    }
  });
  return friendList1.filter(id => {
    return friendList2.indexOf(id) != -1;
  });
}

function createInQueryParams(tableName, ids) {
  let userIds = {};
  let index = 0;
  ids.forEach(function(id) {
    index++;
    let userIdKey = ":userId" + index;
    userIds[userIdKey.toString()] = id;
  });
  const params = {
    TableName: tableName,
    FilterExpression: "userId IN (" + Object.keys(userIds).toString() + ")",
    ExpressionAttributeValues: userIds
  };
  return params;
}

const getEmailsByIds = (tableName, ids, callback) => {
  const params = createInQueryParams(tableName, ids);
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
};

module.exports = {
  getEmailsByIds,
  createInQueryParams,
  getCommonIds
};
