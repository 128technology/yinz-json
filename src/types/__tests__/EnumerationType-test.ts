import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import EnumerationMemberType from '../EnumerationMemberType';
import { EnumerationType } from '../';

describe('Enumeration Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'enumeration',
      children: [
        {
          keyword: 'enum',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'foo',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a foo description.'
            },
            {
              keyword: 'value',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: '0'
            },
            {
              keyword: 'reference',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a foo reference.'
            },
            {
              keyword: 'status',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: 'deprecated'
            }
          ]
        },
        {
          keyword: 'enum',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'bar',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a bar description.'
            },
            {
              keyword: 'value',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: '1'
            },
            {
              keyword: 'reference',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a bar reference.'
            }
          ]
        }
      ]
    },
    null
  );

  const obsoleteTypeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'enumeration',
      children: [
        {
          keyword: 'enum',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'foo',
          children: [
            {
              keyword: 'status',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: 'obsolete'
            }
          ]
        },
        {
          keyword: 'enum',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'bar'
        }
      ]
    },
    null
  );

  it('should match a enumeration type', () => {
    const name = typeEl.name!;

    expect(EnumerationType.matches(name)).to.equal(true);
  });

  it('should fail to parse if enums not present', () => {
    const badTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'enumeration'
      },
      null
    );

    expect(() => new EnumerationType(badTypeEl)).to.throw('enumeration type must specify enum.');
  });

  it('should parse', () => {
    const type = new EnumerationType(typeEl);

    expect(type.type).to.equal('enumeration');
  });

  it('should parse members', () => {
    const type = new EnumerationType(typeEl);
    const fooMember = new EnumerationMemberType(
      new YinElement(
        {
          keyword: 'enum',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'foo',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a foo description.'
            },
            {
              keyword: 'value',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: '0'
            },
            {
              keyword: 'reference',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a foo reference.'
            },
            {
              keyword: 'status',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: 'deprecated'
            }
          ]
        },
        null
      )
    );

    const barMember = new EnumerationMemberType(
      new YinElement(
        {
          keyword: 'enum',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'bar',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a bar description.'
            },
            {
              keyword: 'value',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: '1'
            },
            {
              keyword: 'reference',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This is a bar reference.'
            }
          ]
        },
        null
      )
    );

    expect(type.members).to.deep.equal(
      new Map([
        ['foo', fooMember],
        ['bar', barMember]
      ])
    );
  });

  it('should parse member options', () => {
    const type = new EnumerationType(typeEl);

    expect(type.options).to.deep.equal(['foo', 'bar']);
  });

  it('should filter out obsolete options', () => {
    const type = new EnumerationType(obsoleteTypeEl);

    expect(type.options).to.deep.equal(['bar']);
  });

  it('should serialize', () => {
    const type = new EnumerationType(typeEl);

    expect(type.serialize('foo')).to.equal('foo');
  });
});
