import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

const Search = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search/${keyword}`)
    } else {
      navigate('/')
    }
  }

  return (
    <Form className='py-3' onSubmit={submitHandler} inline='true'>
      <div className='input-group'>
        <Form.Control
          type='text'
          name='theForm'
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search for products...'
          className='mr-sm-2 ml-sm-5'
        ></Form.Control>
        <Button type='submit' variant='outline-success' className='p-2'>
          Search
        </Button>
      </div>
    </Form>
  )
}

export default Search
