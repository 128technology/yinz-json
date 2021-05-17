import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { BooleanType } from '../';

describe('Boolean Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'boolean'
    },
    null
  );

  it('should match a boolean type', () => {
    const name = typeEl.name!;

    expect(BooleanType.matches(name)).to.equal(true);
  });

  it('should parse', () => {
    const type = new BooleanType(typeEl);

    expect(type.type).to.equal('boolean');
  });

  it('should serialize true to a boolean', () => {
    const type = new BooleanType(typeEl);

    expect(type.serialize('true')).to.equal(true);
  });

  it('should serialize false to a boolean', () => {
    const type = new BooleanType(typeEl);

    expect(type.serialize('false')).to.equal(false);
  });
});
