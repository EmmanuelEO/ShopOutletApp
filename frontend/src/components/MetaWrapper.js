import React from 'react'
import { Helmet } from 'react-helmet'

const MetaWrapper = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description}></meta>
      <meta name='keywords' content={keywords}></meta>
    </Helmet>
  )
}

MetaWrapper.defaultProps = {
  title: 'Welcome to ShopOutlet',
  description: 'Get awesome products for great prices',
  keywords: 'Get affordable electronics, great prices, good quality',
}

export default MetaWrapper
