import {Link} from 'react-router-dom'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.loading,
    count: 1,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    //  jwt_token

    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const productData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        rating: data.rating,
        totalReviews: data.total_reviews,
        description: data.description,
        availability: data.availability,
        brand: data.brand,
      }

      const similarProducts = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        brand: each.brand,
        price: each.price,
        rating: each.rating,
      }))

      this.setState({
        productData,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickMinus = () => {
    this.setState(prevState => {
      if (prevState.count > 1) {
        return {count: prevState.count - 1}
      }
      return {
        count: 1,
      }
    })
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderProductData = () => {
    const {productData, count} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productData

    return (
      <div className="each-container">
        <img src={imageUrl} alt="product" className="imageUrl" />
        <div className="product-detailts-container">
          <h1 className="title"> {title} </h1>
          <p className="price"> Rs {price}/- </p>
          <div className="reviews-container">
            <p className="rating">
              {' '}
              {rating}
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </p>
            <p className="totalReviews"> {totalReviews} Reviews </p>
          </div>
          <p className="description"> {description} </p>
          <p className="brand">
            Availability: <p className="span">{availability} </p>
          </p>
          <p className="brand">
            Brand: <p className="span">{brand} </p>
          </p>
          <hr className="hrLine" />

          <div className="increase-dec-container">
            <button
              data-testid="minus"
              onClick={this.onClickMinus}
              type="button"
              className="minus"
            >
              <BsDashSquare />
            </button>
            <p className="count"> {count} </p>
            <button
              data-testid="plus"
              onClick={this.onClickPlus}
              type="button"
              className="minus"
            >
              <BsPlusSquare />
            </button>
          </div>

          <button type="button" className="AddToCart">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state

    return (
      <div className="similar-items-container">
        <h1 className="similar-heading"> similar Products </h1>
        <ul className="similar-container">
          {similarProducts.map(each => (
            <SimilarProductItem key={each.id} item={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="renderFailureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading"> Product Not Found </h1>
      <Link className="failure-link" to="/products">
        <button type="button" className="failure-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <div className="product-item-container">
            {this.renderProductData()}
            {this.renderSimilarProducts()}
          </div>
        )
      case apiStatusConstants.loading:
        return this.renderLoader()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="products-main-container">
        <Header />
        {this.renderApiStatus()}
      </div>
    )
  }
}

export default ProductItemDetails
