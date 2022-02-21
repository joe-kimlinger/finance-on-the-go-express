# Finance On The Go Analytics Microservice

## Request
To receive analytics for a user, query the endpoint at:
```
GET localhost:8000/analytics?startDate=START_DATE&endDate=END_DATE&userId=USER_ID
```
with the query parameters:

startDate - Start of the date range to search from (inclusive)

endDate - End of the date range to search from (inclusive)

userId - The ID of the user to receive analytics for


## Response
The reponse will be in the following format:
```
{
    "totalSent": number         The total amount sent by the user over the specified time period
    "totalReceived": number,    The total amount received by the user over the specified time period
    "totalSaved": number,       The total amount saved by the user over the specified time period
    "totalTransacted": number,  The total amount sent, received, or saved by the user over the specified time period
    "bestFriends": [],          A list of the top 3 users the curent user has interacted with based on transaction count, sorted in descending order
    "sponsor": {},              The person who has sent the most money in the specified time period with some additonal statistics on how much money was sent/received between the two users
    "sponsee": {}               The person who received the most money in the specified time period with some additonal statistics on how much money was sent/received between the two users
}
```