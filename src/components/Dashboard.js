import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { base } from '../base'

class Dashboard extends Component {
  state = {
    surveysFromDB: [],
    reportAvailable: []
  }

  componentDidMount() {
    base
      .fetch(`surveyLists`, {
        context: this,
        asArray: true
      })
      .then(data => {
        this.setState({ ...this.state, surveysFromDB: data.reverse() })
        data.forEach(survey => {
          base
            .fetch(`surveyResults`, {
              context: this,
              asArray: true
            })
            .then(data => {
              if(data.length > 0) {
                const copyState = { ...this.state }
                data.forEach(elem => {
                  for (let c in elem) {
                    if(isNaN(c) === false) {
                      copyState.reportAvailable[elem[c].surveyKey] = true
                    }
                  }
                })
                this.setState(copyState)
              }
            })
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  componentWIllUpdate() {
    console.log('componentWIllUpdate')
  }
  componentDidUpdate() {}

  onDeleteHandler = key => {
    base
      .remove(`surveyLists/${key}`)
      .then(() => {
        const copyState = { ...this.state }
        const ret = copyState.surveysFromDB.filter(survey => {
          return survey.key !== key
        })
        ret.isLoding = true
        console.log('ret', ret)
        this.setState(ret)
        this.props.deleteSurvey(ret)
        base
          .remove(`surveyResults/${key}`)
          .then(() => {
          })
          .catch(error => {
            console.log(error)
          })

        setTimeout(() => {
          window.location.reload()
        }, 300)
      })
      .catch(error => {
        console.log(error)
      })
  }

  onActiveHandler = (key, active) => {
    this.state.surveysFromDB.forEach(survey => {
      if (survey.key !== key) {
        base
          .update(`surveyLists/${survey.key}/meta`, {
            data: {
              active: false
            }
          })
          .then(() => {})
          .catch(err => {
            //handle error
          })
      } else {
        if (survey.meta.active === true) {
          base
            .update(`surveyLists/${key}/meta`, {
              data: {
                active: false
              }
            })
            .then(() => {
              const copyState = { ...this.state }
              copyState.surveysFromDB.forEach(survey => {
                if (survey.key === key) {
                  survey.meta.active = false
                } else {
                  survey.meta.active = false
                }
              })
              this.setState(copyState)
            })
            .catch(err => {
              //handle error
            })
        } else {
          base
            .update(`surveyLists/${key}/meta`, {
              data: {
                active: true
              }
            })
            .then(() => {
              const copyState = { ...this.state }
              copyState.surveysFromDB.forEach(survey => {
                if (survey.key === key) {
                  survey.meta.active = true
                } else {
                  survey.meta.active = false
                }
              })
              this.setState(copyState)
            })
            .catch(err => {
              //handle error
            })

        }
      }
    })
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <div className="alert alert-danger" role="alert">
          You need to login
        </div>
      )
    }

    const surveyList = this.state.surveysFromDB
    console.log(this.state.reportAvailable)
    return (
      <div>
        <div>
          <Link className="btn btn-outline-info mb-4" to="/createSurvey">
            Create Survey
          </Link>
          <ul className="list-group">
            {surveyList.map(survey => {
              const key = survey.key
              const title = survey.meta.title
              const active = survey.meta.active
              return (
                <li
                  className="list-group-item d-flex justify-content-between align-items-start p-3 display-5"
                  key={key}
                >
                  {title}
                  <div>
                    { this.state.reportAvailable[key] &&
                      <Link className="btn btn-outline-info mr-2" to={`/report/${key}`}>Report</Link>
                    }
                    {active ? (
                      <button
                        onClick={event => this.onActiveHandler(key, active)}
                        className="btn btn-outline-success mr-2"
                      >
                        Active
                      </button>
                    ) : (
                      <button
                        onClick={event => this.onActiveHandler(key, active)}
                        className="btn btn-outline-secondary mr-2"
                      >
                        Deactive
                      </button>
                    )}
                    <button
                      onClick={event => this.onDeleteHandler(key)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default Dashboard
