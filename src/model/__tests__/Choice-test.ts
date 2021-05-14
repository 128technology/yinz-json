import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

import YinElement from '../../util/YinElement';
import { Leaf, List, Choice, Container } from '../';

describe('Choice Model', () => {
  const modelText = fs.readFileSync(path.join(__dirname, './data/testChoice.json'), 'utf-8');
  const model = new YinElement(JSON.parse(modelText), null);

  const mandatoryModelText = fs.readFileSync(path.join(__dirname, './data/testMandatoryChoice.json'), 'utf-8');
  const mandatoryModel = new YinElement(JSON.parse(mandatoryModelText), null);

  const emptyModelText = fs.readFileSync(path.join(__dirname, './data/testChoiceEmptyCases.json'), 'utf-8');
  const emptyModel = new YinElement(JSON.parse(emptyModelText), null);

  it('should get initalized', () => {
    const choice = new Choice(model, {} as Container);

    expect(choice.name).to.equal('type');
  });

  it('should build cases', () => {
    const choice = new Choice(model, {} as Container);

    expect(choice.cases.length).to.equal(2);
  });

  it('should build all children', () => {
    const choice = new Choice(model, {} as Container);

    expect(choice.children.get('destination')).to.be.an.instanceOf(Leaf);
    expect(choice.children.get('nat-target')).to.be.an.instanceOf(Leaf);
    expect(choice.children.get('next-hop')).to.be.an.instanceOf(List);
    expect(choice.children.get('peer')).to.be.an.instanceOf(Leaf);
  });

  it('should get case names', () => {
    const choice = new Choice(model, {} as Container);

    expect(choice.caseNames).to.deep.equal(['service-agent', 'peer-service-route']);
  });

  it('should not be madatory by default', () => {
    const choice = new Choice(model, {} as Container);

    expect(choice.mandatory).to.equal(false);
  });

  it('should be mandatory if specified in model', () => {
    const choice = new Choice(mandatoryModel, {} as Container);

    expect(choice.mandatory).to.equal(true);
  });

  it('should get empty cases', () => {
    const choice = new Choice(emptyModel, {} as Container);

    const { emptyCases } = choice;

    expect(emptyCases).to.have.lengthOf(1);
    expect(emptyCases[0].name).to.equal('im-empty');
  });

  it('visits itself', () => {
    const spy = sinon.spy();
    const choice = new Choice(model, {} as Container);
    choice.visit(spy);

    expect(spy.firstCall.args[0]).to.equal(choice);
  });

  it('visits children', () => {
    const spy = sinon.spy();
    const choice = new Choice(model, {} as Container);
    choice.visit(spy);

    expect(spy.callCount).to.equal(13);
  });
});
