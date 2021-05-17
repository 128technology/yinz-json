import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

import YinElement from '../../util/YinElement';
import { Leaf, List, Container } from '../';
import { UnionType, DerivedType } from '../../types';

describe('Leaf Model', () => {
  const modelText = fs.readFileSync(path.join(__dirname, './data/testLeaf.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);

  const mandatoryModelText = fs.readFileSync(path.join(__dirname, './data/testMandatoryLeaf.json'), 'utf-8');
  const mandatoryModel = new YinElement(JSON.parse(mandatoryModelText), null);

  const defaultedModelText = fs.readFileSync(path.join(__dirname, './data/testDefaultTypeLeaf.json'), 'utf-8');
  const defaultedModel = new YinElement(JSON.parse(defaultedModelText), null);

  function getList() {
    return new List(
      new YinElement(
        {
          keyword: 'list',
          namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
          name: 'bar',
          'module-prefix': 'test',
          nsmap: { test: 'http://foo.bar' },
          children: [
            {
              keyword: 'key',
              namespace: 'urn:ietf:params:xml:ns:yang:yin:1',
              value: 'foo'
            }
          ]
        },
        null
      ),
      {} as Container
    );
  }

  it('should get initalized', () => {
    const leaf = new Leaf(model, {} as Container);

    expect(leaf.name).to.equal('qp-value');
  });

  it('should build an instance of itself', () => {
    const leaf = new Leaf(model, {} as Container);

    const instance = leaf.buildInstance('1', {} as any);
    expect(instance.model).to.equal(leaf);
  });

  it('should determine if it is a key', () => {
    const list = getList();
    list.keys = new Set(['qp-value']);
    const leaf = new Leaf(model, list);

    expect(leaf.isKey).to.equal(true);
  });

  it('should determine if it is not a key', () => {
    const list = getList();
    list.keys = new Set(['yarghhh']);
    const leaf = new Leaf(model, list);

    expect(leaf.isKey).to.equal(false);
  });

  it('should be required if it is a key', () => {
    const list = getList();
    list.keys = new Set(['qp-value']);
    const leaf = new Leaf(model, list);

    expect(leaf.required).to.equal(true);
  });

  it('should be required if it is mandatory', () => {
    const leaf = new Leaf(mandatoryModel, {} as Container);

    expect(leaf.required).to.equal(true);
  });

  it('should not be required if it is not mandatory or a key', () => {
    const leaf = new Leaf(model, {} as Container);

    expect(leaf.required).to.equal(false);
  });

  it('should have a default value', () => {
    const leaf = new Leaf(model, {} as Container);

    expect(leaf.default).to.equal('0');
  });

  it('should have units', () => {
    const leaf = new Leaf(model, {} as Container);

    expect(leaf.units).to.equal('points');
  });

  it('should have a default value from a derived type', () => {
    const leaf = new Leaf(defaultedModel, {} as Container);

    expect(leaf.default).to.equal('moocow');
  });

  it('should have an undefined default when none set', () => {
    const leaf = new Leaf(mandatoryModel, {} as Container);

    expect(leaf.default).to.equal(undefined);
  });

  it('visits itself', () => {
    const spy = sinon.spy();
    const leaf = new Leaf(model, {} as Container);
    leaf.visit(spy);

    expect(spy.firstCall.args[0]).to.equal(leaf);
  });

  describe('type traversal', () => {
    let count: number;

    beforeEach(() => {
      count = 0;
    });

    it('should parse union types', () => {
      const testJSON = fs.readFileSync(path.join(__dirname, './data/testLeafUnionType.json'), 'utf-8');
      const testModel = new YinElement(JSON.parse(testJSON), null);
      const leaf = new Leaf(testModel, {} as Container);
      expect(leaf.name).to.equal('rekey-interval');
      const expectedType = {
        type: 'union',
        otherProps: new Map(),
        types: [
          { type: 'uint32', range: { ranges: [{ min: 1, max: 720 }] }, otherProps: new Map() },
          {
            members: new Map([
              [
                'never',
                {
                  description: 'Never regenerate security keys'
                }
              ]
            ]),
            type: 'enumeration',
            otherProps: new Map()
          }
        ]
      };
      expect(leaf.type).to.deep.equal(expectedType);

      const unionType = leaf.type as UnionType;
      unionType.traverse(() => count++);
      expect(count).to.equal(3); // union, uint32, and enumeration
    });

    it('should parse derived types', () => {
      const testJSON = fs.readFileSync(path.join(__dirname, './data/testLeafDerivedType.json'), 'utf-8');
      const testModel = new YinElement(JSON.parse(testJSON), null);
      const leaf = new Leaf(testModel, {} as Container);
      expect(leaf.name).to.equal('priority');
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

      expect(leaf.type).to.deep.equal(expectedType);
      expect(leaf.getResolvedType()).to.deep.equal(expectedType.baseType);

      const unionType = leaf.type as DerivedType;
      unionType.traverse(() => count++);
      expect(count).to.equal(4);
    });

    it('should parse extension types', () => {
      const testJSON = fs.readFileSync(path.join(__dirname, './data/testLeafExtensionType.json'), 'utf-8');
      const testModel = new YinElement(JSON.parse(testJSON), null);
      const leaf = new Leaf(testModel, {} as Container);
      expect(leaf.name).to.equal('neighborhood');
      const expectedType = {
        baseType: {
          length: {
            ranges: [{ min: 0, max: 63 }]
          },
          otherProps: new Map(),
          pattern: '([a-zA-Z0-9]([a-zA-Z0-9\\-_]){0,61})?[a-zA-Z0-9]',
          type: 'string'
        },
        description: 'A string identifier for network neighborhood.',
        suggestionRefs: ['/t128:config/authy:authority/authy:security/authy:name'],
        type: 't128ext:neighborhood-id'
      };

      expect(leaf.type).to.deep.equal(expectedType);

      const unionType = leaf.type as DerivedType;
      unionType.traverse(() => count++);
      expect(count).to.equal(2);
    });
  });
});
