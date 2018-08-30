"use strict";

const { updateRelationship } = require("./helper");

module.exports.subscribe = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (!data.requestor || !data.target) {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      body: {
        success: true,
        message: "Couldn't subscribe because parameter missing"
      }
    });
    return;
  }
  updateRelationship(data, "subscribe", callback);
};
