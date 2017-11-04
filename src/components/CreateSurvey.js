import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class CreateSurvey extends Component {
  state = {
    numOfQuestion: 1,
    redirect: false
  }

  onChange = (event) => {
    this.setState({ numOfQuestion: event.target.value })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.setState({ redirect: true })
  }

  render () {
    if (!this.props.authenticated) {
      return <div className="alert alert-danger" role="alert">You need to login</div>
    }

    if (this.state.redirect) {
      return <Redirect to={"/surveyForm/" + this.state.numOfQuestion} />
    }
    return (
      <div className="row justify-content-center align-item-center">
        <form onSubmit={this.onSubmit}>
          <label>
            How many questions you want to create for survey ?
            <input
              className="form-control form-control-lg mt-3"
              type="number" min="1" max="10"
              name="numOfQuestion"
              value={this.state.numOfQuestion}
              onChange={this.onChange}
            />
          </label>
        </form>
      </div>
    )
  }
}

export default CreateSurvey