import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

import YinElement from '../../util/YinElement';
import { OrderedBy } from '../../enum';
import { LeafList, Container } from '../';
import { ContainerInstance } from '../../instance';

describe('Leaf List Model', () => {
  const modelText = fs.readFileSync(path.join(__dirname, './data/testLeafList.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);

  it('should get initalized', () => {
    const leafList = new LeafList(model, {} as Container);

    expect(leafList.name).to.equal('vector');
  });

  it('should build an instance of itself', () => {
    const leafList = new LeafList(model, {} as Container);

    const instance = leafList.buildInstance(['foo'], {} as ContainerInstance);
    expect(instance.model).to.equal(leafList);
  });

  it('should get max elements', () => {
    const leafList = new LeafList(model, {} as Container);

    expect(leafList.maxElements).to.equal(5);
  });

  it('should get min elements', () => {
    const leafList = new LeafList(model, {} as Container);

    expect(leafList.minElements).to.equal(2);
  });

  it('should get ordered by', () => {
    const leafList = new LeafList(model, {} as Container);

    expect(leafList.orderedBy).to.equal(OrderedBy.user);
  });

  it('should get units', () => {
    const leafList = new LeafList(model, {} as Container);

    expect(leafList.units).to.equal('kittens');
  });

  it('visits itself', () => {
    const spy = sinon.spy();
    const leafList = new LeafList(model, {} as Container);
    leafList.visit(spy);

    expect(spy.firstCall.args[0]).to.equal(leafList);
  });

  it('should parse derived types', () => {
    const testJSON = fs.readFileSync(path.join(__dirname, './data/testLeafListDerivedType.json'), 'utf-8');
    const testModel = new YinElement(JSON.parse(testJSON), null);
    const leafList = new LeafList(testModel, {} as Container);
    const expectedType = {
      baseType: {
        otherProps: new Map(),
        type: 'union',
        types: [
          { type: 'uint32', range: { ranges: [{ min: 1, max: 999999 }] }, otherProps: new Map() },
          {
            members: new Map([
              [
                'ordered',
                {
                  description: 'priority value determined by ordinal position'
                }
              ],
              [
                'never',
                {
                  description: 'paths with the vector are not used'
                }
              ]
            ]),
            type: 'enumeration',
            otherProps: new Map()
          }
        ]
      },
      default: 'ordered',
      description: 'A type for defining priorities for vector use.',
      type: 'vector-priority'
    };

    expect(leafList.type).to.deep.equal(expectedType);
    expect(leafList.getResolvedType()).to.deep.equal(expectedType.baseType);
  });
});
