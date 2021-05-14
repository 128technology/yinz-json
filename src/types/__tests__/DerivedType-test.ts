import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { DerivedType, StringType, Range } from '../';
import { Identities } from '../../model';

describe('Derived Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 't128ext:name-id',
      children: [
        {
          keyword: 'typedef',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'name-id',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'A string identifier.'
            },
            {
              keyword: 'default',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: 'foo'
            },
            {
              keyword: 'units',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'flips'
            },
            {
              keyword: 'type',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'string',
              children: [
                {
                  keyword: 'pattern',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  value: '([a-zA-Z0-9]([a-zA-Z0-9\\-_]){0,61})?[a-zA-Z0-9]',
                  children: [
                    {
                      keyword: 'error-message',
                      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                      value: 'Must contain only alphanumeric characters or any of the following: _ -'
                    }
                  ]
                },
                {
                  keyword: 'length',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  value: '0..63'
                }
              ]
            }
          ]
        }
      ]
    },
    null
  );

  const nestedDerivedType = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 't128ext:name-id',
      children: [
        {
          keyword: 'typedef',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'name-id',
          children: [
            {
              keyword: 'type',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'foo:bar',
              children: [
                {
                  keyword: 'typedef',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  name: 'bar',
                  children: [
                    {
                      keyword: 'type',
                      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                      name: 'string'
                    },
                    {
                      keyword: 'default',
                      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                      value: 'baz'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    null
  );

  const nestedDerivedTypeMultipleDefault = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 't128ext:name-id',
      children: [
        {
          keyword: 'typedef',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'name-id',
          children: [
            {
              keyword: 'default',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: 'kittens'
            },
            {
              keyword: 'type',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'foo:bar',
              children: [
                {
                  keyword: 'typedef',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  name: 'bar',
                  children: [
                    {
                      keyword: 'type',
                      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                      name: 'string'
                    },
                    {
                      keyword: 'default',
                      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                      value: 'baz'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    null
  );

  const intDerivedType = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 't128ext:security-identifier',
      children: [
        {
          keyword: 'typedef',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'security-identifier',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'A unique identifier for security keys.'
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

  const restrictedTypeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 't128ext:hex-string',
      children: [
        {
          keyword: 'length',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: '8 | 16 | 20 | 32 | 64'
        },
        {
          keyword: 'typedef',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'hex-string',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'A hexadecimal string with octets represented as hex digits.'
            },
            {
              keyword: 'type',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'string',
              children: [
                {
                  keyword: 'pattern',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  value: '[0-9a-fA-F]{2}([0-9a-fA-F]{2})*'
                }
              ]
            }
          ]
        }
      ]
    },
    null
  );

  const extendedTypeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'some-extended-type',
      children: [
        {
          keyword: 'typedef',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'some-extended-type',
          children: [
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'This field allows a free-form string or a security name'
            },
            {
              keyword: 'type',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'string',
              children: [
                {
                  keyword: 'pattern',
                  namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
                  value: '[0-9a-fA-F]{2}([0-9a-fA-F]{2})*'
                }
              ]
            },
            {
              keyword: 'suggestionref',
              namespace: 'http://128technology.com/t128-extensions',
              nsmap: {
                t128ext: 'http://128technology.com/t128-extensions'
              },
              text: '/t128:config/authy:authority/svc:security/svc:name'
            }
          ]
        }
      ]
    },
    null
  );

  it('should match a derived type', () => {
    const name = typeEl.name!;

    expect(DerivedType.matches(name)).to.equal(true);
  });

  it('should not match a built-in type', () => {
    expect(DerivedType.matches('enumeration')).to.equal(false);
  });

  it('should parse', () => {
    const type = new DerivedType(typeEl, {} as Identities);

    expect(type.type).to.equal('t128ext:name-id');
  });

  it('should parse description', () => {
    const type = new DerivedType(typeEl, {} as Identities);

    expect(type.description).to.equal('A string identifier.');
  });

  it('should parse no description', () => {
    const type = new DerivedType(nestedDerivedTypeMultipleDefault, {} as Identities);

    expect(type.description).to.equal(undefined);
  });

  it('should parse default', () => {
    const type = new DerivedType(typeEl, {} as Identities);

    expect(type.default).to.equal('foo');
  });

  it('should parse no default', () => {
    const type = new DerivedType(intDerivedType, {} as Identities);

    expect(type.default).to.equal(undefined);
  });

  it('should parse a nested default', () => {
    const type = new DerivedType(nestedDerivedType, {} as Identities);

    expect(type.default).to.equal('baz');
  });

  it('should parse a nested built in type', () => {
    const type = new DerivedType(nestedDerivedType, {} as Identities);

    expect(type.builtInType.type).to.equal('string');
  });

  it('should make the outer most default win', () => {
    const type = new DerivedType(nestedDerivedTypeMultipleDefault, {} as Identities);

    expect(type.default).to.equal('kittens');
  });

  it('should parse units', () => {
    const type = new DerivedType(typeEl, {} as Identities);

    expect(type.units).to.equal('flips');
  });

  it('should contain a child type', () => {
    const type = new DerivedType(restrictedTypeEl, {} as Identities);

    expect(type.baseType).to.be.an.instanceof(StringType);
  });

  it('should propagate restrictions to the child', () => {
    const type = new DerivedType(restrictedTypeEl, {} as Identities);

    expect((type.baseType as StringType).length).to.be.an.instanceof(Range);
  });

  it('should serialize as the base type', () => {
    const type = new DerivedType(intDerivedType, {} as Identities);

    expect(type.serialize('5')).to.equal(5);
  });

  it('should parse suggestion reference', () => {
    const type = new DerivedType(extendedTypeEl, {} as Identities);

    expect(type.suggestionRefs).to.deep.equal(['/t128:config/authy:authority/svc:security/svc:name']);
  });
});
