import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc: Authenticate the User and get a token
// @route: POST request to /api/users/login
// @access: Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    // Where status 401 refers to being unauthorized
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc: Register a new user
// @route: POST request to /api/users
// @access: Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email: email })

  if (userExists) {
    // Status 400 represents a bad request
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    // 201 represents success in the creation of a resource
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})

// @desc: Get User Profile
// @route: GET request to /api/users/profile
// @access: Private
const getUserProfile = asyncHandler(async (req, res) => {
  // Note: req.user must be succesfully authenticated through auth_middleware for req.user to have a valid user
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User is not found')
  }
})

// @desc: Update User Profile
// @route: PUT request to /api/users/profile
// @access: Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // Note: req.user must be succesfully authenticated through auth_middleware for req.user to have a valid user
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(404)
    throw new Error('User is not found')
  }
})

// @desc: Get All Users
// @route: GET request to /api/users
// @access: Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Note: req.user must be succesfully authenticated through auth_middleware for req.user to have a valid user
  const users = await User.find({})
  res.json(users)
})

// @desc: Delete a User
// @route: DELETE request to /api/users/:id
// @access: Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // Note: req.user must be succesfully authenticated through auth_middleware for req.user to have a valid user
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User Not Found')
  }
})

// @desc: Get a User by their ID
// @route: GET request to /api/users/:id
// @access: Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // Note: req.user must be succesfully authenticated through auth_middleware for req.user to have a valid user
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User Not Found')
  }
})

// @desc: Update User
// @route: PUT request to /api/users/:id
// @access: Private
const updateUser = asyncHandler(async (req, res) => {
  // Note: req.user must be succesfully authenticated through auth_middleware for req.user to have a valid user
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User is not found')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}
