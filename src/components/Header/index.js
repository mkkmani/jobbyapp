import {Link, withRouter} from 'react-router-dom'
import {ImHome} from 'react-icons/im'
import {FaBriefcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const webSiteLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <ul className="header-ul-container">
        <li className="logo-container">
          <Link className="link" to="/">
            <img className="logo" src={webSiteLogo} alt="website logo" />
          </Link>
        </li>
        <li className="home-jobs-container">
          <Link className="link" to="/">
            <ImHome className="home-icon" />
            <h1 className="nav-text">Home</h1>
          </Link>
          <Link className="link" to="/jobs">
            <FaBriefcase className="home-icon" />
            <h1 className="nav-text">Jobs</h1>
          </Link>
        </li>
        <li>
          <FiLogOut className="home-icon" onClick={onClickLogout} />
          <button type="button" className="btn-logout" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
