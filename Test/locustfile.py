from locust import HttpUser, task


class SbilltTestScript(HttpUser):

    @task
    def hello_world(self):
        self.client.get('/ping')
        self.client.get('/')

    @task
    def get_user(self):
        current = "test@gmail.com"
        self.client.get(f'/user/{current}')

    @task
    def post_user(self):
        current = "test@gmail.com"
        name = "Alice"
        self.client.post(f'/user?user={current}&name={name}')

    @task
    def get_transaction(self):
        transaction = "0IxQF0tSVKxcERQAbBmJ"
        self.client.get(f'/transaction/{transaction}')

    @task
    def put_split(self):
        current = "test@gmail.com"
        user1 = "test1@gmail.com"
        user2 = "test2@gmail.com"
        amount = 15
        des = "Locust Test"
        self.client.put(f'/split?'
                        f'current={current}'
                        f'&amount={amount}'
                        f'&target={user1}&'
                        f'target={user2}'
                        f'&description={des}')

    @task
    def put_confirm_transaction(self):
        transaction = "0IxQF0tSVKxcERQAbBmJ"
        current = "test@gmail.com"
        self.client.put(f'/confirm/{transaction}?current={current}')

    @task
    def put_balance(self):
        current = "test@gmail.com"
        amount = 15
        self.client.put(f'/balance?current={current}&amount={amount}')

    @task
    def post_request(self):
        current = "test@gmail.com"
        user1 = "test1@gmail.com"
        amount = 15
        des = "Locust Test"
        self.client.post(f'/request?'
                         f'current={current}'
                         f'&amount={amount}'
                         f'&target={user1}'
                         f'&description={des}')

    @task
    def post_transfer(self):
        user1 = "test1@gmail.com"
        user2 = "test2@gmail.com"
        amount = 15
        des = "Locust Test"
        self.client.post(f'/transfer?'
                         f'current={user1}'
                         f'&amount={amount}'
                         f'&target={user2}'
                         f'&description={des}')

        self.client.post(f'/transfer?'
                         f'current={user2}'
                         f'&amount={amount}'
                         f'&target={user1}'
                         f'&description={des}')
