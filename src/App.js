import React from 'react';
import './App.css';
import Comp1 from './Comp1.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      type: null
    };
  }

  handleAChange = (value) => {
    this.setState({
      value: value,
      type: 'a'
    });
  }

  handleBChange = (value) => {
    this.setState({
      value: value,
      type: 'b'
    });
  }

  render() {
    let a = this.state.type === 'b' ? (parseInt(this.state.value) + 1) : this.state.value;
    let b = this.state.type === 'a' ? (parseInt(this.state.value) - 1) : this.state.value;
    return (
      <div className="App">
        <Comp1 type="a" value={a} onChange={this.handleAChange}></Comp1>
        <Comp1 type="b" value={b} onChange={this.handleBChange}></Comp1>
      </div>
    );
  }
}

export default App;
