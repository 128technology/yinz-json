import applyMixins from '../util/applyMixins';
import { Statement, Whenable, WithRegistry } from './mixins';
import { MandatoryParser } from './parsers';
import { Model, Case, Visitor } from './';
import YinElement from '../util/YinElement';

function union<T>(iterables: Array<Map<string, T>>) {
  const set = new Map<string, T>();

  for (const iterable of iterables) {
    for (const [k, v] of iterable) {
      set.set(k, v);
    }
  }

  return set;
}

export default class Choice implements Statement, Whenable, WithRegistry {
  private static isCase(el: YinElement) {
    return el.keyword === 'case';
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

  constructor(el: YinElement, parentModel: Model) {
    this.modelType = 'choice';
    this.addStatementProps(el, parentModel);
    this.addWhenableProps(el);

    this.mandatory = MandatoryParser.parse(el);
    this.cases = this.buildCases(el, parentModel);

    this.children = union(this.cases.map(x => x.children));

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

  private buildCases(el: YinElement, parentModel: Model) {
    return el.children.filter(caseEl => Choice.isCase(caseEl)).map(caseEl => new Case(caseEl, this, parentModel));
  }
}

applyMixins(Choice, [Statement, Whenable, WithRegistry]);
