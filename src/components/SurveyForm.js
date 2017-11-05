import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { base } from '../base'

class Survey extends Component {
  state = {
    type: 'yesno',
    q: '',
    a1: '',
    a2: '',
    a3: '',
    a4: ''
  }

  onchange = (event, key) => {
    this.setState({ [key]: event.target.value })
  }

  renderForm = type => {
    if (type === 'yesno') {
      return (
        <div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon"
            >
              Q{this.props.idKey}
            </span>
            <input
              onChange={event => this.onchange(event, 'q')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}`}
              value={this.state.q}
              placeholder="Question"
              required
            />
          </div>
        </div>
      )
    } else if (type === 'multiple') {
      return (
        <div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon"
            >
              Q{this.props.idKey}
            </span>
            <input
              onChange={event => this.onchange(event, 'q')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}q`}
              value={this.state.q}
              placeholder="Question"
              required
            />
          </div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon w-3"
            >
              1
            </span>
            <input
              onChange={event => this.onchange(event, 'a1')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}a1`}
              value={this.state.a1}
              placeholder="Option"
              required
            />
          </div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon w-3"
            >
              2
            </span>
            <input
              onChange={event => this.onchange(event, 'a2')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}a2`}
              value={this.state.a2}
              placeholder="Option"
              required
            />
          </div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon"
            >
              3
            </span>
            <input
              onChange={event => this.onchange(event, 'a3')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}a3`}
              value={this.state.a3}
              placeholder="Option"
              required
            />
          </div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon"
            >
              4
            </span>
            <input
              onChange={event => this.onchange(event, 'a4')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}a4`}
              value={this.state.a4}
              placeholder="Option"
              required
            />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="input-group mb-2">
            <span
              style={{ fontFamily: 'monospace' }}
              className="input-group-addon"
            >
              Q{this.props.idKey}
            </span>
            <input
              onChange={event => this.onchange(event, 'q')}
              className="form-control"
              type="text"
              name={`n${this.props.idKey}`}
              value={this.state.q}
              placeholder="Question"
              required
            />
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="card p-3 m-3">
        <div className="mb-4">
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="radio"
                name={`group${this.props.idKey}`}
                value="yesno"
                checked={this.state.type === 'yesno'}
                onChange={event => this.onchange(event, 'type')}
              />{' '}
              YES / NO
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="radio"
                name={`group${this.props.idKey}`}
                value="sentence"
                checked={this.state.type === 'sentence'}
                onChange={event => this.onchange(event, 'type')}
              />{' '}
              Sentence
            </label>
          </div>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="radio"
                name={`group${this.props.idKey}`}
                value="multiple"
                checked={this.state.type === 'multiple'}
                onChange={event => this.onchange(event, 'type')}
              />{' '}
              Multiple
            </label>
          </div>
        </div>
        {this.renderForm(this.state.type)}
      </div>
    )
  }
}

class SurveyForm extends Component {
  state = {
    surveys: [],
    redirect: false,
    surveyTitle: ''
  }

  onChange = event => {
    this.setState({ ...this.state, surveyTitle: event.target.value })
  }

  addSurvey = (key, survey) => {
    const stateCopy = { ...this.state }
    stateCopy.surveys[key] = survey
    this.setState(stateCopy)
  }

  onSubmit = event => {
    event.preventDefault()

    this.addSurvey(0, {
      title: this.state.surveyTitle,
      key: Date.now(),
      active: false
    })
    const surveyKey = this.state.surveys[0].key
    const num = this.props.match.params['num']
    for (let i = 1; i <= num; i++) {
      console.log(i, (this.form[`n${i}`]))
    }
    for (let i = 1; i <= num; i++) {
      const type = this.form[`group${i}`].value
      if (type === 'yesno') {
        const q = this.form[`n${i}`].value
        console.log(q)
        this.addSurvey(i, { type, q })
        base
        .post(`surveyLists/${surveyKey}/data/${i}`, {
          data: { i: i, type: type, q: q }
        })
        .then(() => {
          console.log('success')
        })
        .catch(err => {
          // handle error
          console.log(err)
        })
      } else if (type === 'multiple') {
        const q = this.form[`n${i}q`].value
        console.log(q)
        const a1 = this.form[`n${i}a1`].value
        const a2 = this.form[`n${i}a2`].value
        const a3 = this.form[`n${i}a3`].value
        const a4 = this.form[`n${i}a4`].value
        this.addSurvey(i, { type, q, a1, a2, a3, a4 })
        base
        .post(`surveyLists/${surveyKey}/data/${i}`, {
          data: { i, type, q, a1, a2, a3, a4 }
        })
        .then(() => {
          console.log('success')
        })
        .catch(err => {
          // handle error
          console.log(err)
        })
      } else {
        const q = this.form[`n${i}`].value
        console.log(q)
        this.addSurvey(i, { type, q })
        base
        .post(`surveyLists/${surveyKey}/data/${i}`, {
          data: { i, type, q }
        })
        .then(() => {
          console.log('success')
        })
        .catch(err => {
          // handle error
          console.log(err)
        })
      }
    }
    this.props.createSurvey(this.state.surveys)

    base
      .post(`surveyLists/${surveyKey}/meta`, {
        data: {
          title: this.state.surveyTitle,
          active: false
        }
      })
      .then(() => {
        console.log('success')
      })
      .catch(err => {
        // handle error
        console.log(err)
      })

    this.setState({ ...this.state, redirect: true })
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <div className="alert alert-danger" role="alert">
          You need to login
        </div>
      )
    }
    if (this.state.redirect) {
      return <Redirect to="/dashboard" />
    }

    const num = this.props.match.params['num']

    let surveyComponents = []
    for (let i = 1; i <= num; i++) {
      surveyComponents.push(
        <Survey key={i} idKey={i} addSurvey={this.addSurvey} />
      )
    }
    return (
      <div>
        <form onSubmit={this.onSubmit} ref={form => (this.form = form)}>
          <input
            onChange={this.onChange}
            className="form-control"
            type="text"
            value={this.state.surveyTitle}
            placeholder="Survey Title"
            required
          />
          {surveyComponents}
          <button className="btn btn-outline-success btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    )
  }
}

export default SurveyForm
