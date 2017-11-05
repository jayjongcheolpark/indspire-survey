import React, { Component } from 'react'
import { base } from '../base'
import {Pie} from 'react-chartjs-2';

const data = {
	labels: [
		'Red',
		'Yellow'
	],
	datasets: [{
		data: [],
		backgroundColor: [
		'#FF6384',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#FFCE56'
		]
	}]
};

const YesReport = (props) => {
  const data = {
    labels: [
      'Yes',
      'No'
    ],
    datasets: [{
      data: [props.data.yes, props.data.no],
      backgroundColor: [
      '#FF6384',
      '#FFCE56'
      ],
      hoverBackgroundColor: [
      '#FF6384',
      '#FFCE56'
      ]
    }]
  }
  return (
    <li className="list-group-item">
      <h3>{props.q}</h3>
      <Pie data={data} weight={100} height={100} />
    </li>
  )
}

const MultiReport = (props) => {
  const data = {
    labels: [
      `${props.a1}`,
      `${props.a2}`,
      `${props.a3}`,
      `${props.a4}`
    ],
    datasets: [{
      data: [props.data.one, props.data.two, props.data.three, props.data.four],
      backgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#FFCE56',
        '#E7E9ED',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#FFCE56',
        '#E7E9ED',
      ]
    }]
  }
  return (
    <li className="list-group-item">
      <h3>{props.q}</h3>
      <Pie data={data} weight={100} height={100} />
    </li>
  )
}

const SenReport = (props) => {
  return (
    <li className="list-group-item">
      <h3>{props.q}</h3>
      <ul className="list-group">
        {props.data.sentence.map((elem, index) => {
          return <li key={`${elem}${index}`} className="list-group-item">{elem}</li>
        })}
      </ul>
    </li>
  )

}

class Report extends Component {
  state = {
    results: []
  }

  componentDidMount() {
    const {surveyId} = this.props.match.params
    base
    .fetch(
      `surveyResults/${surveyId}`,
      {
        context: this,
        asArray: true
      }
    )
    .then(data => {
      this.setState({ ...this.state, results: data })
    })
  }

  render () {
    if (!this.props.authenticated) {
      return (
        <div className="alert alert-danger" role="alert">
          You need to login
        </div>
      )
    }

    const { results } = this.state
    console.log(results)
    if (results.length === 0) {
      return <div></div>
    }

    const numOfRecord = results.length
    const numOfQuestion = results[0].length

    const resultContainer = []
    resultContainer.push("")
    for (let i = 1; i < numOfQuestion; i++) {
      if (results[0][i].type === "yesno") {
        resultContainer.push({yes: 0, no: 0})
      } else if (results[0][i].type === "multiple") {
        resultContainer.push({one: 0, two: 0, three: 0, four: 0})
      } else if (results[0][i].type === "sentence") {
        resultContainer.push({sentence: []})
      }
    }

    for (let j = 0; j < numOfRecord; j++) {
      for (let i = 1; i < numOfQuestion; i++) {
        if (results[j][i].type === "yesno") {
          if (results[j][i].value === "yes") {
            resultContainer[i].yes = resultContainer[i].yes + 1
          } else if (results[j][i].value === "no") {
            resultContainer[i].no = resultContainer[i].no + 1
          }
        } else if (results[j][i].type === "multiple") {
          if (results[j][i].value === "1") {
            resultContainer[i].one = resultContainer[i].one + 1
          }
          else if (results[j][i].value === "2") {
            resultContainer[i].two = resultContainer[i].two + 1
          }
          else if (results[j][i].value === "3") {
            resultContainer[i].three = resultContainer[i].three + 1
          }
          else if (results[j][i].value === "4") {
            resultContainer[i].four = resultContainer[i].four + 1
          }
        }
        else if (results[j][i].type === "sentence") {
           resultContainer[i].sentence.push(results[j][i].value)
        }
      }
    }

    console.log(resultContainer)
    const renderReport = []
    for (let i = 1; i < resultContainer.length; i++) {
      if (results[0][i].type === "yesno") {
        renderReport.push(<YesReport key={i} q={results[0][i].q} data={resultContainer[i]} />)
      } else if (results[0][i].type === "multiple") {
        renderReport.push(<MultiReport
                          key={i}
                          q={results[0][i].q}
                          a1={results[0][i].a1}
                          a2={results[0][i].a2}
                          a3={results[0][i].a3}
                          a4={results[0][i].a4}
                          data={resultContainer[i]} />)
      } else if (results[0][i].type === "sentence") {
        renderReport.push(<SenReport key={i} q={results[0][i].q} data={resultContainer[i]} />)
      }
    }
    return (
      <li className="list-group">
      { renderReport.length > 0 && renderReport }

      </li>
    )
  }
}

export default Report