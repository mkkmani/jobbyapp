import Header from '../Header'
import './index.css'

const image =
  'https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png'

const NotFound = () => (
  <div>
    <Header />
    <div className="not-found-container">
      <img src={image} className="not-found-image" alt="not found" />
    </div>
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-para">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
