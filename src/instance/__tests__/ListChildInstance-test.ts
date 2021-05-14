import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { List, Container } from '../../model';
import { ListChildInstance, LeafInstance, ListInstance } from '../';
import { allow } from '../util';

describe('List Child Instance', () => {
  const modelText = fs.readFileSync(path.join(__dirname, '../../model/__tests__/data/testList.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);
  const listModel = new List(model, {} as Container);

  const mockConfig = { name: 'foo' };

  it('should get initialized with a value', () => {
    const instance = new ListChildInstance(listModel, mockConfig, {} as any, {} as ListInstance);

    const child = instance.getChildren(allow).get('name');

    if (child instanceof LeafInstance) {
      expect(child.getValue(allow)).to.equal('foo');
    } else {
      throw new Error('Child is not a leaf!');
    }
  });

  it('should consider a case active if it sees a child from it', () => {
    const modelWithChoiceText = fs.readFileSync(
      path.join(__dirname, '../../model/__tests__/data/testListWithChoice.json'),
      'utf-8'
    );
    const modelWithChoice = new YinElement(JSON.parse(modelWithChoiceText), null);
    const listModelWithChoice = new List(modelWithChoice, {} as Container);

    const choiceConfig = { name: 'baz', peer: 'per1' };

    const instance = new ListChildInstance(listModelWithChoice, choiceConfig, {} as any, {} as ListInstance);

    const activeChoice = instance.activeChoices.get('type');

    expect(activeChoice).to.equal('peer-service-route');
  });

  it('should serialize to JSON', () => {
    const instance = new ListChildInstance(listModel, mockConfig, {} as any, {} as ListInstance);

    expect(instance.toJSON(allow)).to.deep.equal({ name: 'foo' });
  });

  it('should get keys', () => {
    const instance = new ListChildInstance(listModel, mockConfig, {} as any, {} as ListInstance);

    expect(instance.keys).to.deep.equal({ name: 'foo' });
  });

  it('should delete a child that exists', () => {
    const instance = new ListChildInstance(
      listModel,
      { name: 'foo', 'service-filter': 'foo' },
      {} as any,
      {} as ListInstance
    );
    instance.delete('service-filter');
    expect(instance.toJSON(allow)).to.deep.equal({ name: 'foo' });
  });

  it('should throw if child does not exist', () => {
    const instance = new ListChildInstance(listModel, mockConfig, {} as any, {} as ListInstance);
    expect(() => instance.delete('foo')).to.throw();
  });

  it('should throw if key', () => {
    const instance = new ListChildInstance(listModel, mockConfig, {} as any, {} as ListInstance);
    expect(() => instance.delete('name')).to.throw();
  });
});
