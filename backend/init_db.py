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
                name="Ölwechsel",
                description="Motoröl und Ölfilter wechseln",
                price=49.99,
                duration_minutes=30
            ),
            Service(
                name="Bremsbelagsersatz",
                description="Bremsbeläge vorne/hinten ersetzen",
                price=150.00,
                duration_minutes=90
            ),
            Service(
                name="Reifenwechsel",
                description="Reifen wechseln und auswuchten",
                price=80.00,
                duration_minutes=60
            ),
            Service(
                name="Inspektionsservice",
                description="Allgemeine Fahrzeuginspektionen",
                price=99.99,
                duration_minutes=120
            ),
            Service(
                name="Batteriereplacment",
                description="Autobatterie ersetzen",
                price=120.00,
                duration_minutes=30
            )
        ]
        
        for service in services:
            db.session.add(service)
        
        db.session.commit()
        print(f"✓ {len(services)} Services hinzugefügt")
        
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
        print(f"✓ {len(customers)} Kunden hinzugefügt")
        
        # Add sample reservations
        today = datetime.now().date()
        reservations = [
            Reservation(
                customer_id=1,
                service_id=1,
                reservation_date=(today + timedelta(days=9)).isoformat(),
                time_slot="09:00",
                notes="Standardwechsel",
                status="confirmed"
            ),
            Reservation(
                customer_id=2,
                service_id=2,
                reservation_date=(today + timedelta(days=10)).isoformat(),
                time_slot="10:00",
                notes="Vorderbremsen ersetzen",
                status="confirmed"
            ),
            Reservation(
                customer_id=3,
                service_id=3,
                reservation_date=(today + timedelta(days=11)).isoformat(),
                time_slot="14:00",
                notes="Sommerkomplettwechsel",
                status="confirmed"
            )
        ]
        
        for reservation in reservations:
            db.session.add(reservation)
        
        db.session.commit()
        print(f"✓ {len(reservations)} Reservierungen hinzugefügt")
        
        print("\n✓✓✓ Datenbank erfolgreich initialisiert! ✓✓✓\n")
        print("Backend starten mit: python app.py")
        print("Frontend öffnen: frontend/index.html")

if __name__ == '__main__':
    init_database()
