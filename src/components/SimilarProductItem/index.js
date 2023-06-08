import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {imageUrl, title, brand, price, rating} = item

  return (
    <li className="list-item">
      <img src={imageUrl} className="similarImg" alt="similar product" />
      <h1 className="item-heading"> {title} </h1>
      <p className="item-brand-1"> {brand} </p>
      <div className="each-item-rating-container">
        <h1 className="item-price"> Rs {price}/- </h1>
        <p className="rating1">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star1"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
