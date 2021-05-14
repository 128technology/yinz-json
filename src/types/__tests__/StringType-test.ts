import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { StringType, Range } from '../';

describe('String Type', () => {
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
        },
        {
          keyword: 'foo',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          text: 'bar'
        },
        {
          keyword: 'moo',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          text: null
        }
      ]
    },
    null
  );

  it('should match a string type', () => {
    const name = typeEl.name!;

    expect(StringType.matches(name)).to.equal(true);
  });

  it('should parse', () => {
    const type = new StringType(typeEl);

    expect(type.type).to.equal('string');
  });

  it('should parse length', () => {
    const type = new StringType(typeEl);

    expect(type.length).to.be.an.instanceof(Range);
  });

  it('should parse pattern', () => {
    const type = new StringType(typeEl);

    expect(type.pattern).to.equal('*');
  });

  it('should serialize to a string', () => {
    const type = new StringType(typeEl);

    expect(type.serialize('foo')).to.equal('foo');
  });

  it('should parse text property', () => {
    const type = new StringType(typeEl);

    expect(type.otherProps.get('moo')).to.equal(true);
  });

  it('should parse presence property', () => {
    const type = new StringType(typeEl);

    expect(type.otherProps.get('foo')).to.equal('bar');
  });
});
