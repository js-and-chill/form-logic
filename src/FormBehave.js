/* @flow */

import React, {
  PropTypes as T, 
  Component,
} from 'react';

import {
  formContextShape,
} from './Form';

/*::
import type { FormContext, FormData, bindedUnsubscribe, registerRequest, setValue, setError } from './Form';

export type Props = {
  render: (FormData, FormContext) => React$Element<any>,
};

*/

export default class FormBehave extends Component {
  static contextTypes = {
    form: formContextShape,
  };

  static propTypes = {
    render: T.func.isRequired,
  };

  /*::
  context: { form: FormContext };
  state: FormData;
  props: Props;
  
  unsubscribe: bindedUnsubscribe;
  */


  componentWillMount() {
    this.unsubscribe = this.context.form.subscribeToFormUpdates(this.onFormChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onFormChange = (form/*: FormData */) => {
    this.setState(form);
  }

  render() {
    const {
      render,
    } = this.props;

    return this.props.render(this.state, this.context.form);
  }
}
