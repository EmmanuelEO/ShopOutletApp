import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, udpateOneUser } from '../actions/userActions'
import { UPDATE_USER_RESET } from '../constants/userConstants'
import { Link } from 'react-router-dom'

// useState should be geenrally used whenever there is a form field that we might need to fill in and input
const EditUserScreen = () => {
  const params = useParams()
  const userID = params.id

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const updateUser = useSelector((state) => state.updateUser)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = updateUser

  const navigate = useNavigate()

  useEffect(() => {
    // If the clicked user does not yet exists or their ID does not match the ID that was passed through the URL (Note that user._id would not be equal to userID when the user clicks the back link and selects the edit option for another user)
    if (successUpdate) {
      dispatch({ type: UPDATE_USER_RESET })
      navigate('/admin/allusers')
    } else {
      if (!user.name || user._id !== userID) {
        dispatch(getUserDetails(userID))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [dispatch, user, userID, successUpdate, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(udpateOneUser({ _id: user._id, name, email, isAdmin }))
  }

  return (
    <>
      <Link
        to='/admin/allusers'
        className='btn btn-light btn-outline-dark my-3'
      >
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader /> }
        {errorUpdate && <Message variant='danger' >{errorUpdate}</Message> }
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error} </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' id='fg-1'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter Name'
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
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

            <Form.Group controlId='isadmin' id='fg-2'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default EditUserScreen
