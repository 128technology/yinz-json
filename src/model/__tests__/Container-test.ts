import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

import YinElement from '../../util/YinElement';
import { Container, Leaf } from '../';

describe('Container Model', () => {
  const modelText = fs.readFileSync(path.join(__dirname, './data/testContainer.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);

  const presenceModelText = fs.readFileSync(path.join(__dirname, './data/testPresenceContainer.json'), 'utf-8');
  const presenceModel = new YinElement(JSON.parse(presenceModelText), null);

  const withChoiceText = fs.readFileSync(path.join(__dirname, './data/testContainerWithChoice.json'), 'utf-8');
  const withChoice = new YinElement(JSON.parse(withChoiceText), null);

  it('should get initalized', () => {
    const container = new Container(model);

    expect(container.name).to.equal('bfd');
  });

  it('should build children', () => {
    const container = new Container(model);

    expect(container.children.size).to.equal(2);
    expect(container.children.get('state')).to.be.an.instanceof(Leaf);
    expect(container.children.get('desired-tx-interval')).to.be.an.instanceof(Leaf);
  });

  it('should build an instance of itself', () => {
    const config = { state: 'enabled' };

    const container = new Container(model);

    const instance = container.buildInstance(config, null);
    expect(instance.model).to.equal(container);
  });

  it('should determine if it has a child', () => {
    const container = new Container(model);

    expect(container.hasChild('state')).to.equal(true);
  });

  it('should determine if it does not have a child', () => {
    const container = new Container(model);

    expect(container.hasChild('foo')).to.equal(false);
  });

  it('should determine if it is not a presence container', () => {
    const container = new Container(model);

    expect(container.isPresenceContainer()).to.equal(false);
  });

  it('should determine if it is a presence container', () => {
    const container = new Container(presenceModel);

    expect(container.isPresenceContainer()).to.equal(true);
  });

  it('should get presence description if it is a presence container', () => {
    const container = new Container(presenceModel);

    expect(container.getPresenceDescription()).to.equal('A really good reason');
  });

  it('should get a child', () => {
    const container = new Container(model);

    expect(container.getChild('state')!.name).to.equal('state');
  });

  it('should get children', () => {
    const container = new Container(model);

    expect([...container.getChildren().keys()]).to.deep.equal(['state', 'desired-tx-interval']);
  });

  it('visits itself', () => {
    const spy = sinon.spy();
    const container = new Container(model);
    container.visit(spy);

    expect(spy.firstCall.args[0]).to.equal(container);
  });

  it('visits children', () => {
    const spy = sinon.spy();
    const container = new Container(model);
    container.visit(spy);

    expect(spy.callCount).to.equal(3);
  });

  it('ignores case children and lets the Choice and Case visit them', () => {
    const spy = sinon.spy();
    const container = new Container(withChoice);
    container.visit(spy);

    expect(spy.callCount).to.equal(15);
  });
});
