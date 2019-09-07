import React from 'react';

class Comp1 extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <input value={this.props.value} onChange={this.handleChange} />
    );
  }
}

export default Comp1;

