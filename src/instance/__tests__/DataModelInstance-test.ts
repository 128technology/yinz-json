import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import DataModel from '../../model';
import DataModelInstance, {
  ContainerInstance,
  LeafInstance,
  LeafListInstance,
  ListInstance,
  ListChildInstance
} from '../';
import { allow } from '../util';
import { IJSONModeEvaluators } from '../types';

export function readDataModel(filepath: string) {
  const modelText = fs.readFileSync(path.join(__dirname, filepath), 'utf-8');
  const modelElement = JSON.parse(modelText);

  return new DataModel({
    modelElement,
    getRoot: doc => doc.children!.find(x => x.name === 'config')!.children!.find(x => x.name === 'authority')!
  });
}

export const dataModel = readDataModel('../../model/__tests__/data/consolidatedT128Model.json');

describe('Data Model Instance', () => {
  function readJSON(filepath: string) {
    const instanceJSONText = fs.readFileSync(path.join(__dirname, filepath), 'utf-8');
    return JSON.parse(instanceJSONText);
  }

  function getInstance(instancePath: string) {
    const config = readJSON(instancePath);
    return new DataModelInstance(dataModel, config);
  }

  function getInstanceJsonOnlyMode(
    instancePath: string,
    evaluators: IJSONModeEvaluators = {
      evaluateWhenCondition: async () => false,
      evaluateLeafRef: async () => ['testLeafRef'],
      evaluateSuggestionRef: async () => ['testSuggestionRef'],
      resolveLeafRefPath: async () => [{ name: 'goo' }]
    }
  ) {
    const instanceRawJSON = readJSON(instancePath);
    return new DataModelInstance(dataModel, instanceRawJSON, { jsonMode: evaluators });
  }

  describe('T128 Model', () => {
    let dataModelInstance: DataModelInstance;

    beforeEach(() => {
      dataModelInstance = getInstance('./data/instance.json');
    });

    it('should set the root to the authority', () => {
      expect(dataModelInstance.root.get('authority')).to.be.an.instanceOf(ContainerInstance);
    });

    it('should be constructable from JSON', () => {
      const instanceRawJSON = readJSON('./data/instance.json');
      const instanceFromJSON = new DataModelInstance(dataModel, instanceRawJSON);

      expect(instanceFromJSON.toJSON(allow)).to.deep.equal(instanceRawJSON);
    });

    it('should be constructable from camelCased JSON', () => {
      const instanceRawJSON = readJSON('./data/instanceCamelCase.json');
      const instanceFromJSON = new DataModelInstance(dataModel, instanceRawJSON);

      expect(instanceFromJSON.toJSON(allow, true)).to.deep.equal(instanceRawJSON);
    });

    it('should serialize an instance to JSON', () => {
      const instanceJSON = readJSON('./data/instance.json');
      expect(dataModelInstance.toJSON(allow)).to.deep.equal(instanceJSON);
    });

    it('should serialize an instance to JSON with camel case', () => {
      const instanceJSONCamelCase = readJSON('./data/instanceCamelCase.json');
      expect(dataModelInstance.toJSON(allow, true)).to.deep.equal(instanceJSONCamelCase);
    });

    it('should serialize an instance to JSON without converting types', () => {
      const instanceNotConverted = readJSON('./data/instanceNotConverted.json');
      expect(dataModelInstance.toJSON(allow, true, false)).to.deep.equal(instanceNotConverted);
    });

    it('should serialize an instance to JSON without skipped fields', () => {
      const instanceSkippedFields = readJSON('./data/instanceSkippedFields.json');
      expect(
        dataModelInstance.toJSON(allow, true, false, x => x instanceof ListChildInstance && x.model.name === 'node')
      ).to.deep.equal(instanceSkippedFields);
    });

    it('should serialize an instance to JSON and not skip LeafInstance or LeafListInstance', () => {
      const instanceNotConverted = readJSON('./data/instanceNotConverted.json');
      expect(
        dataModelInstance.toJSON(allow, true, false, x => x instanceof LeafInstance || x instanceof LeafListInstance)
      ).to.deep.equal(instanceNotConverted);
    });

    it('should get leaves', () => {
      const searchPath = [{ name: 'authority' }, { name: 'name' }];
      const leaf = dataModelInstance.getInstance(searchPath);

      expect((leaf as LeafInstance).getValue(allow)).to.equal('Authority128');
    });

    it('should traverse lists', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'session-type', keys: [{ key: 'name', value: 'HTTPS' }] },
        { name: 'service-class' }
      ];
      const leaf = dataModelInstance.getInstance(searchPath);

      expect((leaf as LeafInstance).getValue(allow)).to.equal('Standard');
    });

    it('should throw is next segment not found for list', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'session-type', keys: [{ key: 'name', value: 'HTTPS' }] },
        { name: 'badSegment' }
      ];

      expect(() => dataModelInstance.getInstance(searchPath)).to.throw();
    });

    it('should throw if key names do not match', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'session-type', keys: [{ key: 'badName', value: 'HTTPS' }] },
        { name: 'service-class' }
      ];

      expect(() => dataModelInstance.getInstance(searchPath)).to.throw();
    });

    it('should throw if key value not found', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'session-type', keys: [{ key: 'name', value: 'badValue' }] },
        { name: 'service-class' }
      ];

      expect(() => dataModelInstance.getInstance(searchPath)).to.throw();
    });

    it('should throw if keys not provided for list', () => {
      const searchPath = [{ name: 'authority' }, { name: 'session-type' }, { name: 'service-class' }];

      expect(() => dataModelInstance.getInstance(searchPath)).to.throw();
    });

    it('should traverse containers', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'system' },
        { name: 'services' },
        { name: 'webserver' },
        { name: 'port' }
      ];
      const leaf = dataModelInstance.getInstance(searchPath);

      expect((leaf as LeafInstance).getValue(allow)).to.equal('443');
    });

    it('should get leaf lists', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'router-group' }
      ];
      const leafList = dataModelInstance.getInstance(searchPath);

      expect((leafList as LeafListInstance).getValues(allow)).to.deep.equal(['group1', 'group2']);
    });
  });

  describe('User Model', () => {
    let dataModelInstance: DataModelInstance;

    const userModel = readDataModel('../../model/__tests__/data/consolidatedUserModel.json');
    const config = readJSON('./data/userInstance.json');

    beforeEach(() => {
      dataModelInstance = new DataModelInstance(userModel, config);
    });

    it('should set the root to the authority', () => {
      expect(dataModelInstance.root.get('authority')).to.be.an.instanceOf(ContainerInstance);
    });

    it('should serialize an instance to JSON', () => {
      const instanceJSON = readJSON('./data/userInstance.json');
      expect(dataModelInstance.toJSON(allow)).to.deep.equal(instanceJSON);
    });

    it('should get leaves', () => {
      const searchPath = [{ name: 'authority' }, { name: 'name' }];
      const leaf = dataModelInstance.getInstance(searchPath);

      expect((leaf as LeafInstance).getValue(allow)).to.equal('Authority128');
    });

    it('should get list children', () => {
      const searchPath = [
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'user' }
      ];

      const list = dataModelInstance.getInstance(searchPath);

      const children = (list as ListInstance).getChildren(allow);
      expect(children.size).to.equal(1);

      const childUser = children.get('admin'); // children is a map keyed by 'name' values
      expect(childUser).to.be.an.instanceOf(ListChildInstance);

      const childName = (childUser as ListChildInstance).getChildren(allow).get('name');
      expect(childName).to.be.an.instanceOf(LeafInstance);
      expect((childName as LeafInstance).getValue(allow)).to.equal('admin');
    });
  });

  describe('JSON Only Mode', () => {
    it('should use provided method for leafref evaluation', async () => {
      const dataModelInstance = getInstanceJsonOnlyMode('./data/instance.json');
      const result = await dataModelInstance.evaluateLeafRef([
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'test' }
      ]);

      expect(result).to.deep.equal(['testLeafRef']);
    });

    it('should use provided method for suggestionref evaluation', async () => {
      const dataModelInstance = getInstanceJsonOnlyMode('./data/instance.json');
      const result = await dataModelInstance.evaluateSuggestionRef([
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'test' }
      ]);

      expect(result).to.deep.equal(['testSuggestionRef']);
    });

    it('should still immediately return true if leaf has no applicable whens', async () => {
      const dataModelInstance = getInstanceJsonOnlyMode('./data/instance.json');
      const result = await dataModelInstance.evaluateWhenCondition([
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'name' }
      ]);

      expect(result).to.equal(true);
    });

    it('should use provided method for when evaluation', async () => {
      const dataModelInstance = getInstanceJsonOnlyMode('./data/instance.json');
      const result = await dataModelInstance.evaluateWhenCondition([
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'node', keys: [{ key: 'name', value: 'TestNode1' }] },
        { name: 'device-interface', keys: [{ key: 'name', value: '0' }] },
        { name: 'pppoe' },
        { name: 'user-name' }
      ]);

      expect(result).to.deep.equal(false);
    });

    it('should use provided method for leafref following', async () => {
      const dataModelInstance = getInstanceJsonOnlyMode('./data/instance.json');
      const result = await dataModelInstance.resolveLeafRefPath([
        { name: 'authority' },
        { name: 'router', keys: [{ key: 'name', value: 'Fabric128' }] },
        { name: 'test' }
      ]);

      expect(result).to.deep.equal([{ name: 'goo' }]);
    });
  });
});
