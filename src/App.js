import React from 'react';
import './App.css';
import axios from 'axios';


//component for api response result
const MyApiResponse = (props) => (
  <div>
    <table>
      <tr>
    ApiResult: {props.apiResponse.responseData}
      </tr>
      <tr>
    StatusCode: {props.apiResponse.status}
      </tr>
    </table>
  </div>
);

class App extends React.Component {
  state = {
    apiResponse: { responseData: 'N/A', status: 404 }
  };
  displayNewResult = (resultData) => {
    this.setState(prevState => ({
      apiResponse: resultData
    }));
    console.log('App - result data', resultData);
  };

  render() {
    return ( 
      <div>
        <div className="header">{this.props.title}</div>
        <Form onSubmit={this.displayNewResult} />
        <MyApiResponse apiResponse={this.state.apiResponse} />
      </div>
      );
  } 
}

class Form extends React.Component {
   constructor(props) {
    super(props);
    this.state = { numbers: '', delimiter: '', value: 'Add'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //handler for select list change
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  //handler for form submission
  handleSubmit = async (event) =>  {
    event.preventDefault();

    var callResponse = { responseData: '', status: 0};
    
    //note use a local api url:port for testing locally
    //const apiCallString = `http://localhost:/api/v1/calculate?numbers=${this.state.numbers}&delimiter=${this.state.delimiter}&calcType=${this.state.value}`
    const apiCallString = `https://calculator.kilohsoftware.com/api/v1/calculate?numbers=${this.state.numbers}&delimiter=${this.state.delimiter}&calcType=${this.state.value}`
    
    const resp = await axios.get(apiCallString)
      .catch(function (error) {
        if (error.response) {
          callResponse.responseData = error.response.data;
          callResponse.status = error.response.status;
        }
      });
    
    if(resp != null) {
       callResponse.responseData = resp.data;
       callResponse.status = resp.status;
    }

    this.props.onSubmit(callResponse);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          value={this.state.numbers}
          onChange={event => this.setState({numbers: event.target.value})}
          placeholder="numbers" 
          required
          />
        <input 
          type="text" 
          maxlength="1"
          value={this.state.delimiter}
          onChange={event => this.setState({delimiter: event.target.value})}
          placeholder="delimiter" 
          required
          />
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="Add">Add</option>
            <option value="Multiply">Multiply</option>
            <option value="Subtract">Subtract</option>
          </select>
        <button>Get Result</button>
      </form>
      );
  }
}



export default App;