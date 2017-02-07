/* @flow */

import React, {
  PureComponent,
} from 'react';
import './App.css';

import Form from '../../../build/Form';
import FormBehave from '../../../build/FormBehave';

class App extends PureComponent {
  register() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  }

  render() {
    return (
      <div className="app">
        <h2>Simple Form Example</h2>
        <Form>
          <FormBehave render={({ values }) => (
            <h1>
              {values.name
                ? `Hello, ${values.name} !`
                : 'Who are you ?'}
            </h1>
          )}/>

          <div style={{ marginBottom: '8px' }}>
            <FormBehave render={({ requests, values }, { setValue }) => (
              <Input
                style={{ marginRight: '8px' }}
                type="text"
                placeholder="Name"
                value={values.name || ''}
                onChange={(e) => setValue('name', e.target.value)}
                disabled={requests.register}
              />
            )}/>

            <FormBehave render={({ requests, values }, { setValue }) => (
              <Input
                style={{ marginRight: '8px' }}
                type="text"
                placeholder="Last name"
                value={values.lastName || ''}
                onChange={(e) => setValue('lastName', e.target.value)}
                disabled={!!requests.register}
              />
            )}/>
          </div>

          <FormBehave render={({ requests, values }, { registerRequest }) => (
            <Button
              onClick={() => registerRequest('register', this.register())}
              disabled={!values.name || !values.lastName || requests.register}
            >
              {!!requests.register
                ? 'Registering...'
                : 'Register !'}
            </Button>
          )}/>

        </Form>
      </div>
    );
  }
}

class Input extends PureComponent {
  static defaultProps = {
    style: {},
  };

  render() {
    const {
      style,
      disabled,
      ...others
    } = this.props;

    const disabledStyle = disabled
      ? disabledInputStyle
      : {};

    return (
      <input style={{...inputStyle, ...disabledStyle, ...style}} disabled={disabled} {...others} />
    );
  }
}

const inputStyle = {
  padding: 8,
  border: '1px solid #ccc',
  borderRadius: '3px',
  fontSize: '15px',
};

const disabledInputStyle = {
  backgroundColor: '#eee',
};

class Button extends PureComponent {
  render() {
    const {
      style,
      disabled,
      children,
      ...others
    } = this.props;

    const disabledStyle = disabled
      ? disabledButtonStyle
      : {};

    return (
      <button style={{...buttonStyle, ...disabledStyle, ...style}} disabled={disabled} {...others}>
        {children}
      </button>
    );
  }
}

const buttonStyle = {
  fontSize: '15px',
  padding: '6px 8px',
  borderRadius: '3px',
  border: '1px solid #ccc',
  backgroundColor: '#f9f9f9',
  cursor: 'auto',
};

const disabledButtonStyle = {
  backgroundColor: '#eee',
};

export default App;
