import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

import YinElement from '../../util/YinElement';
import { Choice, Leaf, Case, Container } from '../';

describe('Case', () => {
  const loaded = new Set<string>();

  const load = (filename: string) => {
    // sanity check to make sure we don't load the same file twice which is likely a copy-paste error.
    expect(loaded.has(filename)).to.equal(false);
    loaded.add(filename);

    const text = fs.readFileSync(path.join(__dirname, `./data/${filename}.json`), 'utf-8');
    return new YinElement(JSON.parse(text), null);
  };

  const explicitCase = load('testExplicitCase');
  const emptyCase = load('testEmptyCase');
  const deprecatedCase = load('testDeprecatedCase');
  const deprecatedChildrenCase = load('testDeprecatedChildrenCase');
  const deprecatedOneChildCase = load('testDeprecatedOneChildCase');
  const obsoleteCase = load('testObsoleteCase');
  const obsoleteChildrenCase = load('testObsoleteChildrenCase');
  const obsoleteOneChildCase = load('testObsoleteOneChildCase');
  const prototypeCase = load('testPrototypeCase');
  const prototypeChildrenCase = load('testPrototypeChildrenCase');
  const prototypeOneChildCase = load('testPrototypeOneChildCase');

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

  it('determine if case is deprecated when all children are', () => {
    const theCase = new Case(deprecatedChildrenCase, mockChoice, {} as Container);

    expect(theCase.isDeprecated).to.equal(true);
  });

  it('determine if case is deprecated when one children is', () => {
    const theCase = new Case(deprecatedOneChildCase, mockChoice, {} as Container);

    expect(theCase.isDeprecated).to.equal(false);
  });

  it('determine if case is obsolete', () => {
    const theCase = new Case(obsoleteCase, mockChoice, {} as Container);

    expect(theCase.isObsolete).to.equal(true);
  });

  it('determine if case is obsolete when all children are', () => {
    const theCase = new Case(obsoleteChildrenCase, mockChoice, {} as Container);

    expect(theCase.isObsolete).to.equal(true);
  });

  it('determine if case is obsolete when one child is', () => {
    const theCase = new Case(obsoleteOneChildCase, mockChoice, {} as Container);

    expect(theCase.isObsolete).to.equal(false);
  });

  it('determine if case is a prototype', () => {
    const theCase = new Case(prototypeCase, mockChoice, {} as Container);

    expect(theCase.isPrototype).to.equal(true);
  });

  it('determine if case is a prototype when all children are', () => {
    const theCase = new Case(prototypeChildrenCase, mockChoice, {} as Container);

    expect(theCase.isPrototype).to.equal(true);
  });

  it('determine if case is a prototype when one child is', () => {
    const theCase = new Case(prototypeOneChildCase, mockChoice, {} as Container);

    expect(theCase.isPrototype).to.equal(false);
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
