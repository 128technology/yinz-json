import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { Container } from '../../model';
import { ContainerInstance, LeafInstance } from '../';
import { allow } from '../util';

describe('Container Instance', () => {
  const modelText = fs.readFileSync(path.join(__dirname, '../../model/__tests__/data/testContainer.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);
  const containerModel = new Container(model);

  const mockConfig = { state: 'enabled' };

  it('should get initialized with a value', () => {
    const instance = new ContainerInstance(containerModel, mockConfig, null);

    const child = instance.getChildren(allow).get('state');
    if (child instanceof LeafInstance) {
      expect(child.getValue(allow)).to.equal('enabled');
    } else {
      throw new Error('Child is not a leaf!');
    }
  });

  it('should serialize to JSON', () => {
    const instance = new ContainerInstance(containerModel, mockConfig, null);

    expect(instance.toJSON(allow)).to.deep.equal({
      bfd: {
        state: 'enabled'
      }
    });
  });

  it('should delete a child that exists', () => {
    const instance = new ContainerInstance(containerModel, mockConfig, null);
    instance.delete('state');
    expect(instance.toJSON(allow)).to.deep.equal({
      bfd: {}
    });
  });

  it('should throw if child does not exist', () => {
    const instance = new ContainerInstance(containerModel, mockConfig, null);
    expect(() => instance.delete('foo')).to.throw();
  });
});
