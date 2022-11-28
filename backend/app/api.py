from fastapi import FastAPI, Query
from typing import Union
from fastapi.middleware.cors import CORSMiddleware


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
    user_info = {'user_id': user_id}
    return user_info


@app.get("/user", tags=['user'])
async def get_user_info_with_phone_or_name(name: Union[str, None] = None, phone: Union[str, None] = None) -> dict:
    user_info = {'user_name': name,
                 'user_phone': phone}
    return user_info


@app.get("/transaction/{transaction_id}", tags=['transaction'])
async def get_transaction(transaction_id: str) -> dict:
    transaction_info = {'transaction_id': transaction_id}
    return transaction_info


@app.get("/notification/{notification_id}", tags=['notification'])
async def get_notification(notification_id: str) -> dict:
    notification = {'notification_id': notification_id}
    return notification


@app.put("/split", tags=['split'])
async def split_bill(amount: int, user: Union[list[str], None] = Query(default=None)) -> dict:
    response = {"amount": amount,
                "users": user}
    return response


@app.put("/confirm/{transaction_id}", tags=['confirm'])
async def confirm_transaction(transaction_id: str) -> dict:
    response = {"transaction_id": transaction_id}
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

