import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { InstanceIdentifierType } from '../';

describe('Instance Identifier Type', () => {
  const typeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'instance-identifier'
    },
    null
  );

  it('should match a instance-identifier type', () => {
    const name = typeEl.name!;

    expect(InstanceIdentifierType.matches(name)).to.equal(true);
  });

  it('should parse', () => {
    const type = new InstanceIdentifierType(typeEl);

    expect(type.type).to.equal('instance-identifier');
  });
});
