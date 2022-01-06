import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@shopoutlet.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Williams',
    email: 'john@shopoutlet.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Williams',
    email: 'jane@shopoutlet.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
]

export default users
