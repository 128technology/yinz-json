import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import applyMixins from '../../../util/applyMixins';
import { Type } from '../../../types';

import { WithUnits, Typed } from '../';
import { Identities } from '../../';

describe('With Units Mixin', () => {
  class Test implements WithUnits, Typed {
    public definedUnits: string;
    public type: Type;
    public units: string;

    public addDefinedUnits: (el: YinElement) => void;
    public addTypeProps: (el: YinElement, identities: Identities) => void;

    constructor(el: YinElement) {
      this.addTypeProps(el, new Identities());
      this.addDefinedUnits(el);
    }
  }

  applyMixins(Test, [WithUnits, Typed]);

  const withTypeDefUnits = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'name',
      children: [
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 't128ext:tenant-name',
          children: [
            {
              keyword: 'typedef',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'tenant-name',
              children: [
                { keyword: 'units', namespace: 'urn:ietf:params:xml:ns:yang:yin:1', name: 'floops' },
                {
                  keyword: 'type',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  name: 'string',
                  children: [{ keyword: 'length', namespace: 'urn:ietf:params:xml:ns:yang:yin:1', value: '0..253' }]
                }
              ]
            }
          ]
        }
      ]
    },
    null
  );

  const withBothUnits = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'name',
      children: [
        { keyword: 'units', namespace: 'urn:ietf:params:xml:ns:yang:yin:1', name: 'boops' },
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 't128ext:tenant-name',
          children: [
            {
              keyword: 'typedef',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'tenant-name',
              children: [
                { keyword: 'units', namespace: 'urn:ietf:params:xml:ns:yang:yin:1', name: 'floops' },
                {
                  keyword: 'type',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  name: 'string',
                  children: [{ keyword: 'length', namespace: 'urn:ietf:params:xml:ns:yang:yin:1', value: '0..253' }]
                }
              ]
            }
          ]
        }
      ]
    },
    null
  );

  const withLeafUnits = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'name',
      children: [
        { keyword: 'units', namespace: 'urn:ietf:params:xml:ns:yang:yin:1', name: 'flops' },
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'string'
        }
      ]
    },
    null
  );

  const noUnits = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'name',
      children: [
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'string'
        }
      ]
    },
    null
  );

  it('should add the defined units to the object', () => {
    const model = new Test(withLeafUnits);

    expect(model.definedUnits).to.equal('flops');
  });

  it('should handle no defined units', () => {
    const model = new Test(noUnits);

    expect(model.definedUnits).to.equal(null);
  });

  it('should make defined units should take precedence', () => {
    const model = new Test(withBothUnits);

    expect(model.units).to.equal('boops');
  });

  it('should get derived type units', () => {
    const model = new Test(withTypeDefUnits);

    expect(model.units).to.equal('floops');
  });

  it('should get defined units', () => {
    const model = new Test(withLeafUnits);

    expect(model.units).to.equal('flops');
  });

  it('should get no units', () => {
    const model = new Test(noUnits);

    expect(model.units).to.equal(null);
  });
});
