import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc: Authenticate the User and get a token
// @route: POST request to /api/users/login
// @access: Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  res.send({
    email,
    password,
  })
})

export { authUser }
