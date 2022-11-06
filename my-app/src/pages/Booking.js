import * as React from 'react';
import './Booking.css';
import { ScheduleMeeting } from 'react-schedule-meeting';
import { format } from 'date-fns';
import validator from 'validator';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRadioGroup } from '@mui/material/RadioGroup';
const availableTimeslots = [0, 1, 2, 3, 4, 5].map(id => {
  return {
    id,
    startTime: new Date(
      new Date(new Date().setDate(new Date().getDate() + id)).setHours(
        9,
        0,
        0,
        0
      )
    ),
    endTime: new Date(
      new Date(new Date().setDate(new Date().getDate() + id)).setHours(
        22,
        0,
        0,
        0
      )
    ),
  };
});
function validate(name, number, pkg, g1) {
  const errors = [];

  if (name.length === 0) {
    errors.push("Name can't be empty");
  }
  if (!validator.isAlpha(name)) {
    errors.push('Please enter a valid name');
  }
  if (number.length === 0) {
    errors.push("Number can't be empty");
  }
  if (!validator.isNumeric(number) && number.length < 10) {
    errors.push('Please enter a valid number');
  }
  if (pkg.length === 0 || !(pkg === 'Bronze') || !(pkg === 'Sliver')) {
    errors.push('Please choose a package');
  }
  if (g1.length === 0 || !(g1 === 'Yes') || !(g1 === 'No')) {
    errors.push('Please choose if you pass the G1 test');
  }
  if (g1 === 'No') {
    errors.push('Please pass G1 first');
  }

  return errors;
}
function notify(name, number, thisMessage, date) {
  fetch('https://textbelt.com/text', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '6479976478',
      message: thisMessage + date,
      key: 'textbelt',
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
    });
}


export default class SignUpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      number: '',
      pkg: '',
      g1: '',
      date: '',
      errors: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { name, number, pkg, g1, date } = this.state;
    const errors = validate(name, number, pkg, g1);
    if (errors.length > 0) {
      this.setState({ errors });
      <p key={errors}>Error: {errors}</p>

    }
    // submit the data...
    else {
      notify(name, number, 'This is the confirmation for your booking on ', date);
    }
    return


  }
  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.value === 'Bronze') {
      this.setState({ pkg: 'Bronze' });
    } else if (this.value === 'Sliver') {
      this.setState({ pkg: 'Sliver' });
    }
  };
  handleDate = (startTimeEventEmit) => {
    this.setState({ date: format(startTimeEventEmit.startTime, 'cccc, LLLL do h:mm a') });
    return;
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="Booking">
        <ScheduleMeeting
          borderRadius={10}
          primaryColor="#3f5b85"
          eventDurationInMinutes={120}
          eventStartTimeSpreadInMinutes={0}
          availableTimeslots={availableTimeslots}
          onStartTimeSelect={this.handleDate}
          onNoFutureTimesAvailable={console.log}
        />        <div className="center">
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input
                value={this.state.name}
                onChange={evt => this.setState({ name: evt.target.value })}
                type="text"
                placeholder="Name"
              />
            </label>
            <label>
              Phone Number:
              <input
                value={this.state.number}
                onChange={evt => this.setState({ number: evt.target.value })}
                type="text"
                placeholder="Phone number"
              />
            </label>

            <p>Choose your package:</p>
            <RadioGroup
              aria-labelledby="demo-error-radios"
              name="pkg"
              value={this.pkg}
              onChange={this.handlePkgClick}
            >
              <FormControlLabel value="Bronze" control={<Radio />} label="Bronze" />
              <FormControlLabel value="Sliver" control={<Radio />} label="Sliver" />
            </RadioGroup>


            <p>Did you pass G1?</p>
            <div className="center">
              <input
                value={this.state.pkg}
                onChange={evt => this.setState({ pkg: evt.target.value })}
                type="radio"
                placeholder="g1"
                id="Yes"
                name="Yes"
              />
              <span>Yes</span>
              <input
                value={this.state.pkg}
                onChange={evt => this.setState({ pkg: evt.target.value })}
                type="radio"
                placeholder="g1"
                id="No"
                name="No"
              />
              <span>No</span>
            </div>
            <p>Info confirmation:</p>
            <p>Your name is {this.state.name}, your number is {this.state.number}, you selected {this.state.date} with {this.state.pkg}</p>
            <div className="center">
              <button type="submit" onClick={this.handleSubmit}>
                Submit
              </button>

            </div>
            {
              errors.map(error => (
                <p key={error}>Error: {error}</p>
              ))
            }
          </form >
        </div >
        <br></br>
      </div >
    );
  }
}

