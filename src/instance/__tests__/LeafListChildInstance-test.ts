import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { LeafList, Container } from '../../model';

import { LeafListChildInstance, LeafListInstance } from '../';

describe('Leaf List Child Instance', () => {
  function buildLeafList(modelPath: string) {
    const modelText = fs.readFileSync(path.join(__dirname, modelPath), 'utf-8');
    const model = new YinElement(JSON.parse(modelText), null);
    return new LeafList(model, {} as Container);
  }
  const leafListModel = buildLeafList('../../model/__tests__/data/testLeafList.json');
  const numericLeafListModel = buildLeafList('../../model/__tests__/data/testNumericLeafList.json');

  const mockConfig = 'foo';

  it('should get initialized with a value', () => {
    const instance = new LeafListChildInstance(leafListModel, mockConfig, {} as LeafListInstance);

    expect(instance.value).to.equal('foo');
  });

  it('should get a value with the converted type', () => {
    const mockNumericConfig = '5';
    const instance = new LeafListChildInstance(numericLeafListModel, mockNumericConfig, {} as LeafListInstance);

    expect(instance.value).to.equal(5);
  });
});
