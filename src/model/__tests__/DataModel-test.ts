import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

import DataModel, { Choice, Leaf, Container } from '../';

export const configModel = new DataModel({
  modelElement: JSON.parse(fs.readFileSync(path.join(__dirname, './data/consolidatedT128Model.json'), 'utf-8')),
  getRoot: doc => doc.children!.find(x => x.name === 'config')!.children!.find(x => x.name === 'authority')!
});

describe('Data Model', () => {
  describe('Config Model', () => {
    it('should parse a data model', () => {
      expect(configModel.root.size).to.equal(1);
    });

    it('should have a global namespace map', () => {
      expect(configModel.namespaces).to.deep.equal({
        al: 'http://128technology.com/t128/analytics',
        alarm: 'http://128technology.com/t128/config/alarm-config',
        authy: 'http://128technology.com/t128/config/authority-config',
        bgp: 'http://128technology.com/t128/config/bgp-config',
        gen: 'http://128technology.com/t128/config/generated-config',
        if: 'http://128technology.com/t128/config/interface-config',
        ospf: 'http://128technology.com/t128/config/ospf-config',
        pf: 'http://128technology.com/t128/packet-forwarding',
        rp: 'http://128technology.com/t128/config/routing-policy-config',
        rt: 'http://128technology.com/t128/config/routing-config',
        svc: 'http://128technology.com/t128/config/service-config',
        sys: 'http://128technology.com/t128/config/system-config',
        'sys-svcs': 'http://128technology.com/t128/config/system-config/services',
        t128: 'http://128technology.com/t128',
        't128-access': 'http://128technology.com/t128/access-control'
      });
    });

    it('should get the model for a given path', () => {
      const model = configModel.getModelForPath('authority.router.node.device-interface.target-interface');

      expect(model.name).to.equal('target-interface');
      expect(model).to.be.an.instanceOf(Leaf);
    });

    it('should get the model if it is a choice for a given path', () => {
      expect(configModel.getModelForPath('authority.router.service-route.type')).to.be.an.instanceOf(Choice);
    });

    it('leafs should be marked as unique', () => {
      expect((configModel.getModelForPath('authority.router.id') as Leaf).isUnique).to.equal(true);
    });

    it('leafs should be marked as not unique', () => {
      expect((configModel.getModelForPath('authority.router.location') as Leaf).isUnique).to.equal(false);
    });
  });

  describe('Stats Model', () => {
    const modelText = fs.readFileSync(path.join(__dirname, './data/consolidatedStatsModel.json'), 'utf-8');
    const modelElement = JSON.parse(modelText);

    const dataModel = new DataModel({
      modelElement,
      getRoot: doc => doc.children!.find(x => x.name === 'stats')!
    });

    it('should parse a data model', () => {
      expect(dataModel.root.size).to.equal(1);
    });

    it('should get the model for a given path', () => {
      const model = dataModel.getModelForPath('stats.session.flow.add.failure');

      expect(model.name).to.equal('failure');
      expect(model).to.be.an.instanceOf(Container);
    });
  });
});
