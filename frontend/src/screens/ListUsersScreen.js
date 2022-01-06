import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listAllUsers, deleteOneUser } from '../actions/userActions'

const ListUsersScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const listUsers = useSelector((state) => state.listUsers)
  const { loading, error, users } = listUsers

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const deleteUser = useSelector((state) => state.deleteUser)
  const { success: successfulDelete } = deleteUser

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listAllUsers())
    } else {
      navigate('/login')
    }
  }, [dispatch, userInfo, navigate, successfulDelete])

  const deleteHandler = (id, name) => {
    if (window.confirm(`Are your sure you want to delete ${name} as a user?`)) {
      dispatch(deleteOneUser(id))
    }
  }

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' id='icon-2'></i>
                  ) : (
                    <i className='fas fa-times' id='icon-1'></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id, user.name)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ListUsersScreen
