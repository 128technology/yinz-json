import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { Identities } from '../';

describe('Identities', () => {
  const idenText = fs.readFileSync(path.join(__dirname, './data/testIdentities.json'), 'utf-8');
  const idenEl = new YinElement(JSON.parse(idenText), null);

  it('should parse all bases', () => {
    const identities = new Identities(idenEl);

    expect(identities.identities.size).to.equal(10);
  });

  it('should parse all extensions to a base', () => {
    const identities = new Identities(idenEl);

    expect(identities.identities.get('action-type')!.length).to.equal(15);
  });

  it('should get options for a given base', () => {
    const identities = new Identities(idenEl);

    expect(identities.getOptions('action-type')).to.deep.equal([
      'rp:set-aggregator',
      'rp:modify-as-path',
      'rp:set-atomic-aggregate',
      'rp:set-community',
      'rp:remove-community',
      'rp:set-extended-community',
      'rp:set-next-hop',
      'rp:set-local-preference',
      'rp:modify-metric',
      'rp:set-originator-id',
      'rp:set-origin',
      'rp:set-tag',
      'rp:set-bgp-weight',
      'rp:continue',
      'rp:call'
    ]);
  });

  it('should get options for a given base that was prefixed in the model', () => {
    const identities = new Identities(idenEl);

    expect(identities.getOptions('routing-protocol')).to.deep.equal(['rt:bgp']);
  });
});
