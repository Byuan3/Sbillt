# Sbillt

## Backend API usage
API docs address: `http://54.151.117.239:8000/docs#/`

- - - -
### Default - /
* GET: / 

Parameters: None

Response: 

    "message": "Hello World."


Example: `http://54.177.245.182:8000/`
- - - -
### Ping - /ping
* GET: /ping

Parameters: None

Response: 

    "pong": 200

Example: `http://54.177.245.182:8000/ping`
- - - -
### User - /user

* GET: /user/{user}

Parameters: user

Response:

    "test@gmail.com": {
        "balance": 638.24,
        "user_id": "test@gmail.com",
        "transaction": [
            "oXWJbkWycVtZ5qcc7ufu",
            "yklNu5ax5fBtY1CrNiZ8",
            "kYi5XuWjSbPYdvfrcwRK",
            "dBkLaWjJHQ668lGJaSug",
            "uMRhQ04OavnrK6WhNDZF",
            "nXgf4gEy5L8BXT9FT56o",
            "jjWEwOecKbydOkiizX29",
            "9Zl5DywZ16Sx4XABYhI8",
            "nmK5IaAnjLliptGHaPIi",
            "QQA4tXwWlog3rfLQMrlk",
            "ivvzmTynTcheCrN56EJe",
            "e0gdshV4NChCKiNoRVVh",
            "XONZ1bKzcUoMpqTV8yGm"
        ],
        "transactions": [],
        "email": "test@gmail.com",
        "name": "Alice"
    }
    
Example: `http://54.177.245.182:8000/user/test@gmail.com`

- - - -

* POST: /user

Parameters: user, name

Response: 

    'message': f'user {user} created'
    
or
    
    'message': f'user {user} exist'

Example: `http://54.177.245.182:8000/user?user=test5@gmail.com&name=Frank`

- - - -
### Transaction - /transaction
* GET: /transaction/{transaction_id}

Parameters: transaction_id

Response:

    "e0gdshV4NChCKiNoRVVh": {
        "content": "test@gmail.com request $7.5 from test2@gmail.com. Please confirm this transaction.",
        "type": "Request",
        "description": "Boba",
        "transaction_id": "e0gdshV4NChCKiNoRVVh",
        "state": true,
        "user1_id": "test@gmail.com",
        "timestamp": "2022-11-30T00:48:02.959138+00:00",
        "amount": 7.5,
        "user2_id": "test2@gmail.com"
    }
    
Example: `http://54.177.245.182:8000/transaction/e0gdshV4NChCKiNoRVVh`
- - - -
### Request - /request
* Post: /request

Parameters: current, amount, target, description

Response:

    'message': f"{transaction['type']} transaction {transaction_ref.id} created."
    
Example: `http://54.177.245.182:8000/request?current=test@gmail.com&amount=100&target=test1@gmail.com&description=Rent`
- - - -
### Transfer - /transfer
* Post: /transfer

Parameters: current, amount, target, description

Response:

    'message': f"{transaction['type']} transaction {transaction_ref.id} created."
    
Example: `http://54.177.245.182:8000/transfer?current=test@gmail.com&amount=100&target=test1@gmail.com&description=Rent`
- - - -
### Split -/split
* Put: /split

Parameters: current, amount, description, target (can be one or more)

Reponse:
  
    'message': f"User {current} split ${amount} with {len(target)} people."
   
   
Example: `'http://54.177.245.182:8000/split?current=test@gmail.com&amount=20&target=test1@gmail.com&target=test2@gmail.com&description=Boba'`
- - - -
### Confirm -/confirm
* Put: /confirm/{transaction_id}

Parameters: current, transaction_id

Reponse:

    'message': f"Transaction {transaction_id} confirmed."
 or
 
    'message': f"Transaction {transaction_id} failed."
    
Example: `http://54.177.245.182:8000/confirm/dDNb1IA4UtL5Rw976IPP?current=test2@gmail.com`
- - - -
### Balance - /balance
* PUT: /balance

Parameters: current, amount

Reponse:

    "balance": 222.0,
    "user_id": "test5@gmail.com",
    "email": "test5@gmail.com",
    "transactions": [],
    "name": "Frank"

Example: `http://54.177.245.182:8000/balance?current=test5@gmail.com&amount=222`





