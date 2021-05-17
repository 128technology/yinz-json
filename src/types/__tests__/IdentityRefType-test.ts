import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import Identities from '../../model/Identities';
import { IdentityRefType } from '../';

describe('IdentityRef Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'identityref',
      children: [
        {
          keyword: 'base',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'action-type'
        }
      ]
    },
    null
  );
  const typeWithPrefixEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'identityref',
      children: [
        {
          keyword: 'base',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 't128-access:capability-type'
        }
      ]
    },
    null
  );
  const mockIdentitiesEl = new YinElement(
    {
      keyword: 'mock',
      namespace: 'mock',
      children: [
        {
          keyword: 'identity',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          nsmap: {
            rp: 'http://128technology.com/t128/config/routing-policy-config'
          },
          name: 'modify-metric',
          'module-prefix': 'rp',
          'module-name': 'routing-policy-config',
          children: [
            {
              keyword: 'base',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'action-type'
            },
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'An action which sets the metric'
            }
          ]
        },
        {
          keyword: 'identity',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          nsmap: {
            rt: 'http://128technology.com/t128/config/routing-config'
          },
          name: 'bgp',
          'module-prefix': 'rt',
          'module-name': 'routing-config',
          children: [
            {
              keyword: 'base',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'rt:routing-protocol'
            },
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'BGP routing protocol'
            }
          ]
        },
        {
          keyword: 'identity',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          nsmap: {
            't128-access': 'http://128technology.com/t128/access-control'
          },
          name: 'config-read',
          'module-prefix': 't128-access',
          'module-name': 't128-access-control',
          children: [
            {
              keyword: 'base',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              name: 'capability-type'
            },
            {
              keyword: 'description',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              text: 'Configuration Read Capability'
            }
          ]
        }
      ]
    },
    null
  );
  const emptyIdentities = new Identities();
  const mockIdentities = new Identities(mockIdentitiesEl);

  it('should match a identityref type', () => {
    const name = typeEl.name!;

    expect(IdentityRefType.matches(name)).to.equal(true);
  });

  it('should fail to parse if base is not specified', () => {
    const badTypeEl = new YinElement(
      {
        keyword: 'type',
        namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
        name: 'identityref'
      },
      null
    );

    expect(() => new IdentityRefType(badTypeEl, emptyIdentities)).to.throw('identityref type must specify base.');
  });

  it('should parse', () => {
    const type = new IdentityRefType(typeEl, emptyIdentities);

    expect(type.type).to.equal('identityref');
  });

  it('should get options from identities', () => {
    const type = new IdentityRefType(typeEl, mockIdentities);

    expect(type.options).to.deep.equal(['rp:modify-metric']);
  });

  it('should get options from identities with type containing prefix', () => {
    const type = new IdentityRefType(typeWithPrefixEl, mockIdentities);

    expect(type.options).to.deep.equal(['t128-access:config-read']);
  });

  it('should get options if identity does not exist', () => {
    const type = new IdentityRefType(typeEl, emptyIdentities);

    expect(type.options).to.deep.equal([]);
  });

  it('should get options if identity does not exist and type has prefix', () => {
    const type = new IdentityRefType(typeWithPrefixEl, emptyIdentities);

    expect(type.options).to.deep.equal([]);
  });

  it('should serialize', () => {
    const type = new IdentityRefType(typeEl, emptyIdentities);

    expect(type.serialize('foo')).to.equal('foo');
  });
});
