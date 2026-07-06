import unittest

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from app import app, db, seed_default_services
from models import Customer


class CustomerApiTests(unittest.TestCase):
    def setUp(self):
        app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI='sqlite:///:memory:'
        )
        with app.app_context():
            db.drop_all()
            db.create_all()

    def test_update_customer_returns_updated_record(self):
        with app.app_context():
            customer = Customer(name='Old Name', phone='123456', email='old@example.com')
            db.session.add(customer)
            db.session.commit()
            customer_id = customer.id

        client = app.test_client()
        response = client.put(
            f'/api/customers/{customer_id}',
            json={
                'name': 'Updated Name',
                'phone': '654321',
                'email': 'updated@example.com'
            }
        )

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['name'], 'Updated Name')
        self.assertEqual(data['phone'], '654321')
        self.assertEqual(data['email'], 'updated@example.com')

    def test_services_endpoint_returns_seeded_services(self):
        with app.app_context():
            db.drop_all()
            db.create_all()
            seed_default_services()

        client = app.test_client()
        response = client.get('/api/services')

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertGreaterEqual(len(data), 1)
        self.assertIn('name', data[0])


if __name__ == '__main__':
    unittest.main()
