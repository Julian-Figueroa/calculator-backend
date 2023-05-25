# Arithmetic Calculator REST API

## TODO

- Add User Records endpoints
- Add Unit Testing
- Add API documentation
- Deploy using Vercel

## Development

Note: The Postgres DB must be up and running on the proper Docker container

```bash
npm install
npm run server
```

## Testing

The API must be up and running

```bash
npm run test
```

# API

## Get health check

Given an active `Facility`, when I request all available `Shifts` within a start and end date, then it will return a list of `Shifts` from that `Facility` in the specified date range

### `GET http://localhost:8080/`

### Response

```json
{
  "message": "OK"
}
```

## Create User

Create a new user.

- **URL**: `/users`
- **Method**: `POST`
- **Authentication**: Not required

### Request Body

| Field      | Type   | Required | Description                                                            |
| ---------- | ------ | -------- | ---------------------------------------------------------------------- |
| `username` | String | Yes      | The email address of the user. Must be a valid email format.           |
| `password` | String | Yes      | The password of the user. Must be at least 6 characters long.          |
| `balance`  | Number | No       | The initial balance of the user. If not provided, default value is 50. |

### Response

If the request is successful, the API will respond with a JSON object containing the generated access token.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InVzZXIxIn0sImlhdCI6MTYyMTA0NzM0NywiZXhwIjoxNjIxMDUwOTQ3fQ.RaNl2n-BgCGtVYfY-VFv2gCIwFJhGnyjFCluNvA2eH8"
}
```

## Create User

Create a new user.

- **URL**: `/users`
- **Method**: `POST`
- **Authentication**: Not required

### Request Body

| Field      | Type   | Required | Description                                                            |
| ---------- | ------ | -------- | ---------------------------------------------------------------------- |
| `username` | String | Yes      | The email address of the user. Must be a valid email format.           |
| `password` | String | Yes      | The password of the user. Must be at least 6 characters long.          |
| `balance`  | Number | No       | The initial balance of the user. If not provided, default value is 50. |

### Response

If the request is successful, the API will respond with a JSON object containing the generated access token.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InVzZXIxIn0sImlhdCI6MTYyMTA0NzM0NywiZXhwIjoxNjIxMDUwOTQ3fQ.RaNl2n-BgCGtVYfY-VFv2gCIwFJhGnyjFCluNvA2eH8"
}
```

## Get Logged-in User

Get the details of the currently logged-in user.

- **URL**: `/auth`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)

### Response

If the request is successful and the user is authenticated, the API will respond with a JSON object containing the user details.

```json
{
  "id": 1,
  "username": "user@example.com",
  "balance": 100
}
```

## Authenticate User and Get Token

Authenticate a user with their credentials and get an access token.

- **URL**: `/auth`
- **Method**: `POST`
- **Authentication**: Not required

### Request Body

| Field      | Type   | Required | Description                                                  |
| ---------- | ------ | -------- | ------------------------------------------------------------ |
| `username` | String | Yes      | The email address of the user. Must be a valid email format. |
| `password` | String | Yes      | The password of the user.                                    |

### Response

If the authentication is successful, the API will respond with a JSON object containing the generated access token.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InVzZXIxIn0sImlhdCI6MTYyMTA0NzM0NywiZXhwIjoxNjIxMDUwOTQ3fQ.RaNl2n-BgCGtVYfY-VFv2gCIwFJhGnyjFCluNvA2eH8"
}
```

## Perform New Operation

Perform a new operation on a user's balance.

- **URL**: `/new-operation`
- **Method**: `POST`
- **Authentication**: Required (Bearer token)

### Request Body

| Field    | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| `type`   | String | Yes      | The type of operation to perform. |
| `amount` | Number | Yes      | The amount for the operation.     |

### Response

If the request is successful, the API will respond with a JSON object containing the result of the operation and the updated user balance.

```json
{
  "result": 25,
  "balance": 75
}
```

## Get User Records

Retrieve records for a specific user.

- **URL**: `/user/:userId/records`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)

### URL Parameters

| Parameter | Type   | Required | Description                             |
| --------- | ------ | -------- | --------------------------------------- |
| `userId`  | Number | Yes      | The ID of the user whose records to get |

### Query Parameters

| Parameter | Type   | Required | Default | Description                                                         |
| --------- | ------ | -------- | ------- | ------------------------------------------------------------------- |
| `page`    | Number | No       | 1       | The page number of records to retrieve                              |
| `perPage` | Number | No       | 10      | The number of records to retrieve per page                          |
| `sort`    | String | No       | 'asc'   | The sorting order of the records. Possible values: 'asc' or 'desc'  |
| `filter`  | String | No       | ''      | Filter records based on amount, user balance, or operation response |

### Response

If the request is successful, the API will respond with a JSON array containing the user's records.

```json
[
  {
    "id": 1,
    "amount": 10,
    "user_balance": 50,
    "operation_response": 60,
    "createdAt": "2023-05-23T12:34:56Z",
    "updatedAt": "2023-05-23T12:34:56Z"
  },
  {
    "id": 2,
    "amount": 5,
    "user_balance": 45,
    "operation_response": 40,
    "createdAt": "2023-05-22T12:34:56Z",
    "updatedAt": "2023-05-22T12:34:56Z"
  },
  ...
]
```

## Delete User Record

Delete a user record by ID.

- **URL**: `/user/records`
- **Method**: `DELETE`
- **Authentication**: Required (Bearer token)

### Query Parameters

| Parameter  | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `recordId` | Number | Yes      | The ID of the record to delete |

### Response

If the request is successful, the API will respond with a JSON object containing a success message.

```json
{
  "message": "User records deleted successfully"
}
```
