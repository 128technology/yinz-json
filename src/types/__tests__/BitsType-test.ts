import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { BitsType } from '../';

describe('Bits Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'bits',
      children: [
        {
          keyword: 'bit',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          text: 'foo'
        }
      ]
    },
    null
  );

  it('should match a bits type', () => {
    const name = typeEl.name!;

    expect(BitsType.matches(name)).to.equal(true);
  });

  it('should fail to parse if bit is not present', () => {
    const badTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'bits'
      },
      null
    );

    expect(() => new BitsType(badTypeEl)).to.throw('bits type must specify bit.');
  });

  it('should parse', () => {
    const type = new BitsType(typeEl);

    expect(type.type).to.equal('bits');
  });

  it('should serialize to a string', () => {
    const type = new BitsType(typeEl);

    expect(type.serialize('carrots peas')).to.equal('carrots peas');
  });
});
