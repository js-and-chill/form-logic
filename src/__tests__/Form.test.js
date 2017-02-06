/* @flow */

import React, { PureComponent } from 'react';

const sinon = require('sinon'),
  expect = require('chai').expect;

const Form = require('../Form').default;

/*::
import type { Subscriber } from '../Form';
*/

describe('Form', () => {
  let form, sub1/*: Subscriber */, sub2/*: Subscriber */;
  
  beforeEach(() => {
    sub1 = sinon.spy();
    sub2 = sinon.spy();
    form = new Form({ children: <PureComponent /> });
  });

  describe('subscribeToFormUpdates / unsubscribe', () => {
    it('should correctly add the subscriber to the subscriber list and returns a function to unsubscribe', () => {
      const unsubscribe = form.subscribeToFormUpdates(sub1);
      expect(form.subscribers).to.include(sub1);
      unsubscribe();
      expect(form.subscribers).to.not.include(sub1);
    });
  });

  describe('change emitter', () => {
    it('should correctly call the subscribers on a call to registerRequest, setValue or setError with the updated form data', () => {
      form.subscribeToFormUpdates(sub1);
      form.subscribeToFormUpdates(sub2);
      expect(sub1.callCount).to.be.equal(1);
      expect(sub2.callCount).to.be.equal(1);
      expect(sub1.getCall(0).args[0]).to.eql({ requests: {}, values: {}, errors: {} });
      expect(sub2.getCall(0).args[0]).to.eql({ requests: {}, values: {}, errors: {} });


      const myRequest = Promise.resolve();
      form.registerRequest('myRequest', myRequest);
      expect(sub1.callCount).to.be.equal(2);
      expect(sub2.callCount).to.be.equal(2);
      expect(sub1.getCall(1).args[0]).to.eql({ requests: { myRequest }, values: {}, errors: {} });
      expect(sub2.getCall(1).args[0]).to.eql({ requests: { myRequest }, values: {}, errors: {} });

      const myValue = 'Valuuuee';
      form.setValue('myValue', myValue);
      expect(sub1.callCount).to.be.equal(3);
      expect(sub2.callCount).to.be.equal(3);
      expect(sub1.getCall(2).args[0]).to.eql({ requests: { myRequest }, values: { myValue }, errors: {} });
      expect(sub2.getCall(2).args[0]).to.eql({ requests: { myRequest }, values: { myValue }, errors: {} });

      const myError = 'Errorz';
      form.setError('myError', myError);
      expect(sub1.callCount).to.be.equal(4);
      expect(sub2.callCount).to.be.equal(4);
      expect(sub1.getCall(3).args[0]).to.eql({ requests: { myRequest }, values: { myValue }, errors: { myError } });
      expect(sub2.getCall(3).args[0]).to.eql({ requests: { myRequest }, values: { myValue }, errors: { myError } });
    });
  });
})