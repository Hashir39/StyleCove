import './navbar.css'
import nav_logo from '../../assets/logo.png'
import navprof from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={nav_logo} alt="" className="nav-logo" />
      <p>ADMIN PANEL</p>
      <img src={navprof} className='navprof' alt="" />
    </div>
  )
}

export default Navbar