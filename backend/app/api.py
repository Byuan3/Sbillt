from fastapi import FastAPI, Query
from typing import Union
from fastapi.middleware.cors import CORSMiddleware

from firebase_admin import credentials
import firebase_admin
from firebase_admin import firestore

cred = credentials.Certificate("app/sbillt-firebase-adminsdk-zgwo5-3b73fbd1b6.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

users_ref = db.collection('Users')
transactions_ref = db.collection('Transactions')
notifications_ref = db.collection('Notifications')


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Hello World."}


@app.get("/ping", tags=["ping"])
async def ping() -> dict:
    return {"pong": 200}


@app.get("/user/{user_id}", tags=['user'])
async def get_user_info(user_id: str) -> dict:
    doc_ref = users_ref.document(user_id)
    doc = doc_ref.get()

    user_info = {}
    if doc.exists:
        user_info[user_id] = doc.to_dict()
    else:
        user_info[user_id] = 'user not found'

    return user_info


@app.get("/user", tags=['user'])
async def get_user_info_with_phone_or_name(name: Union[str, None] = None, phone: Union[str, None] = None) -> dict:
    user_info = {'users': []}
    docs = users_ref.stream()

    for doc in docs:
        doc_dict = doc.to_dict()

        if (name and name.lower() in str(doc_dict['name']).lower()) or (phone and phone.lower() in str(doc_dict['phone']).lower()):
            user_info['users'].append(doc_dict)

    return user_info


@app.get("/transaction/{transaction_id}", tags=['transaction'])
async def get_transaction(transaction_id: str) -> dict:
    doc_ref = transactions_ref.document(transaction_id)
    doc = doc_ref.get()

    transaction_info = {}
    if doc.exists:
        transaction_info[transaction_id] = doc.to_dict()
    else:
        transaction_info[transaction_id] = 'transaction not found'

    return transaction_info


@app.get("/notification/{notification_id}", tags=['notification'])
async def get_notification(notification_id: str) -> dict:
    doc_ref = notifications_ref.document(notification_id)
    doc = doc_ref.get()

    notification_info = {}
    if doc.exists:
        notification_info[notification_id] = doc.to_dict()
    else:
        notification_info[notification_id] = 'notification not found'

    return notification_info


@app.put("/user", tags=['user'])
async def create_user(user_id: str) -> dict:
    response = {'message': f'{user_id} info update failed'}
    return response


@app.put("/split", tags=['split'])
async def split_bill(amount: int, user: Union[list[str], None] = Query(default=None)) -> dict:
    response = {"amount": amount,
                "users": user}
    return response


@app.put("/confirm/{transaction_id}", tags=['confirm'])
async def confirm_transaction(transaction_id: str) -> dict:
    response = {"transaction_id": transaction_id}
    return response


@app.post("/user", tags=['user'])
async def create_user(user_id: str) -> dict:
    response = {'message': f'{user_id} created failed'}
    return response


@app.post("/request", tags=['request'])
async def request_money(amount: int, user: str) -> dict:
    response = {"amount": amount,
                "user": user}
    return response


@app.post("/transfer", tags=['transfer'])
async def request_money(amount: int, user: str) -> dict:
    response = {"amount": amount,
                "user": user}
    return response


@app.post("/notification", tags=['notification'])
async def send_notification(user: str) -> dict:
    response = {"content": "notification_content",
                "user": user}
    return response

