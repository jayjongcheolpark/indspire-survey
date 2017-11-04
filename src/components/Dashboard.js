import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Dashboard extends Component {

  onDeleteHandler = (key) => {
    const newList = this.props.surveyList.filter(survey => {
      if (survey[0].key === key)
        console.log("find")
      return survey[0].key !== key
    })
    this.props.deleteSurvey(newList)
  }

  onActiveHandler = (key, active) => {
    const newList = this.props.surveyList.map(survey => {
      if (survey[0].key === key) {
        survey[0].active = !survey[0].active
      } else {
        survey[0].active = false
      }
      return survey
    })
    this.props.activeHandler(newList)
  }

  render () {
    if (!this.props.authenticated) {
      return <div className="alert alert-danger" role="alert">You need to login</div>
    }
    const { surveyList } = this.props
    return (
      <div>
        <div>
          <Link className="btn btn-outline-info mb-4" to="/createSurvey">Create Survey</Link>
          <ul className="list-group">
            { surveyList.map(survey => {
              const { key, title, active } = survey[0]
              return (
                <li className="list-group-item d-flex justify-content-between align-items-start"
                  key={key}>{title}
                    <div>
                      { active ?
                        <button
                          onClick={(event) => this.onActiveHandler(key, active)}
                          className="btn btn-outline-success mr-2">
                          Active
                          </button>
                        :
                        <button
                          onClick={(event) => this.onActiveHandler(key, active)}
                          className="btn btn-outline-secondary mr-2">
                          Deactive
                        </button>
                      }
                      <button
                        onClick={(event) => this.onDeleteHandler(key)}
                        className="btn btn-outline-danger">
                        Delete
                      </button>
                    </div>
                </li>
              )
            }) }
          </ul>
        </div>
      </div>
    )
  }
}

export default Dashboard