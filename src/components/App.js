import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import { app } from '../base'
import Header from './Header'
import Login from './Login'
import Logout from './Logout'
import Dashboard from './Dashboard'
import CreateSurvey from './CreateSurvey'
import SurveyForm from './SurveyForm'
import Survey from './Survey'
import Report from './Report'

class App extends Component {

  state = {
    authenticated: false,
    loading: true,
    surveyList: [],
    surveyResult: []
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          ...this.state,
          authenticated: true,
          loading: false
        })
      } else {
        this.setState({
          ...this.state,
          authenticated: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount() {
    this.removeAuthListener()
  }

  componentWillUpdate(nextProps, nextState) {
  }

  createSurvey = (survey) => {
    const stateCopy = { ...this.state }
    stateCopy.surveyList.unshift(survey)
    this.setState(stateCopy)
  }

  handler = (newList) => {
    const stateCopy = { ...this.state }
    stateCopy.surveyList = newList
    this.setState(stateCopy)
  }

  surveyResultHandler = (newObj) => {
    console.log("",newObj)
    const stateCopy = { ...this.state }
    stateCopy.surveyResult.push(newObj)
    this.setState(stateCopy)
  }

  render () {
    if (this.state.loading === true) {
      return (
        <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
          <h3>Loading</h3>
        </div>
      )
    }

    return (
      <div className="container mt-4">
        <BrowserRouter>
          <div>
            <Header authenticated={this.state.authenticated} />
            <Route exact path="/" render={(props) => (
              <Survey
                surveyResult={this.surveyResultHandler}
                surveyList={this.state.surveyList}
                {...props}
              />
            )}/>
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/dashboard" render={(props) => (
              <Dashboard
                surveyList={this.state.surveyList}
                deleteSurvey={this.handler}
                activeHandler={this.handler}
                authenticated={this.state.authenticated} {...props}
              />
            )}/>
            <Route exact path="/createSurvey" render={(props) => (
              <CreateSurvey
                authenticated={this.state.authenticated}
                {...props}
              />
            )}/>
            <Route path="/surveyForm/:num" render={(props) => (
              <SurveyForm
                authenticated={this.state.authenticated}
                createSurvey={this.createSurvey}
                {...props}
              />
            )}/>
            <Route exact path="/report/:surveyId" render={(props) => (
              <Report
                authenticated={this.state.authenticated}
                {...props}
              />
            )}/>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App