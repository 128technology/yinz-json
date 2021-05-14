import { expect } from 'chai';

import YinElement from '../../util/YinElement';
import { IntegerType } from '../';

const TYPES = ['int8', 'int16', 'int32', 'int64', 'uint8', 'uint16', 'uint32', 'uint64'];

describe('Integer Type', () => {
  TYPES.forEach(type => {
    it(`should match ${type} type`, () => {
      const typeEl = new YinElement(
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: type
        },
        null
      );
      const name = typeEl.name!;

      expect(IntegerType.matches(name)).to.equal(true);
    });
  });
  const int32TypeEl = new YinElement(
    {
      keyword: 'type',
      namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
      name: TYPES[2]
    },
    null
  );

  it('should parse', () => {
    const type = new IntegerType(int32TypeEl);

    expect(type.type).to.equal('int32');
  });

  it('should serialize to an integer', () => {
    const type = new IntegerType(int32TypeEl);

    expect(type.serialize('50')).to.equal(50);
  });
});
