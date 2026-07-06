from app import app, db, seed_default_services
from models import Service
import os

print('db exists', os.path.exists('repair_shop.db'))
with app.app_context():
    print('before', Service.query.count())
    seed_default_services()
    print('after', Service.query.count())
    print([s.name for s in Service.query.all()])
