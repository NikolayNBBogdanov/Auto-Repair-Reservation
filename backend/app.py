from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
from models import db, Customer, Service, Reservation

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///repair_shop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_SORT_KEYS'] = False

db.init_app(app)
CORS(app)


def seed_default_services():
    """Populate the database with default services if none exist."""
    existing_names = {service.name for service in Service.query.all()}

    services = []
    for name, description, price, duration in [
        ('Oil Change', 'Replace engine oil and oil filter', 49.99, 30),
        ('Brake Pad Replacement', 'Replace front and rear brake pads', 150.00, 90),
        ('Tire Change', 'Replace tires and balance them', 80.00, 60),
        ('Inspection Service', 'General vehicle inspection', 99.99, 120),
        ('Battery Replacement', 'Replace the car battery', 120.00, 30)
    ]:
        if name not in existing_names:
            services.append(Service(
                name=name,
                description=description,
                price=price,
                duration_minutes=duration
            ))

    if services:
        db.session.add_all(services)
        db.session.commit()


# Initialize database
with app.app_context():
    db.create_all()
    seed_default_services()

# ==================== CUSTOMERS ENDPOINTS ====================

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers])

@app.route('/api/customers', methods=['POST'])
def create_customer():
    """Create new customer or return existing"""
    data = request.json
    
    # Validation
    if not data.get('name') or not data.get('phone'):
        return jsonify({'error': 'Name and phone required'}), 400
    
    # Check if customer already exists
    existing = Customer.query.filter_by(phone=data['phone']).first()
    if existing:
        return jsonify(existing.to_dict()), 200
    
    customer = Customer(
        name=data['name'],
        phone=data['phone'],
        email=data.get('email', '')
    )
    
    db.session.add(customer)
    db.session.commit()
    
    return jsonify(customer.to_dict()), 201

@app.route('/api/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get specific customer"""
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify(customer.to_dict())

@app.route('/api/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update an existing customer"""
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    data = request.json or {}

    if 'name' in data:
        if not str(data['name']).strip():
            return jsonify({'error': 'Name is required'}), 400
        customer.name = str(data['name']).strip()

    if 'phone' in data:
        phone = str(data['phone']).strip()
        if not phone:
            return jsonify({'error': 'Phone is required'}), 400

        existing = Customer.query.filter(Customer.phone == phone, Customer.id != customer_id).first()
        if existing:
            return jsonify({'error': 'Phone number already exists'}), 409
        customer.phone = phone

    if 'email' in data:
        customer.email = str(data['email']).strip() if data['email'] is not None else ''

    db.session.commit()
    return jsonify(customer.to_dict())

# ==================== SERVICES ENDPOINTS ====================

@app.route('/api/services', methods=['GET'])
def get_services():
    """Get all available services"""
    services = Service.query.all()
    return jsonify([s.to_dict() for s in services])

@app.route('/api/services', methods=['POST'])
def create_service():
    """Create new service"""
    data = request.json
    
    if not data.get('name') or not data.get('price'):
        return jsonify({'error': 'Name and price required'}), 400
    
    service = Service(
        name=data['name'],
        description=data.get('description', ''),
        price=float(data['price']),
        duration_minutes=int(data.get('duration_minutes', 60))
    )
    
    db.session.add(service)
    db.session.commit()
    
    return jsonify(service.to_dict()), 201

@app.route('/api/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    """Get specific service"""
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'error': 'Service not found'}), 404
    return jsonify(service.to_dict())

# ==================== RESERVATIONS ENDPOINTS ====================

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    """Get all reservations"""
    reservations = Reservation.query.all()
    return jsonify([r.to_dict() for r in reservations])

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    """Create new reservation"""
    data = request.json
    
    # Validation
    required_fields = ['customer_id', 'service_id', 'reservation_date', 'time_slot']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if time slot is already booked
    existing = Reservation.query.filter_by(
        reservation_date=data['reservation_date'],
        time_slot=data['time_slot'],
        status='confirmed'
    ).first()
    
    if existing:
        return jsonify({'error': 'Time slot already booked'}), 409
    
    # Verify customer and service exist
    if not Customer.query.get(data['customer_id']):
        return jsonify({'error': 'Customer not found'}), 404
    if not Service.query.get(data['service_id']):
        return jsonify({'error': 'Service not found'}), 404
    
    reservation = Reservation(
        customer_id=int(data['customer_id']),
        service_id=int(data['service_id']),
        reservation_date=data['reservation_date'],
        time_slot=data['time_slot'],
        notes=data.get('notes', ''),
        status='confirmed'
    )
    
    db.session.add(reservation)
    db.session.commit()
    
    return jsonify(reservation.to_dict()), 201

@app.route('/api/reservations/<int:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    """Get specific reservation"""
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    return jsonify(reservation.to_dict())

@app.route('/api/reservations/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    """Update reservation"""
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    
    data = request.json
    
    if 'status' in data:
        reservation.status = data['status']
    if 'notes' in data:
        reservation.notes = data['notes']
    
    db.session.commit()
    return jsonify(reservation.to_dict())

@app.route('/api/reservations/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    """Cancel reservation"""
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    
    reservation.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Reservation cancelled', 'id': reservation_id}), 200

# ==================== AVAILABILITY ENDPOINTS ====================

@app.route('/api/availability', methods=['GET'])
def get_availability():
    """Get available time slots for a specific date"""
    date = request.args.get('date')
    
    if not date:
        return jsonify({'error': 'Date parameter required'}), 400
    
    # Define working hours (9 AM to 5 PM)
    time_slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    
    # Check which slots are booked
    booked = Reservation.query.filter_by(
        reservation_date=date,
        status='confirmed'
    ).all()
    
    booked_times = [r.time_slot for r in booked]
    available = [slot for slot in time_slots if slot not in booked_times]
    
    return jsonify({
        'date': date,
        'available_slots': available,
        'booked_slots': booked_times,
        'total_slots': len(time_slots)
    })

# ==================== STATISTICS ENDPOINTS ====================

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get dashboard statistics"""
    total_customers = Customer.query.count()
    total_reservations = Reservation.query.count()
    confirmed = Reservation.query.filter_by(status='confirmed').count()
    cancelled = Reservation.query.filter_by(status='cancelled').count()
    
    return jsonify({
        'total_customers': total_customers,
        'total_reservations': total_reservations,
        'confirmed_reservations': confirmed,
        'cancelled_reservations': cancelled,
        'total_services': Service.query.count()
    })

# ==================== HEALTH CHECK ====================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat(),
        'service': 'Auto Repair Shop Reservation System'
    })

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Auto Repair Shop Reservation System API',
        'version': '1.0.0',
        'endpoints': {
            'customers': '/api/customers',
            'services': '/api/services',
            'reservations': '/api/reservations',
            'availability': '/api/availability?date=YYYY-MM-DD',
            'statistics': '/api/statistics',
            'health': '/health'
        }
    })

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
