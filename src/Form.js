/* @flow */

import React, {
  PropTypes as T,
  PureComponent,
} from 'react';

import {
  View,
} from 'react-native';

import type Children from 'react';

import merge from 'lodash.merge';

export const formContextShape = {
  form: T.shape({
    subscribeToFormUpdates: T.func,
    makeRequest: T.func,
    setValue: T.func,
    setError: T.func,
  }),
};

type FormData = {
  requests: { [key: String]: Promise<any> },
  values: { [key: String]: any },
  errors: { [key: String]: String },
};

type Props = {
  initialData: FormData,
  children: Children,
};


export default class Form extends PureComponent {
  static childContextTypes = formContextShape;

  props: Props;
  subscribers = []
  initialData: FormData = {
    requests: {},
    values: {},
    errors: {},
  };
  data: FormData = merge(this.initialData, this.props.initialData);

  getChildContext() {
    return {
      subscribeToFormUpdates: this.subscribeToFormUpdates,
      makeRequest: this.makeRequest,
      setValue: this.setValue,
      setError: this.setError,
    };
  }

  /* Subscribers */
  subscribeToFormUpdates = (fn: (formData: FormData) => void) => {
    this.subscribers.push(fn);
    fn(this.data);

    return this.unsubscribe.bind(this, fn);
  }

  unsubscribe = (fn: (formData: FormData) => void) => {
    this.subscribers = this.subscribers.filter(sub => sub !== fn);
  }

  emitChange = () => {
    this.subscribers.forEach(sub => sub(this.data));
  }

  /* Form state */
  makeRequest = (name: String, promise: Promise<any>) => {
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

  setValue = (name: String, value: any) => {
    this.data.values[name] = value;
    this.emitChange();
  }

  setError = (name: String, error: String) => {
    this.data.errors[name] = error;
    this.emitChange();
  }

  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}