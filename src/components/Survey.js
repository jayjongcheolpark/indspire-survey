import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { base } from '../base'

const CustomRadio = props => {
  return (
    <div className="mt-3">
      <div className="form-check form-check-inline">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            name={`n${props.idKey}`}
            value="1"
            required
          />
          {'  '}
          <h5 className="text-dark">{props.a1}</h5>
        </label>
      </div>
      <div className="form-check">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            name={`n${props.idKey}`}
            value="2"
          />
          {'  '}
          <h5 className="text-dark">{props.a2}</h5>
        </label>
      </div>
      <div className="form-check">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            name={`n${props.idKey}`}
            value="3"
          />
          {'  '}
          <h5 className="text-dark">{props.a3}</h5>
        </label>
      </div>
      <div className="form-check">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            name={`n${props.idKey}`}
            value="4"
          />
          {'  '}
          <h5 className="text-dark">{props.a4}</h5>
        </label>
      </div>
    </div>
  )
}

class YesForm extends Component {
  state = {
    check: 'yes'
  }
  onClick = event => {
    this.setState({
      check: event.target.value
    })
  }
  render() {
    console.log(this.props.q)
    let yesBtn = 'btn btn-outline-success'
    let noBtn = 'btn btn-outline-danger'
    if (this.state.check === 'no') {
      noBtn = 'btn btn-outline-danger active'
    } else {
      yesBtn = 'btn btn-outline-success active'
    }
    return (
      <div className="card p-3 my-3">
        <h3 className="mb-3">{this.props.q}</h3>
        <div
          className="btn-group d-flex justify-content-start mt-3 ml-5"
          data-toggle="buttons"
        >
          <label className={yesBtn}>
            <input
              onChange={this.onClick}
              type="radio"
              checked={this.state.check === 'yes'}
              name={`n${this.props.idKey}`}
              id="option1"
              value="yes"
              required
            />{' '}
            YES
          </label>
          <label className={noBtn}>
            <input
              onChange={this.onClick}
              type="radio"
              checked={this.state.check === 'no'}
              name={`n${this.props.idKey}`}
              id="option2"
              value="no"
            />{' '}
            NO
          </label>
        </div>
      </div>
    )
  }
}

class MultipleForm extends Component {
  render() {
    console.log(this.props.q)
    return (
      <div className="card p-3 my-3">
        <h3 className="mb-3">{this.props.q}</h3>
        <CustomRadio {...this.props} />
      </div>
    )
  }
}

class SentenceForm extends Component {
  render() {
    console.log(this.props.q)
    return (
      <div className="card p-3 my-3">
        <h3 className="mb-3">{this.props.q}</h3>
        <input
          className="form-control"
          type="text"
          name={`n${this.props.idKey}`}
          required
        />
      </div>
    )
  }
}

class StudentForm extends Component {
  state = {
    surveys: [],
    redirect: false
  }

  combineSurvey = event => {
    event.preventDefault()

    const stateCopy = { ...this.state }
    const surveyResult = this.state.surveys[0].data.map(survey => {
      survey.value = this.form[`n${survey.i}`].value
      return survey
    })

    base
      .fetch(
        `surveyResults/${this.state.surveys[0].key}/${this.props.studentNum}`,
        {
          context: this,
          asArray: true
        }
      )
      .then(data => {
        if (data.length === 0) {
          base
            .post(
              `surveyResults/${this.state.surveys[0].key}/${this.props
                .studentNum}`,
              {
                data: { ...surveyResult, surveyKey: this.state.surveys[0].key }
              }
            )
            .then(() => {
              console.log('success')
            })
            .catch(err => {
              // handle error
              console.log(err)
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
      // setTimeout(() => {window.location.reload()}, 1000)
    stateCopy.redirect = true
    this.setState(stateCopy)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  componentDidMount() {
    this.setState({ surveys: this.props.surveys })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />
    }
    const { surveys } = this.props
    console.log(surveys)
    const renderForms = []
    surveys[0].data.forEach((survey, i) => {
      if (survey.type === 'yesno') {
        renderForms.push(<YesForm idKey={i} key={i} q={survey.q} />)
      } else if (survey.type === 'multiple') {
        const { q, a1, a2, a3, a4 } = survey
        renderForms.push(
          <MultipleForm
            key={i}
            idKey={i}
            q={q}
            a1={a1}
            a2={a2}
            a3={a3}
            a4={a4}
          />
        )
      } else if (survey.type === 'sentence') {
        renderForms.push(<SentenceForm idKey={i} key={i} q={survey.q} />)
      }
    })
    renderForms.push(
      <button
        key="99999"
        className="mt-3 btn btn-block btn-outline-success"
        type="submit"
      >
        Submit
      </button>
    )

    return (
      <form
        onSubmit={event => this.combineSurvey(event)}
        ref={form => (this.form = form)}
      >
        {renderForms.length > 0 && renderForms}
      </form>
    )
  }
}

class Survey extends Component {
  state = {
    studentNum: 1,
    redirect: false,
    surveysFromDB: []
  }

  onChange = event => {
    this.setState({ ...this.state, studentNum: event.target.value })
  }

  onSubmit = event => {
    event.preventDefault()

    this.setState({ ...this.state, redirect: true })
  }

  componentDidMount() {
    base
      .fetch(`surveyLists`, {
        context: this,
        asArray: true
      })
      .then(data => {
        this.setState({ ...this.state, surveysFromDB: data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    console.log("hey")
    let ret = null
    ret = this.state.surveysFromDB.filter(survey => {
      return survey.meta.active === true
    })
    if (ret.length === 0) {
    console.log("nothing")
      return <div />
    }

    if (this.state.redirect) {
      return (
        <StudentForm
          surveyResult={this.props.surveyResult}
          studentNum={this.state.studentNum}
          surveys={ret}
        />
      )
    }

    return (
      <div>
        <div className="small">Survey Title</div>
        <h2 className="mb-5 display-5">{ret[0].meta.title}</h2>
        <div className="d-flex justify-content-center mt-5">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>
                <h3 className="text-secondary">Enter your number</h3>
                <input
                  onChange={this.onChange}
                  className="form-control form-control-lg"
                  type="number"
                  min="1"
                  max="5000"
                  value={this.state.studentNum}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Survey
