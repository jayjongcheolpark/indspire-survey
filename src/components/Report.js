import React, { Component } from 'react'

class Report extends Component {
  componentDidMount() {
    console.log(this.props.match.params.surveyId)
  }
  render () {
    if (!this.props.authenticated) {
      return (
        <div className="alert alert-danger" role="alert">
          You need to login
        </div>
      )
    }

    return (
      <div>

      </div>
    )
  }
}

export default Report