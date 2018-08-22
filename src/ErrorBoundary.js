
import React, { Component } from 'react';

class ErrorBoundary extends Component {

    state = { hasError: false }

  componentDidCatch(error, info) {
    // Display fallback UI
    window.alert("Something went wrong. Please try again")
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;