import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
  render () {
    return (
      <div className="mb-5">
        { this.props.authenticated ?
          <Link className="btn btn-outline-primary float-right" to="/logout">Logout</Link>
          : <Link className="btn btn-outline-primary float-right" to="/login">Login</Link>
        }
          <div>
            <Link className="btn btn-outline-dark float-left mr-3" to="/">Home</Link>
            <Link className="btn btn-outline-dark float-left" to="/dashboard">Dashboard</Link>
          </div>
        <div className="clearfix"></div>
      </div>

    )
  }
}

export default Header