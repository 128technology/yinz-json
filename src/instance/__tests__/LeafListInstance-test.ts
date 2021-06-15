import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import YinElement from '../../util/YinElement';
import { LeafList, Container } from '../../model';
import { LeafListInstance, ContainerInstance } from '../';
import { allow } from '../util';

describe('Leaf List Instance', () => {
  const modelText = fs.readFileSync(path.join(__dirname, '../../model/__tests__/data/testLeafList.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);
  const leafListModel = new LeafList(model, {} as Container);

  const mockConfig = ['foo'];

  it('should get initialized with a value', () => {
    const instance = new LeafListInstance(leafListModel, mockConfig, {} as ContainerInstance);

    expect(instance.getValues(allow)).to.deep.equal(['foo']);
  });

  it('should accept new values after initialization', () => {
    const instance = new LeafListInstance(leafListModel, mockConfig, {} as ContainerInstance);

    const newItem = 'bar';

    instance.add(newItem);

    expect(instance.getValues(allow)).to.deep.equal(['foo', 'bar']);
  });

  it('should be able to delete', () => {
    const instance = new LeafListInstance(leafListModel, mockConfig, {} as ContainerInstance);

    const newItem = 'bar';

    instance.add(newItem);
    instance.delete(allow, 'foo');

    expect(instance.toJSON(allow).vector).to.deep.equal(['bar']);
  });

  it('should be able to filter', () => {
    const instance = new LeafListInstance(leafListModel, ['foo', 'baz', 'bar'], {} as ContainerInstance);

    instance.filter(allow, c => c.getRawValue(allow)?.includes('ba')!);

    expect(instance.toJSON(allow).vector).to.deep.equal(['baz', 'bar']);
  });

  it('should serialize to JSON', () => {
    const instance = new LeafListInstance(leafListModel, mockConfig, {} as ContainerInstance);

    expect(instance.toJSON(allow)).to.deep.equal({
      vector: ['foo']
    });
  });
});
