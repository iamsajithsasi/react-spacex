import React, { Component } from "react";

export default class ErrorboundaryBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return { error: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <p>Error!!!</p>;
    } else {
      return this.props.children;
    }
  }
}
