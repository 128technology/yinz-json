import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { EmptyType } from '../';

describe('Empty Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'empty'
    },
    null
  );

  it('should match a empty type', () => {
    const name = typeEl.name!;

    expect(EmptyType.matches(name)).to.equal(true);
  });

  it('should parse', () => {
    const type = new EmptyType(typeEl);

    expect(type.type).to.equal('empty');
  });

  it('should serialize', () => {
    const type = new EmptyType(typeEl);

    expect(type.serialize('')).to.equal('');
  });
});
