"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const client = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports = client;
