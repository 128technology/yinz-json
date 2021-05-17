import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { EnumerationMemberType } from '../';
import { Status } from '../../enum';

describe('Enumeration Member Type', () => {
  const typeEl = new YinElement(
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
          text: 'RFC1997'
        },
        {
          keyword: 'status',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          value: 'deprecated'
        }
      ]
    },
    null
  );

  const typeElEmpty = new YinElement(
    {
      keyword: 'enum',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: 'bar'
    },
    null
  );

  it('should parse', () => {
    const type = new EnumerationMemberType(typeEl);

    expect(type.description).to.equal('This is a foo description.');
    expect(type.value).to.equal(0);
    expect(type.reference).to.equal('RFC1997');
    expect(type.status).to.equal(Status.deprecated);
  });

  it('should default status to `current`', () => {
    const type = new EnumerationMemberType(typeElEmpty);

    expect(type.status).to.equal(Status.current);
  });

  it('should set missing fields to null', () => {
    const type = new EnumerationMemberType(typeElEmpty);

    expect(type.description).to.equal(null);
    expect(type.value).to.equal(null);
    expect(type.reference).to.equal(null);
  });
});
