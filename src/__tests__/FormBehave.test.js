/* @flow */

import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import FormBehave from '../FormBehave';

const noop = () => null;

describe('FormBehave', () => {
  describe('subscription', () => {
    it('should correctly subscribes to form updates at mount and unsubscribe at unmount', () => {
      const subscribers = [];
      const unsubscribeSpy = sinon.spy();
      const subscribe = (fn) => { subscribers.push(fn); return unsubscribeSpy; };
      const subscribeSpy = sinon.spy(subscribe);

      const behaveComponent = shallow(<FormBehave render={noop} />, {
        context: {
          form: {
            subscribeToFormUpdates: subscribeSpy,
            registerRequest: noop,
            setValue: noop,
            setError: noop,
          },
        },
      });

      expect(subscribeSpy.calledOnce).to.be.true;

      const subFnPassed = subscribeSpy.getCall(0).args[0];
      expect(subFnPassed).to.be.a('function');

      behaveComponent.unmount();

      expect(unsubscribeSpy.calledOnce).to.be.true;
    });
  })
});