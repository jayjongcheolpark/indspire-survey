import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { app } from '../base'

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
}

class Login extends Component {

  state = {
    redirect: false
  }

  authWithEmailPassword = (event) => {
    event.preventDefault()

    const email = this.emailInput.value
    const password = this.passwordInput.value

    app.auth().fetchProvidersForEmail(email)
      .then((providers) => {
         // sign user in
          return app.auth().signInWithEmailAndPassword(email, password)
      })
      .then((user) => {
        if (user && user.email) {
          this.loginForm.reset()
          this.setState({redirect: true})
        }
      })
      .catch((error) => {
        console.error(error.message)
      })
  }

  render () {
    if (this.state.redirect === true) {
      return <Redirect to='/dashboard' />
    }
    return (
      <div style={loginStyles}>
        <form
          onSubmit={(event) => { this.authWithEmailPassword(event) }}
          ref={(form) => { this.loginForm = form }}
        >
          <div className="form-group">
            <input className="form-control" style={{width: "100%"}} name="email" type="email" ref={(input) => { this.emailInput = input }} placeholder="Email" />
            <input className="form-control" style={{width: "100%"}} name="password" type="password" ref={(input) => { this.passwordInput = input }} placeholder="Password" />
            <input className="btn btn-primary" style={{width: "100%"}} type="submit" value="Log In" />
          </div>
        </form>
      </div>
    )
  }
}

export default Login