db.auth('admin', 'admin123')

db = db.getSiblingDB('dropp_db')

db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [
    { role: 'readWrite', db: 'dropp_db' },
    { role: 'dbAdmin', db: 'dropp_db' }
  ]
})