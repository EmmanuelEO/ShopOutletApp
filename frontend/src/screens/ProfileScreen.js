import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { ListMyOrders } from '../actions/orderActions'
import { LinkContainer } from 'react-router-bootstrap'

// useState should be geenrally used whenever there is a form field that we might need to fill in and input
const ProfileScreen = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [count, setCount] = useState(1)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const navigate = useNavigate()

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const myOrders = useSelector((state) => state.myOrders)
  // loading: loadingOrders and errorOrders renames loading to loadingOrders and error to errorOrders
  const { loading: loadingOrders, error: errorOrders, orders } = myOrders

  useEffect(() => {
    // If the user is not logged in navigate to login
    if (!userInfo) {
      navigate('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(ListMyOrders())
      } else {
        if (count === 1) {
          setName(user.name)
          setEmail(user.email)
          setCount(2)
        }
      }
    }
  }, [dispatch, navigate, userInfo, user, success, count])

  const changeName = (e) => setName(e.target.value)

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match. Please, try again.')
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      )
      setName(name)
      setEmail(email)
    }
  }

  return (
    <Row>
      <Col md={3} lg={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' id='fg-1'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter Name'
              value={name}
              required
              onChange={changeName}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email' id='fg-1'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password' id='fg-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword' id='fg-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9} lg={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th md={3}>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td className='pl-2'>
                    {order.isPaid ? (
                      <Row>
                        <Col>
                          <p>
                            <i className='fas fa-check' id='icon-2'></i>
                          </p>
                          <p className='text-nowrap'>Paid On: {order.paidAt.substring(0, 10)}</p>
                        </Col>
                      </Row>
                    ) : (
                      <i className='fas fa-times' id='icon-1'></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <Row>
                        <Col>
                          <p>
                            <i className='fas fa-check' id='icon-2'></i>
                          </p>
                          <p className='text-nowrap'>Delivered On: {order.deliveredAt.substring(0, 10)}</p>
                        </Col>
                      </Row>
                    ) : (
                      <i className='fas fa-times' id='icon-1'></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
