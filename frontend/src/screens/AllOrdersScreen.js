import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { ListAllTheOrders } from '../actions/orderActions'

const ListOrdersScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const listAllOrders = useSelector((state) => state.listAllOrders)
  const { loading, error, orders } = listAllOrders

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(ListAllTheOrders())
    } else {
      navigate('/login')
    }
  }, [dispatch, userInfo, navigate])

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL / $</th>
              <th>PAID</th>
              <th>DELIVERED</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <span>
                      <p>
                        <i className='fas fa-check' id='icon-2'></i>
                      </p>
                      <p className='text-nowrap'>
                        Paid On: {order.paidAt.substring(0, 10)}
                      </p>
                    </span>
                  ) : (
                    <i className='fas fa-times' id='icon-1'></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span>
                      <p>
                        <i className='fas fa-check' id='icon-2'></i>
                      </p>
                      <p className='text-nowrap'>
                        Delivered On: {order.deliveredAt.substring(0, 10)}
                      </p>
                    </span>
                  ) : (
                    <i className='fas fa-times' id='icon-1'></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default ListOrdersScreen
