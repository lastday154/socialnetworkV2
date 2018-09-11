"use strict";

const dynamoDb = require("./dynamodb");
const md5 = require("md5");

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

function extractEmails(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

const getRecipients = (tableName, ids, text, callback) => {
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
    let friends = result.Items.map(item => {
      return item.email;
    });
    friends = friends.concat(extractEmails(text));
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        recipients: friends
      })
    };
    callback(null, response);
  });
};

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

function updateRelationship(data, relationshipType, callback) {
  const { requestor: requestorEmail, target: targetEmail } = data;
  const requestorId = md5(requestorEmail);
  const targetId = md5(targetEmail);
  const params = {
    RequestItems: {}
  };
  params.RequestItems[process.env.USER_TABLE] = [
    {
      PutRequest: {
        Item: {
          userId: requestorId,
          email: requestorEmail
        }
      }
    },
    {
      PutRequest: {
        Item: {
          userId: targetId,
          email: targetEmail
        }
      }
    }
  ];
  switch (relationshipType) {
    case "friend":
      params.RequestItems[process.env.FRIEND_TABLE] = [
        {
          PutRequest: {
            Item: {
              userId: requestorId,
              friendId: targetId,
              type: relationshipType
            }
          }
        },
        {
          PutRequest: {
            Item: {
              userId: targetId,
              friendId: requestorId,
              type: relationshipType
            }
          }
        }
      ];
    default:
      params.RequestItems[process.env.FRIEND_TABLE] = [
        {
          PutRequest: {
            Item: {
              userId: requestorId,
              friendId: targetId,
              type: relationshipType
            }
          }
        }
      ];
  }

  dynamoDb.batchWrite(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        body: {
          success: true,
          message: "Couldn't subscribe"
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
}
module.exports = {
  getEmailsByIds,
  createInQueryParams,
  getCommonIds,
  updateRelationship,
  getRecipients
};
