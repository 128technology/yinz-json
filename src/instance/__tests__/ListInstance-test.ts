import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { List } from '../../model';
import { ListInstance, ListChildInstance, ContainerInstance } from '../';
import { allow } from '../util';

describe('List Instance', () => {
  const modelText = fs.readFileSync(path.join(__dirname, '../../model/__tests__/data/testList.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);
  const listModel = new List(model, {} as any);

  const mockConfig = [{ name: 'foo' }];

  it('should get initialized with a child', () => {
    const instance = new ListInstance(listModel, mockConfig, {} as ContainerInstance);

    const child = [...instance.getChildren(allow).values()][0];

    expect(child).to.be.an.instanceOf(ListChildInstance);
  });

  it('should accept new values after initialization', () => {
    const instance = new ListInstance(listModel, mockConfig, {} as ContainerInstance);

    const newItem = { name: 'bar' };

    instance.add(newItem);

    const child = [...instance.getChildren(allow).values()][1];

    expect(child).to.be.an.instanceOf(ListChildInstance);
  });

  it('should be able to delete a child', () => {
    const instance = new ListInstance(listModel, mockConfig, {} as ContainerInstance);

    const newItem = { name: 'bar' };

    instance.add(newItem);
    instance.delete('foo');

    expect(instance.getChildren(allow).size).to.equal(1);
  });

  it('should serialize to JSON', () => {
    const instance = new ListInstance(listModel, mockConfig, {} as ContainerInstance);

    expect(instance.toJSON(allow)).to.deep.equal({
      peer: [{ name: 'foo' }]
    });
  });

  it('should serialize to JSON without skipped fields', () => {
    const instance = new ListInstance(listModel, mockConfig, {} as ContainerInstance);

    expect(instance.toJSON(allow, false, true, ins => ins instanceof ListChildInstance)).to.deep.equal({});
  });
});
