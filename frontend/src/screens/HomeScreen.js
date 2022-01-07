import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { LinkContainer } from 'react-router-bootstrap'
import ProductCarousel from '../components/ProductCarousel'
import MetaWrapper from '../components/MetaWrapper'
import { listProducts } from '../actions/productActions'

const HomeScreen = () => {
  const params = useParams()
  const keyword = params.keyword
  const pageNumber = params.pageNumber || 1

  const dispatch = useDispatch()

  // Where productList is the name given to the reducer from the store.js file
  const productList = useSelector((state) => state.productList)
  const { loading, error, products, pages, page } = productList

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
    <MetaWrapper />
    {!keyword ? <ProductCarousel /> : <LinkContainer to='/'>
      <Button className='btn btn-light btn-outline-dark my-3'>
        Go Back
      </Button>
    </LinkContainer>}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}></Paginate>
        </>
      )}
    </>
  )
}

export default HomeScreen
