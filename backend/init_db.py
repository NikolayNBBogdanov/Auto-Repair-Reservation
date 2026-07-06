"""Initialize database with sample data"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db
from models import Customer, Service, Reservation
from datetime import datetime, timedelta

def init_database():
    """Create tables and insert sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created")
        
        # Check if data already exists
        if Service.query.first():
            print("✓ Database already initialized with data")
            print(f"  - Customers: {Customer.query.count()}")
            print(f"  - Services: {Service.query.count()}")
            print(f"  - Reservations: {Reservation.query.count()}")
            return
        
        # Add sample services
        services = [
            Service(
                name="Oil Change",
                description="Replace engine oil and oil filter",
                price=49.99,
                duration_minutes=30
            ),
            Service(
                name="Brake Pad Replacement",
                description="Replace front and rear brake pads",
                price=150.00,
                duration_minutes=90
            ),
            Service(
                name="Tire Change",
                description="Replace tires and balance them",
                price=80.00,
                duration_minutes=60
            ),
            Service(
                name="Inspection Service",
                description="General vehicle inspection",
                price=99.99,
                duration_minutes=120
            ),
            Service(
                name="Battery Replacement",
                description="Replace the car battery",
                price=120.00,
                duration_minutes=30
            )
        ]
        
        for service in services:
            db.session.add(service)
        
        db.session.commit()
        print(f"✓ {len(services)} services added")
        
        # Add sample customers
        customers = [
            Customer(
                name="Max Müller",
                phone="0123456789",
                email="max@example.com"
            ),
            Customer(
                name="Anna Schmidt",
                phone="0987654321",
                email="anna@example.com"
            ),
            Customer(
                name="Peter Weber",
                phone="0555123456",
                email="peter@example.com"
            )
        ]
        
        for customer in customers:
            db.session.add(customer)
        
        db.session.commit()
        print(f"✓ {len(customers)} customers added")
        
        # Add sample reservations
        today = datetime.now().date()
        reservations = [
            Reservation(
                customer_id=1,
                service_id=1,
                reservation_date=(today + timedelta(days=9)).isoformat(),
                time_slot="09:00",
                notes="Regular service",
                status="confirmed"
            ),
            Reservation(
                customer_id=2,
                service_id=2,
                reservation_date=(today + timedelta(days=10)).isoformat(),
                time_slot="10:00",
                notes="Replace front brakes",
                status="confirmed"
            ),
            Reservation(
                customer_id=3,
                service_id=3,
                reservation_date=(today + timedelta(days=11)).isoformat(),
                time_slot="14:00",
                notes="Summer tire set change",
                status="confirmed"
            )
        ]
        
        for reservation in reservations:
            db.session.add(reservation)
        
        db.session.commit()
        print(f"✓ {len(reservations)} reservations added")
        
        print("\n✓✓✓ Database initialized successfully! ✓✓✓\n")
        print("Start backend with: python app.py")
        print("Open frontend: frontend/index.html")

if __name__ == '__main__':
    init_database()
