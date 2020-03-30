import { Element } from 'libxmljs';

import applyMixins from '../util/applyMixins';
import { isElement } from '../util/xmlUtil';

import { Statement, Whenable, WithRegistry } from './mixins';
import { MandatoryParser } from './parsers';
import { Model, Case, Visitor } from './';

export default class Choice implements Statement, Whenable, WithRegistry {
  private static CASE_TYPES = new Set(['case', 'leaf', 'leaf-list', 'list', 'container']);

  private static isCase(el: Element) {
    return Choice.CASE_TYPES.has(el.name());
  }

  public addStatementProps: Statement['addStatementProps'];
  public addWhenableProps: Whenable['addWhenableProps'];
  public choiceCase: Statement['choiceCase'];
  public description: Statement['description'];
  public getName: Statement['getName'];
  public hasWhenAncestorOrSelf: Whenable['hasWhenAncestorOrSelf'];
  public isDeprecated: Statement['isDeprecated'];
  public isObsolete: Statement['isObsolete'];
  public isPrototype: Statement['isPrototype'];
  public isVisible: Statement['isVisible'];
  public name: Statement['name'];
  public ns: Statement['ns'];
  public otherProps: Statement['otherProps'];
  public parentModel: Statement['parentModel'];
  public path: Statement['path'];
  public register: WithRegistry['register'];
  public status: Statement['status'];
  public visibility: Statement['visibility'];
  public when: Whenable['when'];

  public cases: Case[];
  public children: Map<string, Model>;
  public mandatory: boolean;
  public modelType: string;

  constructor(el: Element, parentModel?: Model) {
    this.modelType = 'choice';
    this.addStatementProps(el, parentModel);
    this.addWhenableProps(el);

    this.mandatory = MandatoryParser.parse(el);
    this.cases = this.buildCases(el, parentModel);

    // Merge the child maps together
    this.children = new Map(
      function* (): Iterable<[string, Model]> {
        for (let i = 0, lenI = this.cases.length; i < lenI; i++) {
          yield* this.cases[i].children;
        }
      }.bind(this)()
    );

    this.register(parentModel, this);
  }

  public get caseNames() {
    return this.cases.map(theCase => theCase.name);
  }

  public get emptyCases() {
    return this.cases.filter(theCase => theCase.isEmpty());
  }

  public visit(visitor: Visitor) {
    visitor(this);

    this.cases.forEach(theCase => {
      theCase.visit(visitor);
    });
  }

  private buildCases(el: Element, parentModel?: Model) {
    return el
      .childNodes()
      .filter(isElement)
      .filter(caseEl => Choice.isCase(caseEl))
      .map(caseEl => new Case(caseEl, this, parentModel));
  }
}

applyMixins(Choice, [Statement, Whenable, WithRegistry]);
