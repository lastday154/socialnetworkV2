"use strict";

const { expect } = require("chai");
const {
  extractEmails,
  getCommonIds,
  createInQueryParams
} = require("../../friends/helper");

describe("Friends/Helper: ", () => {
  describe("createInQueryParams: ", () => {
    it("it should create params", async () => {
      const ids = [
        "74e65bc9c46c7c2d68bf7918a7628b38",
        "d4c74594d841139328695756648b6bd6"
      ];
      const actual = await createInQueryParams("friend-dev", ids);
      expect(actual).to.eql({
        TableName: "friend-dev",
        FilterExpression: "userId IN (:userId1,:userId2)",
        ExpressionAttributeValues: {
          ":userId1": "74e65bc9c46c7c2d68bf7918a7628b38",
          ":userId2": "d4c74594d841139328695756648b6bd6"
        }
      });
    });
    it("it should return empty array from text", async () => {
      const actual = await createInQueryParams("friend-dev", []);
      expect(actual).to.eql({
        TableName: "friend-dev",
        FilterExpression: "userId IN ()",
        ExpressionAttributeValues: {}
      });
    });
  });
  describe("extractEmails: ", () => {
    it("it should extract emails from text", async () => {
      const actual = await extractEmails("Hello World! kate@example.com");
      expect(actual).to.eql(["kate@example.com"]);
    });
    it("it should return empty array from text", async () => {
      const actual = await extractEmails("Hello World");
      expect(actual).to.eql(null);
    });
  });
  describe("getCommonIds: ", () => {
    it("it should get common ids", async () => {
      const ids = [
        "74e65bc9c46c7c2d68bf7918a7628b38",
        "d4c74594d841139328695756648b6bd6"
      ];
      const items = [
        {
          friendId: "3c98114d8e479f5da382f3401a832375",
          userId: "d4c74594d841139328695756648b6bd6",
          type: "friend"
        },
        {
          friendId: "669f75780c0de8df09debe82d62aa397",
          userId: "d4c74594d841139328695756648b6bd6",
          type: "friend"
        },
        {
          friendId: "74e65bc9c46c7c2d68bf7918a7628b38",
          userId: "d4c74594d841139328695756648b6bd6",
          type: "friend"
        },
        {
          friendId: "3c98114d8e479f5da382f3401a832375",
          userId: "74e65bc9c46c7c2d68bf7918a7628b38",
          type: "friend"
        },
        {
          friendId: "669f75780c0de8df09debe82d62aa397",
          userId: "74e65bc9c46c7c2d68bf7918a7628b38",
          type: "friend"
        }
      ];
      const actual = await getCommonIds(items, ids);
      expect(actual).to.eql([
        "3c98114d8e479f5da382f3401a832375",
        "669f75780c0de8df09debe82d62aa397"
      ]);
    });
    it("it should return empty array if no common ids", async () => {
      const ids = [
        "74e65bc9c46c7c2d68bf7918a7628b38",
        "d4c74594d841139328695756648b6bd6"
      ];
      const items = [
        {
          friendId: "3c98114d8e479f5da382f3401a832375",
          userId: "d4c74594d841139328695756648b6bd6",
          type: "friend"
        },
        {
          friendId: "669f75780c0de8df09debe82d62aa397",
          userId: "d4c74594d841139328695756648b6bd6",
          type: "friend"
        }
      ];
      const actual = await getCommonIds(ids, items);
      expect(actual).to.eql([]);
    });
  });
});
