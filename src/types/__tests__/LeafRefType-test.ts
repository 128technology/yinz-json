import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { LeafRefType } from '../';
import { Identities } from '../../model';

describe('LeafRef Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'leafref',
      children: [
        {
          keyword: 'path',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: '/t128:config/authy:authority/authy:security/authy:name'
        },
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'int32'
        }
      ]
    },
    null
  );

  it('should match a leafref type', () => {
    const name = typeEl.name!;

    expect(LeafRefType.matches(name)).to.equal(true);
  });

  it('should fail to parse if no path', () => {
    const badTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'leafref'
      },
      null
    );

    expect(() => new LeafRefType(badTypeEl, {} as Identities)).to.throw('leafref');
  });

  it('should parse', () => {
    const type = new LeafRefType(typeEl, {} as Identities);

    expect(type.type).to.equal('leafref');
  });

  it('should serialize to the reference type', () => {
    const type = new LeafRefType(typeEl, {} as Identities);

    expect(type.serialize('5')).to.equal(5);
  });
});
