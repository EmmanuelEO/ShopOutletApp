import React, { useState, useEffect, Fragment } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import MetaWrapper from '../components/MetaWrapper'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1)
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productCreateReview = useSelector((state) => state.productCreateReview)
  const { success: successReviewProduct, error: errorReviewProduct } =
    productCreateReview

  const cart = useSelector(state => state.cart)
  const { cartItems } = cart

  let index
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i] && cartItems[i].product === product._id)
      index = i
  }
  console.log("Prod: ", cartItems[index])

  useEffect(() => {
    if (successReviewProduct) {
      alert('Your review has been submitted!')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(params.id))
  }, [dispatch, params, successReviewProduct])

  const AddToCartHandler = () => {
    dispatch(addToCart(product._id, Number(quantity)))
    navigate(`/cart/`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(params.id, { rating, comment }))
  }

  return (
    <>
      <Link className='btn btn-light btn-outline-dark my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
        <MetaWrapper title={product.name} />
          <Row>
            <Col md={6}>
              <Image style={{ paddingBottom: '3rem'}}src={product.image} alt={product.name} fluid></Image>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  {(
                    <Rating
                      value={product.rating > 0 ? product.rating : 0}
                      text={
                        product.numReviews === 1
                          ? `${product.numReviews} review`
                          : `${product.numReviews} reviews`
                      }
                    />
                  )}
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3} id='col-3'>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            className='form-select'
                            as='select'
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value)
                            }}
                            aria-label='8'
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={AddToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <Fragment key={review._id}>
                    <strong style={{ fontSize: '20px' }}>{'- '}{review.name}</strong>
                    <ul>
                      <li>
                        <Rating value={review.rating} />
                      </li>
                      <li>
                        <div>Date: {review.createdAt.substring(0, 10)}</div>
                      </li>
                      <li>
                        <div>Comment: {review.comment}</div>
                      </li>
                    </ul>
                  </Fragment>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {errorReviewProduct && (
                    <Message variant='danger'>{errorReviewProduct}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          className='form-select'
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please{' '}
                      <Link to='/login' style={{ color: 'blue' }}>
                        Sign In
                      </Link>{' '}
                      to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
