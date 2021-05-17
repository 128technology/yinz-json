import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import DataModelInstance, { LeafInstance, LeafListInstance, ListChildInstance } from '../';
import { allow } from '../util';
import { readDataModel } from './DataModelInstance-test';

export const dataModel = readDataModel('../../model/__tests__/data/consolidatedT128Model.json');

describe('Mapping Instance Data to JSON', () => {
  function getInstance(instancePath: string) {
    const config = readJSON(instancePath);
    return new DataModelInstance(dataModel, config);
  }

  function readJSON(filepath: string) {
    const instanceJSONText = fs.readFileSync(path.join(__dirname, filepath), 'utf-8');
    return JSON.parse(instanceJSONText);
  }

  describe('Passing Through', () => {
    it('should serialize an instance to JSON', () => {
      expect(getInstance('./data/instance.json').mapToJSON(allow)).to.deep.equal(readJSON('./data/instance.json'));
    });
  });

  describe('Replacing via Mapping', () => {
    let dataModelInstance: DataModelInstance;

    beforeEach(() => {
      dataModelInstance = getInstance('./data/instance.json');
    });

    it('should replace enabled with disabled', () => {
      const result = dataModelInstance.mapToJSON(allow, instance => {
        if (instance instanceof LeafInstance) {
          if (instance.getValue(allow) === 'enabled') {
            return { [instance.model.getName()]: 'disabled' };
          } else {
            return {};
          }
        } else {
          return {};
        }
      });

      expect(result).to.deep.equal({
        authority: {
          router: [
            {
              name: 'Fabric128',
              bfd: {
                state: 'disabled'
              }
            }
          ]
        }
      });
    });

    it('should handle a key replace', () => {
      const result = dataModelInstance.mapToJSON(
        allow,
        instance => {
          if (instance instanceof LeafInstance) {
            if (instance.getValue(allow) === 'Fabric128') {
              return { [instance.model.getName()]: 'Fabric129' };
            } else {
              return {};
            }
          } else if (instance instanceof ListChildInstance) {
            return [
              { _operation: 'delete', _value: { name: 'Fabric128' } },
              { _operation: 'create', _value: { name: 'Fabric129' } }
            ];
          } else {
            return {};
          }
        },
        { overrideOnKeyMap: true }
      );

      expect(result).to.deep.equal({
        authority: {
          router: [
            { _operation: 'delete', _value: { name: 'Fabric128' } },
            { _operation: 'create', _value: { name: 'Fabric129' } }
          ]
        }
      });
    });

    it('should replace top level config', () => {
      const result = dataModelInstance.mapToJSON(allow, instance => {
        if (instance instanceof LeafInstance) {
          if (instance.getValue(allow) === 'Authority128') {
            return { [instance.model.getName()]: 'Authority129' };
          } else {
            return {};
          }
        } else {
          return {};
        }
      });

      expect(result).to.deep.equal({
        authority: {
          name: 'Authority129'
        }
      });
    });

    it('should replace true with false', () => {
      const result = dataModelInstance.mapToJSON(allow, instance => {
        if (instance instanceof LeafInstance) {
          if (instance.getValue(allow) === 'true') {
            return { [instance.model.getName()]: 'false' };
          } else {
            return {};
          }
        } else {
          return {};
        }
      });

      expect(result).to.deep.equal({
        authority: {
          router: [
            {
              name: 'Fabric128',
              node: [
                {
                  enabled: 'false',
                  name: 'TestNode1'
                },
                {
                  enabled: 'false',
                  name: 'TestNode2'
                }
              ],
              system: {
                services: {
                  webserver: {
                    enabled: 'false'
                  }
                }
              }
            }
          ],
          security: [
            {
              'adaptive-encryption': 'false',
              encrypt: 'false',
              hmac: 'false',
              name: 'internal'
            }
          ]
        }
      });
    });

    it('should replace a leaf list item', () => {
      const result = dataModelInstance.mapToJSON(allow, instance => {
        if (instance instanceof LeafListInstance) {
          const matches = instance.getRawValues(allow).includes('group1');
          if (matches) {
            return {
              [instance.model.getName()]: instance.getRawValues(allow).map(v => (v === 'group1' ? 'group100' : v))
            };
          } else {
            return {};
          }
        } else {
          return {};
        }
      });

      expect(result).to.deep.equal({
        authority: {
          router: [{ name: 'Fabric128', 'router-group': ['group100', 'group2'] }]
        }
      });
    });
  });
});
