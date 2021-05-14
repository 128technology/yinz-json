import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

import YinElement from '../../util/YinElement';
import { Choice, Leaf, Case, Container } from '../';

describe('Case', () => {
  const explicitCaseText = fs.readFileSync(path.join(__dirname, './data/testExplicitCase.json'), 'utf-8');
  const explicitCase = new YinElement(JSON.parse(explicitCaseText), null);

  const emptyCaseText = fs.readFileSync(path.join(__dirname, './data/testEmptyCase.json'), 'utf-8');
  const emptyCase = new YinElement(JSON.parse(emptyCaseText), null);

  const deprecatedCaseText = fs.readFileSync(path.join(__dirname, './data/testDeprecatedCase.json'), 'utf-8');
  const deprecatedCase = new YinElement(JSON.parse(deprecatedCaseText), null);

  const obsoleteCaseText = fs.readFileSync(path.join(__dirname, './data/testObsoleteCase.json'), 'utf-8');
  const obsoleteCase = new YinElement(JSON.parse(obsoleteCaseText), null);

  const prototypeCaseText = fs.readFileSync(path.join(__dirname, './data/testPrototypeCase.json'), 'utf-8');
  const prototypeCase = new YinElement(JSON.parse(prototypeCaseText), null);

  const mockChoice = {} as Choice;

  it('should construct explicit cases', () => {
    const theCase = new Case(explicitCase, mockChoice, {} as Container);

    expect(theCase.name).to.equal('peer-service-route');
  });

  it('should construct children for explicit cases', () => {
    const theCase = new Case(explicitCase, mockChoice, {} as Container);

    expect(theCase.children.get('peer')).to.be.an.instanceOf(Leaf);
  });

  it('determine if case is not empty', () => {
    const theCase = new Case(explicitCase, mockChoice, {} as Container);

    expect(theCase.isEmpty()).to.equal(false);
  });

  it('determine if case is empty', () => {
    const theCase = new Case(emptyCase, mockChoice, {} as Container);

    expect(theCase.isEmpty()).to.equal(true);
  });

  it('determine if case is deprecated', () => {
    const theCase = new Case(deprecatedCase, mockChoice, {} as Container);

    expect(theCase.isDeprecated).to.equal(true);
  });

  it('determine if case is obsolete', () => {
    const theCase = new Case(obsoleteCase, mockChoice, {} as Container);

    expect(theCase.isObsolete).to.equal(true);
  });

  it('determine if case is a prototype', () => {
    const theCase = new Case(prototypeCase, mockChoice, {} as Container);

    expect(theCase.isPrototype).to.equal(true);
  });

  it('visits itself', () => {
    const spy = sinon.spy();
    const theCase = new Case(explicitCase, mockChoice, {} as Container);
    theCase.visit(spy);

    expect(spy.firstCall.args[0]).to.equal(theCase);
  });

  it('visits children', () => {
    const spy = sinon.spy();
    const theCase = new Case(explicitCase, mockChoice, {} as Container);
    theCase.visit(spy);

    expect(spy.callCount).to.equal(2);
  });
});
