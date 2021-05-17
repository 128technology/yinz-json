import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { UnionType } from '../';
import { Identities } from '../../model';

describe('Union Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'union',
      children: [
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'string'
        },
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'boolean'
        }
      ]
    },
    null
  );

  it('should match a union type', () => {
    const name = typeEl.name!;

    expect(UnionType.matches(name)).to.equal(true);
  });

  it('should fail to parse if no subtypes specified', () => {
    const badTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'union'
      },
      null
    );

    expect(() => new UnionType(badTypeEl, {} as Identities)).to.throw();
  });

  it('should parse', () => {
    const type = new UnionType(typeEl, {} as Identities);

    expect(type.type).to.equal('union');
  });

  it('should serialize to a string', () => {
    const type = new UnionType(typeEl, {} as Identities);

    expect(type.serialize('foo')).to.equal('foo');
  });

  it('should allow visiting nested types', () => {
    const nestedTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'union',
        children: [
          {
            keyword: 'type',
            namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
            name: 'string'
          },
          {
            keyword: 'type',
            namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
            name: 'union',
            children: [
              {
                keyword: 'type',
                namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                name: 'boolean'
              },
              {
                keyword: 'type',
                namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                name: 'uint32'
              }
            ]
          }
        ]
      },
      null
    );

    const type = new UnionType(nestedTypeEl, {} as Identities);

    let count = 0;
    type.traverse(() => count++);
    expect(count).to.equal(5);
  });
});
