/* @flow */

import React, {
  PropTypes as T,
  PureComponent,
  cloneElement,
} from 'react';

import merge from 'lodash.merge';

/*::
export type Subscriber = (FormData) => void;

export type subscribeToFormUpdates = (Subscriber) => (() => void);
export type unsubscribe = (Subscriber) => void;
export type bindedUnsubscribe = () => void;
export type registerRequest = (string, Promise<any>) => void;
export type setValue = (string, any) => void;
export type setError = (string, string) => void;

export type FormContext = {
  subscribeToFormUpdates: subscribeToFormUpdates,
  registerRequest: registerRequest,
  setValue: setValue,
  setError: setError,
};

export type FormData = {
  requests: { [key: string]: Promise<any> },
  values: { [key: string]: any },
  errors: { [key: string]: string },
};

export type Props = {
  initialData?: FormData,
  children: React$Element<any>,
};
*/

export const formContextShape = T.shape({
  subscribeToFormUpdates: T.func,
  registerRequest: T.func,
  setValue: T.func,
  setError: T.func,
});

export default class Form extends PureComponent/*::<void, Props, void>*/ {
  static childContextTypes = {
    form: formContextShape,
  };

  props/*: Props*/;
  subscribers/*: Array<Subscriber> */ = [];
  data/*: FormData */ = {
    requests: {},
    values: {},
    errors: {},
  };

  constructor(props/*: Props */) {
    super(props);
    this.data = merge(this.data, this.props.initialData);
  }
    

  getChildContext()/*: { form: FormContext }*/ {
    return {
      form: {
        subscribeToFormUpdates: this.subscribeToFormUpdates,
        registerRequest: this.registerRequest,
        setValue: this.setValue,
        setError: this.setError,
      }
    };
  }

  subscribeToFormUpdates/*: subscribeToFormUpdates */ = (fn) => {
    this.subscribers.push(fn);
    fn(this.data);
    return this.unsubscribe.bind(this, fn);
  }

  unsubscribe/*: unsubscribe */ = (fn /*: Subscriber*/)/*: void */ => {
    this.subscribers = this.subscribers.filter(sub => sub !== fn);
  }

  emitChange = ()/*: void */ => {
    this.subscribers.forEach(sub => sub(this.data));
  }

  /* Form state */
  registerRequest/*: registerRequest */ = (name, promise) => {
    this.data.requests[name] = promise;

    const removeSelf = () => {
      if (this.data.requests[name] === promise) {
        delete this.data.requests[name];
        this.emitChange();
      }
    };

    promise
      .then(removeSelf, removeSelf);

    this.emitChange();
  }

  setValue/*: setValue */ = (name, value) => {
    this.data.values[name] = value;
    this.emitChange();
  }

  setError/*: setError */ = (name, error) => {
    this.data.errors[name] = error;
    this.emitChange();
  }

  render() {
    const {
      initialData,
      children,
      ...others
    } = this.props;

    return cloneElement(this.props.children, others);
  }
}
