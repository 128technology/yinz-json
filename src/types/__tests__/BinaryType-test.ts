import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { BinaryType, Range } from '../';

describe('Binary Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'binary',
      children: [
        {
          keyword: 'length',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: '0..63'
        }
      ]
    },
    null
  );

  it('should match a binary type', () => {
    const name = typeEl.name!;

    expect(BinaryType.matches(name)).to.equal(true);
  });

  it('should parse', () => {
    const type = new BinaryType(typeEl);

    expect(type.type).to.equal('binary');
  });

  it('should parse length', () => {
    const type = new BinaryType(typeEl);

    expect(type.length).to.be.an.instanceof(Range);
  });

  it('should serialize to a string', () => {
    const type = new BinaryType(typeEl);

    // Zm9v is 'foo' base64 encoded
    expect(type.serialize('Zm9v')).to.equal('Zm9v');
  });
});
