import { expect } from 'chai';

import Identities from '../../../model/Identities';
import TypeParser from '../TypeParser';
import { StringType } from '../../';
import YinElement from '../../../util/YinElement';

describe('Type Parser', () => {
  it('should parse and construct a new type', () => {
    const type = TypeParser.parse(
      new YinElement(
        {
          keyword: 'type',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'string',
          children: [
            {
              keyword: 'pattern',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: '*'
            },
            {
              keyword: 'length',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: '0..253'
            }
          ]
        },
        null
      ),
      new Identities()
    );

    expect(type).to.be.an.instanceof(StringType);
  });
});
