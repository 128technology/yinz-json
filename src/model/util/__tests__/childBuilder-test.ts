import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

import { buildChildren } from '../childBuilder';
import { Container, Leaf, List, LeafList } from '../../';
import YinElement from '../../../util/YinElement';

describe('Child Builder', () => {
  const modelText = fs.readFileSync(path.join(__dirname, './data/testElement.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);
  const { children } = buildChildren(model, {} as Leaf);

  it('builds an entry for each child', () => {
    expect([...children.keys()]).to.deep.equal([
      'id',
      'name',
      'location',
      'location-coordinates',
      'description',
      'router-group',
      'conductor-address',
      'maintenance-mode',
      'inter-node-security',
      'reverse-flow-enforcement',
      'administrative-group',
      'resource-group',
      'bfd',
      'udp-transform',
      'path-mtu-discovery',
      'max-inter-node-way-points',
      'peer',
      'entitlement',
      'application-identification',
      'dhcp-server-generated-address-pool',
      'dns-config',
      'nat-pool',
      'rate-limit-policy',
      'district-settings',
      'static-hostname-mapping',
      'system',
      'node',
      'redundancy-group',
      'routing',
      'management-service-generation',
      'reachability-profile',
      'icmp-probe-profile',
      'service-route',
      'service-route-policy'
    ]);
  });

  it('should build leaf children', () => {
    const expected = [
      'id',
      'name',
      'location',
      'location-coordinates',
      'description',
      'maintenance-mode',
      'inter-node-security',
      'reverse-flow-enforcement',
      'max-inter-node-way-points',
      'dhcp-server-generated-address-pool'
    ];

    const actual = Array.from(children.values())
      .filter(m => m instanceof Leaf)
      .map(m => m.name);
    expect(actual).to.deep.equal(expected);
  });

  it('should build container children', () => {
    const expected = [
      'bfd',
      'udp-transform',
      'path-mtu-discovery',
      'entitlement',
      'application-identification',
      'static-hostname-mapping',
      'system',
      'management-service-generation'
    ];

    const actual = Array.from(children.values())
      .filter(m => m instanceof Container)
      .map(m => m.name);
    expect(actual).to.deep.equal(expected);
  });

  it('should build leaf-list children', () => {
    const expected = ['router-group', 'conductor-address', 'administrative-group', 'resource-group'];

    const actual = Array.from(children.values())
      .filter(m => m instanceof LeafList)
      .map(m => m.name);
    expect(actual).to.deep.equal(expected);
  });

  it('should build list children', () => {
    const expected = [
      'peer',
      'dns-config',
      'nat-pool',
      'rate-limit-policy',
      'district-settings',
      'node',
      'redundancy-group',
      'routing',
      'reachability-profile',
      'icmp-probe-profile',
      'service-route',
      'service-route-policy'
    ];

    const actual = Array.from(children.values())
      .filter(m => m instanceof List)
      .map(m => m.name);
    expect(actual).to.deep.equal(expected);
  });
});
