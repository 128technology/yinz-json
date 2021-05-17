import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import applyMixins from '../../../util/applyMixins';
import { WithCustomProperties } from '../';

describe('Custom Properties Mixin', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'string',
      children: [
        {
          keyword: 'foo',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          text: 'bar'
        },
        {
          keyword: 'moo',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          text: null
        },
        {
          keyword: 'zoo',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          text: null
        }
      ]
    },
    null
  );

  class Test implements WithCustomProperties {
    public otherProps: Map<string, string | boolean>;
    public addCustomProperties: (el: YinElement, ignoreList: string[]) => void;
  }

  applyMixins(Test, [WithCustomProperties]);

  it('should parse the other properties', () => {
    const testOther = new Test();
    testOther.addCustomProperties(typeEl, ['zoo']);
    const map = testOther.otherProps;
    expect(map.get('foo')).to.equal('bar');
    expect(map.get('moo')).to.equal(true);
    expect(map.has('zoo')).to.equal(false);
  });
});
