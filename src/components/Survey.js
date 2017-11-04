import React, { Component } from 'react'

class Survey extends Component {
  render () {
    const { surveyList } = this.props
    const renderComponent = null
    if (surveyList.length > 0) {
      const activeSurvey = surveyList.filter(survey => survey[0].active === true)
      console.log(activeSurvey)
    }

    return (
      <div>
      </div>
    )
  }
}

export default Survey