import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import applyMixins from '../../../util/applyMixins';
import { Named } from '../';

describe('Named Type Mixin', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'string',
      children: [
        {
          keyword: 'pattern',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: '*'
        },
        {
          keyword: 'length',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: '0..253'
        }
      ]
    },
    null
  );

  class Test implements Named {
    public type: string;
    public addNamedProps: (el: YinElement) => void;
  }

  applyMixins(Test, [Named]);

  it('should parse the type name', () => {
    const testType = new Test();
    testType.addNamedProps(typeEl);

    expect(testType.type).to.equal('string');
  });
});
