import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { Leaf, Container } from '../../model';
import { LeafInstance, ContainerInstance } from '../';
import { allow } from '../util';

describe('Leaf Instance', () => {
  const modelText = fs.readFileSync(path.join(__dirname, '../../model/__tests__/data/testLeaf.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);
  const leafModel = new Leaf(model, {} as Container);

  const mockConfig = '5';

  it('should get initialized with a value', () => {
    const instance = new LeafInstance(leafModel, mockConfig, {} as ContainerInstance);

    expect(instance.getValue(allow)).to.equal('5');
  });

  it('should get a value with the converted type', () => {
    const instance = new LeafInstance(leafModel, mockConfig, {} as ContainerInstance);

    expect(instance.getConvertedValue(allow)).to.equal(5);
  });

  it('should serialize to JSON', () => {
    const instance = new LeafInstance(leafModel, mockConfig, {} as ContainerInstance);

    expect(instance.toJSON(allow)).to.deep.equal({
      'qp-value': 5
    });
  });

  it('should serialize to JSON without converting type', () => {
    const instance = new LeafInstance(leafModel, mockConfig, {} as ContainerInstance);

    expect(instance.toJSON(allow, false, false)).to.deep.equal({
      'qp-value': '5'
    });
  });
});
