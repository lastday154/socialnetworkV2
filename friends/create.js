"use strict";

const { updateRelationship } = require("./helper");

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
  updateRelationship(
    { requestor: emails[0], target: emails[1] },
    "friend",
    callback
  );
};
