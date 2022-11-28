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

current_user = None
current_user_name = None

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


@app.get("/user/{user}", tags=['user'])
async def get_user_info(user: str) -> dict:
    doc_ref = users_ref.document(user)
    doc = doc_ref.get()

    user_info = {}
    if doc.exists:
        user_info[user] = doc.to_dict()
    else:
        user_info[user] = 'user not found'

    return user_info


@app.get("/user", tags=['user'])
async def get_user_info_with_email_or_name(name: Union[str, None] = None, email: Union[str, None] = None) -> dict:
    user_info = {'users': []}
    docs = users_ref.stream()

    for doc in docs:
        doc_dict = doc.to_dict()

        if (name and name.lower() in str(doc_dict['name']).lower()) or (
                email and email.lower() in str(doc.id).lower()):
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

# TODO
@app.put("/split", tags=['split'])
async def split_bill(amount: int, user: Union[list[str], None] = Query(default=None)) -> dict:
    response = {"amount": amount,
                "users": user}
    return response


# TODO
@app.put("/confirm/{transaction_id}", tags=['confirm'])
async def confirm_transaction(transaction_id: str) -> dict:
    response = {"transaction_id": transaction_id}
    return response


@app.put("/balance", tags=['balance'])
async def add_balance(email: str, amount: int) -> dict:
    transaction = db.transaction()
    user_doc = users_ref.document(email)

    @firestore.transactional
    def update_balance(t, doc):
        snapshot = doc.get(transaction=t)
        t.update(doc, {
            'balance': snapshot.get('balance') + amount
        })

    update_balance(transaction, user_doc)

    return user_doc.get().to_dict()


@app.post("/user", tags=['user'])
async def create_user(user: str, name: str) -> dict:
    global current_user
    global current_user_name

    docs = users_ref.stream()

    for doc in docs:
        if doc.id == user:
            current_user = doc.to_dict['email']
            current_user_name = doc.to_dict['name']
            return {'message': f'user {user} exist'}

    users_ref.document(user).set({
        'name': name,
        'email': user,
        'balance': 0,
        'transactions': []
    })

    current_user = user
    current_user_name = name
    return {'message': f'user {user} created'}


# TODO
@app.post("/request", tags=['request'])
async def request_money(amount: int, user: str) -> dict:
    response = {"amount": amount,
                "user": user}
    return response


# TODO
@app.post("/transfer", tags=['transfer'])
async def transfer_money(amount: int, user: str) -> dict:
    response = {"amount": amount,
                "user": user}
    return response

