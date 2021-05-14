import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import applyMixins from '../../../util/applyMixins';
import { RequiredField } from '../';

describe('Required Field Mixin', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'string'
    },
    null
  );

  class Test implements RequiredField {
    public validateRequiredFields: (el: YinElement, required: string[]) => void;
  }

  applyMixins(Test, [RequiredField]);

  it('should throw if a required field is not provided', () => {
    const testType = new Test();

    expect(() => testType.validateRequiredFields(typeEl, ['foo'])).to.throw('The given type must specify foo.');
  });
});
