import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { DecimalType } from '../';

describe('Decimal Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'decimal64',
      children: [
        {
          keyword: 'fraction-digits',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: '3'
        }
      ]
    },
    null
  );

  it('should match a decimal type', () => {
    const name = typeEl.name!;

    expect(DecimalType.matches(name)).to.equal(true);
  });

  it('should throw on parse if no fraction-digits', () => {
    const badTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'decimal64'
      },
      null
    );
    expect(() => new DecimalType(badTypeEl)).to.throw('decimal64 type must specify fraction-digits.');
  });

  it('should parse', () => {
    const type = new DecimalType(typeEl);

    expect(type.type).to.equal('decimal64');
  });

  it('should serialize to decimal', () => {
    const type = new DecimalType(typeEl);

    expect(type.serialize('5.123')).to.equal(5.123);
  });
});
