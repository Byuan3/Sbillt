import datetime

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
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Hello World Docker."}


@app.get("/ping", tags=["ping"])
async def ping() -> dict:
    return {"pong": 200}


@app.get("/user/{user}", tags=['user'])
async def get_user_info(user: str) -> dict:
    doc_ref = users_ref.document(user)
    doc = doc_ref.get()

    user_info = {}
    if doc.exists:
        user_info = doc.to_dict()
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
        transaction_info = doc.to_dict()
    else:
        transaction_info[transaction_id] = 'transaction not found'

    return transaction_info


@app.put("/split", tags=['split'])
async def split_bill(current: str, amount: float, description: str, target: Union[list[str], None] = Query(default=None)) -> dict:
    average_amount = float("{:.2f}".format(amount/(len(target)+1)))
    for t in target:
        await split_pay(current, average_amount, t, description, False)
    await split_pay(current, average_amount, current, description, True)

    return {'message': f"User {current} split ${amount} with {len(target)} people."}


@app.put("/confirm/{transaction_id}", tags=['confirm'])
async def confirm_transaction(current: str, transaction_id: str) -> dict:
    transaction_ref = transactions_ref.document(transaction_id)
    transaction = transaction_ref.get()

    if transaction.exists:
        transaction_dict = transaction.to_dict()
        user1_ref = users_ref.document(transaction_dict['user1_id'])
        user2_ref = users_ref.document(transaction_dict['user2_id'])
        fb_transaction = db.transaction()

        @firestore.transactional
        def update_transaction(t, transaction_doc, user1_doc, user2_doc):
            transaction_snapshot = transaction_doc.get(transaction=t)
            user1_snapshot = user1_doc.get(transaction=t)
            user2_snapshot = user2_doc.get(transaction=t)
            if not transaction_snapshot.get('state') and user2_snapshot.get('user_id') == current:
                t.update(transaction_doc, {
                    'state': True
                })
                t.update(user2_doc, {
                    'balance': user2_snapshot.get('balance') - transaction_snapshot.get('amount')
                })
                if transaction_snapshot.get('type') == 'Request':
                    t.update(user1_doc, {
                        'balance': user1_snapshot.get('balance') + transaction_snapshot.get('amount')
                    })
                return True
            else:
                return False

        if update_transaction(fb_transaction, transaction_ref, user1_ref, user2_ref):
            return {'message': f"Transaction {transaction_id} confirmed."}
    return {'message': f"Transaction {transaction_id} failed."}


@app.put("/balance", tags=['balance'])
async def add_balance(current: str, amount: float) -> dict:
    transaction = db.transaction()
    user_doc = users_ref.document(current)

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
    docs = users_ref.stream()

    for doc in docs:
        if doc.id == user:
            return {'message': f'user {user} exist'}

    users_ref.document(user).set({
        'name': name,
        'email': user,
        'balance': 0,
        'transaction': [],
        'user_id': user
    })

    return {'message': f'user {user} created'}


@app.post("/split_pay", tags=['split_pay'])
async def split_pay(current: str, amount: float, target: str, description: str, state: bool) -> dict:
    transaction = {
        'transaction_id': '',
        'user1_id': current,
        'user2_id': target,
        'amount': amount,
        'type': 'Split',
        'state': state,
        'description': description,
        'timestamp': datetime.datetime.now(),
        'content': f'{target} need to pay ${amount}. Please confirm this transaction.'
    }

    update_time, transaction_ref = transactions_ref.add(transaction)
    transaction_ref.update({'transaction_id': transaction_ref.id})

    user2_ref = users_ref.document(target)
    user2_ref.update({'transaction': firestore.ArrayUnion([transaction_ref.id])})

    if state:
        await add_balance(current, -amount)

    return {'message': f"{transaction['type']} transaction {transaction_ref.id} created."}


@app.post("/request", tags=['request'])
async def request_money(current: str, amount: float, target: str, description: str) -> dict:
    transaction = {
        'transaction_id': '',
        'user1_id': current,
        'user2_id': target,
        'amount': amount,
        'type': 'Request',
        'state': False,
        'description': description,
        'timestamp': datetime.datetime.now(),
        'content': f'{current} request ${amount} from {target}. Please confirm this transaction.'
    }

    update_time, transaction_ref = transactions_ref.add(transaction)
    transaction_ref.update({'transaction_id': transaction_ref.id})

    user1_ref = users_ref.document(current)
    user2_ref = users_ref.document(target)

    user1_ref.update({'transaction': firestore.ArrayUnion([transaction_ref.id])})
    user2_ref.update({'transaction': firestore.ArrayUnion([transaction_ref.id])})

    return {'message': f"{transaction['type']} transaction {transaction_ref.id} created."}


@app.post("/transfer", tags=['transfer'])
async def transfer_money(current: str, amount: float, target: str, description: str) -> dict:
    transaction = {
        'transaction_id': '',
        'user1_id': current,
        'user2_id': target,
        'amount': amount,
        'type': 'Transfer',
        'state': True,
        'description': description,
        'timestamp': datetime.datetime.now(),
        'content': f'{current} transfer ${amount} to {target}.'
    }

    update_time, transaction_ref = transactions_ref.add(transaction)
    user1_ref = users_ref.document(current)
    user2_ref = users_ref.document(target)
    user1_ref.update({'transaction': firestore.ArrayUnion([transaction_ref.id])})
    user2_ref.update({'transaction': firestore.ArrayUnion([transaction_ref.id])})
    transaction_ref.update({'transaction_id': transaction_ref.id})

    fb_transaction = db.transaction()

    @firestore.transactional
    def update_balance(t, user1_doc, user2_doc):
        user1_snapshot = user1_doc.get(transaction=t)
        user2_snapshot = user2_doc.get(transaction=t)
        t.update(user1_doc, {
            'balance': user1_snapshot.get('balance') - amount
        })
        t.update(user2_doc, {
            'balance': user2_snapshot.get('balance') + amount
        })

    update_balance(fb_transaction, user1_ref, user2_ref)

    return {'message': f"{transaction['type']} transaction {transaction_ref.id} created."}
