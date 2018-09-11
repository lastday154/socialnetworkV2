# Serverless REST API

This example demonstrates how to setup a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create and get defintions of word. DynamoDB is used to store the data. This is just an example and of course you could use any data storage as a backend.

## Structure

This service has a separate directory for all CRUD operations. For each operation exactly one file exists e.g. `friends/get.js`. In each of these files there is exactly one function which is directly attached to `module.exports`.

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

```bash
npm install
```

## Run local

```bash
npm start
```

## Run test

```bash
npm test
```

## Deploy

In order to deploy the endpoint simply run

```bash
npm run deploy
```

The expected result should be similar to:

```bash
Serverless: Stack update finished...
Service Information
service: friends-management
stage: dev
region: us-east-1
stack: friends-management-dev
api keys:
  None
endpoints:
  POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/create
  POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/get
  POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/common
  POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/subscribe
  POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/block
  POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/retrieve
functions:
  create: friends-management-dev-create
  get: friends-management-dev-get
  common: friends-management-dev-common
  subscribe: friends-management-dev-subscribe
  block: friends-management-dev-block
  retrieve: friends-management-dev-retrieve
```

### Background

For any application with a need to build its own social network, "Friends Management" is a common requirement
which usually starts off simple but can grow in complexity depending on the application's use case.

Usually, applications would start with features like "Friend", "Unfriend", "Block", "Receive Updates" etc.

### Your Task

Develop an API server that does simple "Friend Management" based on the User Stories below.

You are required to:

- Deploy an instance of the API server on the public cloud or provide a 1-step command to run your API server locally, e.g. using a Makefile or Docker Compose) for us to test run the APIs
- Write sufficient documentation for the APIs and explain your technical choices

#### User Stories

**1. As a user, I need an API to create a friend connection between two email addresses.**
POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/create

The API should receive the following JSON request:

```
{
  "friends":
    [
      "andy@example.com",
      "john@example.com"
    ]
}
```

The API should return the following JSON response on success:

```
{
  "success": true
}
```

Please propose JSON responses for any errors that might occur.

**2. As a user, I need an API to retrieve the friends list for an email address.**
POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/get

The API should receive the following JSON request:

```
{
  "emai": "andy@example.com"
}
```

The API should return the following JSON response on success:

```
{
  "success": true,
  "friends" :
    [
      'john@example.com'
    ],
  "count" : 1
}
```

Please propose JSON responses for any errors that might occur.

**3. As a user, I need an API to retrieve the common friends list between two email addresses.**
POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/common

The API should receive the following JSON request:

```
{
  "friends":
    [
      "andy@example.com",
      "john@example.com"
    ]
}
```

The API should return the following JSON response on success:

```
{
  "success": true,
  "friends" :
    [
      'common@example.com'
    ],
  "count" : 1
}
```

Please propose JSON responses for any errors that might occur.

**4. As a user, I need an API to subscribe to updates from an email address.**
POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/subscribe

Please note that "subscribing to updates" is NOT equivalent to "adding a friend connection".

The API should receive the following JSON request:

```
{
  "requestor": "lisa@example.com",
  "target": "john@example.com"
}
```

The API should return the following JSON response on success:

```
{
  "success": true
}
```

Please propose JSON responses for any errors that might occur.

**5. As a user, I need an API to block updates from an email address.**
POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/block

Suppose "andy@example.com" blocks "john@example.com":

- if they are connected as friends, then "andy" will no longer receive notifications from "john"
- if they are not connected as friends, then no new friends connection can be added

The API should receive the following JSON request:

```
{
  "requestor": "andy@example.com",
  "target": "john@example.com"
}
```

The API should return the following JSON response on success:

```
{
  "success": true
}
```

Please propose JSON responses for any errors that might occur.

**6. As a user, I need an API to retrieve all email addresses that can receive updates from an email address.**
POST - https://07l04vjwi6.execute-api.us-east-1.amazonaws.com/dev/friends/retrieve

Eligibility for receiving updates from i.e. "john@example.com":

- has not blocked updates from "john@example.com", and
- at least one of the following:
  - has a friend connection with "john@example.com"
  - has subscribed to updates from "john@example.com"
  - has been @mentioned in the update

The API should receive the following JSON request:

```
{
  "sender":  "john@example.com",
  "text": "Hello World! kate@example.com"
}
```

The API should return the following JSON response on success:

```
{
  "success": true
  "recipients":
    [
      "lisa@example.com",
      "kate@example.com"
    ]
}
```

Please propose JSON responses for any errors that might occur.
