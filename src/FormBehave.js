
import React, {
  PropTypes as T, 
  Component,
} from 'react';

import {
  formContextShape,
} from './Form';

export default class FormBehave extends Component {
  static contextTypes = formContextShape;

  static propTypes = {
    render: T.func.isRequired,
  };

  state = {}

  componentWillMount() {
    this.unsubscribe = this.context.subscribeToFormUpdates(this.onFormChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onFormChange = (form) => {
    this.setState({ ...form });
  }

  render() {
    const {
      render,
    } = this.props;

    return this.props.render(this.state, {
      makeRequest: this.context.makeRequest,
      setValue: this.context.setValue,
      setError: this.context.setError,
    });
  }
}
