# CS571 HW5 API Documentation

## At a Glance

All routes are relative to `https://www.coletnelson.us/cs571/f22/hw5/api/`

| Method | URL | Purpose | Return Codes |
| --- | --- | --- | --- |
| `GET`| `/chatroom` | Get all chatrooms. | 200, 304 |
| `GET` | `/chatroom/:chatroomName/messages`| Get latest 25 messages for specified chatroom. | 200, 304, 404 |
| `POST` | `/chatroom/:chatroomName/messages` | Posts a message to the specified chatroom. Requires JWT. | 200, 400, 404, 413 |
| `DELETE` | `/chatroom/:chatroomName/messages/:messageId` | Deletes the given message. Requires JWT. | 200, 400, 401, 404 |
| `POST` | `/register` | Registers a user account and returns a JWT. | 200, 400, 401, 409, 413  |
| `POST` | `/login` | Logs a user in, returning a JWT. | 200, 400, 401, 404 |

An unexpected server error `500` *may* occur during any of these requests. It is likely to do with your request. Make sure that you have included the appropriate headers and, if you are doing a POST, that you have a properly formatted JSON body. If the error persists, please contact a member of the course staff.

## In-Depth Explanations

### Getting all Chatrooms
`GET` `https://www.coletnelson.us/cs571/f22/hw5/api/chatroom`

A `200` (new) or `304` (cached) response will be sent with the list of all chatrooms.

```json
[
    "Arboretum",
    "Capitol",
    "Chazen",
    "Epic",
    "HenryVilas",
    "MemorialTerrace",
    "Mendota",
    "Olbrich"
]
```

### Getting Messages for Chatroom

`GET` `https://www.coletnelson.us/cs571/f22/hw5/api/chatroom/:chatroomName`

There is no get all messages; you must get messages for a particular `:chatroomName`. All messages are public, you do *not* need a JWT to access them. Only up to the latest 25 messages will be returned. A `200` (new) or `304` (cached) response will be sent with messages organized from most recent to least recent.

```json
{
    "msg": "Successfully got the latest messages!",
    "messages": [
        {
            "id": 2,
            "poster": "ctnelson2",
            "title": "Test Post",
            "content": "Second Test Post",
            "chatroom": "HenryVilas"
        },
        {
            "id": 1,
            "poster": "ctnelson2",
            "title": "Hello World!",
            "content": "This is our first post.",
            "chatroom": "HenryVilas"
        }
    ]
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

### Registering a User
`POST` `https://www.coletnelson.us/cs571/f22/hw5/api/register`

You must register a user with a specified `username` and `password`. The `refCode` is recieved via email from your instructor. The `refCode` is your personal secret used to link your registrations to your wisc account, so be appropriate and mindful when posting messages! :)

Request headers must include `Content-Type: application/json`.

**Example Request Body**

```json
{
    "username": "test12456",
    "password": "p@ssw0rd1",
    "refCode": "bid_999999999999"
}
```

If the registration is successful, the following `200` will be sent...
```json
{
    "msg": "Successfully created user!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ0ZXN0MTI0NTYiLCJpYXQiOjE2NjUyODA3MzEsImV4cCI6MTY2NTI4NDMzMX0.rCJxUFh6osPcjRC3ti7SMdxey_LnhmSRdK5JDLXw1q0",
    "user": {
        "id": 4,
        "username": "test12456"
    }
}
```

The provided token is an irrevocable JWT that will be valid for **1 hour**.

If you forget to include a `username`, `password`, or `refCode`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'username', 'password', and 'refCode'"
}
```

If you provide an incorrect `refCode`, the following `401` will be sent...

```json
{
    "msg": "An invalid refCode was provided."
}
```

If a user by the requested `username` already exists, the following `409` will be sent...

```json
{
    "msg": "The user already exists!"
}
```

If the `username` is longer than 64 characters or if the `password` is longer than 128 characters, the following `413` will be sent...

```json
{
    "msg": "'username' must be 64 characters or fewer and 'password' must be 128 characters or fewer"
}
```

### Logging in to an Account

`POST` `https://www.coletnelson.us/cs571/f22/hw5/api/login`

You must log a user in with their specified `username` and `password`. No `refCode` is needed at this stage, we already know it from registration!

Request headers must include `Content-Type: application/json`.

**Example Request Body**

```json
{
    "username": "test12456",
    "password": "pass123"
}
```

If the login is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully authenticated.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ0ZXN0MTI0NTYiLCJpYXQiOjE2NjUyODI0ODAsImV4cCI6MTY2NTI4NjA4MH0.-iwzPtMxW3dGl6bxw7lNkBFtQwUNFV723OnzuEPAFc0"
}
```

The provided token is an irrevocable JWT that will be valid for **1 hour**.

If you forget the `username` or `password`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'username' and 'password'"
}
```

If the `username` exists but the `password` is incorrect, the following `401` will be sent...

```json
{
    "msg": "Incorrect password."
}
```

If the `username` does not exist, the following `404` will be sent...

```json
{
    "msg": "That user does not exist!"
}
```

### Posting a Message

`POST` `https://www.coletnelson.us/cs571/f22/hw5/api/chatroom/:chatroomName/messages`

Posting a message is a protected operation; you must have a JWT from the login or register endpoint. The `:chatroomName` must be specified in the URL, and a post must also have a `title` and `content`.

Request headers must include `Content-Type: application/json` and `Authorization: Bearer :JWT` where `:JWT` is your JWT.

**Example Request Body**

```json
{
    "title": "My Test Post",
    "content": "lorem ipsum dolor sit"
}
```

If the post is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully posted message!"
}
```

If you forget the `title` or `content`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'title' and 'content'"
}
```

If you forget to provide a JWT, the following `401` will be sent...

```json
{
    "msg": "Missing 'Authorization' header."
}
```

If the JWT you provide is invalid (such as malformed or expired), the following `401` will be sent...

```json
{
    "msg": "You must be logged in to make a post!"
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

If the `title` is longer than 128 characters or if the `content` is longer than 1024 characters, the following `413` will be sent...
```json
{
    "msg": "'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer"
}
```

### Deleting a Message
`DELETE` `https://www.coletnelson.us/cs571/f22/hw5/api/chatroom/:chatroomName/messages/:messageId`

Deleting a message is a protected operation; you must have a JWT from the login or register endpoint. The `:chatroomName` and `:messageId` must be specified in the URL.

Request headers must include `Authorization: Bearer :JWT` where `:JWT` is your JWT.

There is no request body for this request.

If the delete is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully deleted message!"
}
```

If you forget to provide a JWT, the following `401` will be sent...

```json
{
    "msg": "Missing 'Authorization' header."
}
```

If the JWT you provide is invalid (such as malformed or expired), the following `401` will be sent...

```json
{
    "msg": "You must be logged in to make a post!"
}
```

If you try to delete another user's post, the following `401` will be sent...

```json
{
    "msg": "You may not delete another user's post!"
}
```


If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

If a message is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "That message does not exist!"
}
```