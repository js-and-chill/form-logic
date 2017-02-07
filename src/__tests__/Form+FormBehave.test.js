/* @flow */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Form from '../Form';
import FormBehave from '../FormBehave';

describe('Form + FormBehave', () => {
  it('doesn\'t throw', () => {
    const formComponent = shallow(
      <Form>
        <FormBehave render={() => null} />
      </Form>
    );
  });
});