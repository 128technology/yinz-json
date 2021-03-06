import * as fs from 'fs';
import { expect } from 'chai';
import * as path from 'path';
import * as _ from 'lodash';

import DataModelInstance from '..';
import { readDataModel } from './DataModelInstance-test';

function accessToRouter(routerName: string) {
  return (i: any) => {
    const instancePath = i.getPath();
    return (
      instancePath.filter((v: any) => _.isEqual(v, { name: 'router', keys: [{ key: 'name', value: routerName }] }))
        .length > 0 || _.isEqual(instancePath, [{ name: 'authority' }])
    );
  };
}

const userModel = readDataModel('../../model/__tests__/data/consolidatedUserModel.json');

describe('Authorization Test', () => {
  const instanceRawJSON = JSON.parse(fs.readFileSync(path.join(__dirname, './data/userAuthInstance.json'), 'utf8'));
  let dataModelInstance: DataModelInstance;

  beforeEach(() => {
    dataModelInstance = new DataModelInstance(userModel, instanceRawJSON);
  });

  it('should restrict return value based on authorization', () => {
    const result = {
      authority: {
        router: [
          {
            name: 'Fabric128',
            user: [
              {
                enabled: true,
                name: 'admin',
                password: '(removed)',
                role: ['admin']
              }
            ]
          }
        ]
      }
    };

    expect(dataModelInstance.toJSON(accessToRouter('Fabric128'))).to.deep.equal(result);

    const resultBase = {
      authority: {
        router: [
          {
            name: 'BasicFabric128',
            user: [
              {
                name: 'admin',
                password: '(removed)',
                role: ['admin'],
                enabled: true
              },
              {
                name: 'baseUser',
                password: '(removed)',
                role: ['user'],
                enabled: true
              }
            ]
          }
        ]
      }
    };

    expect(dataModelInstance.toJSON(accessToRouter('BasicFabric128'))).to.deep.equal(resultBase);
  });

  it('should return empty object when not authorized', () => {
    expect(dataModelInstance.toJSON(() => false)).to.deep.equal({});
  });
});
