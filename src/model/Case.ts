import * as _ from 'lodash';

import applyMixins from '../util/applyMixins';
import { isVisible } from '../enum/Visibility';
import { Visibility, Status } from '../enum';
import { EmptyType } from '../types';
import { Whenable } from './mixins';
import { IWhen } from './mixins/Whenable';
import { buildChildren } from './util/childBuilder';
import { Model, Choice, Leaf, Visitor } from './';
import { StatusParser, VisibilityParser } from './parsers';
import YinElement from '../util/YinElement';

export default class Case implements Whenable {
  public name: string;
  public children: Map<string, Model>;
  public modelType: string;
  public otherProps: Map<string, string | boolean> = new Map();
  public status: Status | null;
  public when: IWhen[];
  public visibility: Visibility | null;
  public hasWhenAncestorOrSelf: boolean;
  public addWhenableProps: Whenable['addWhenableProps'];

  constructor(el: YinElement, public parentChoice: Choice, parentModel: Model) {
    this.modelType = 'case';
    this.name = el.name!;
    this.status = StatusParser.parse(el);
    this.visibility = VisibilityParser.parse(el);
    this.addWhenableProps(el);

    this.buildChildrenFromCase(el, parentModel);

    [...this.children.values()].forEach(child => {
      child.choiceCase = this;
    });
  }

  public isEmpty() {
    return _.some(
      Array.from(this.children.values()),
      c => c instanceof Leaf && c.getResolvedType() instanceof EmptyType
    );
  }

  get isPrototype(): boolean {
    return this.visibility !== null
      ? this.visibility === Visibility.prototype
      : this.parentChoice.isPrototype || _.every(Array.from(this.children.values()), c => c.isPrototype);
  }

  get isVisible(): boolean {
    return this.visibility !== null
      ? isVisible(this.visibility)
      : this.parentChoice.isVisible ||
          _.every(Array.from(this.children.values()), c => c.visibility !== null && isVisible(c.visibility));
  }

  get isObsolete() {
    return this.status !== null
      ? this.status === Status.obsolete
      : this.parentChoice.isObsolete || _.every(Array.from(this.children.values()), c => c.isObsolete);
  }

  get isDeprecated() {
    return this.status !== null
      ? this.status === Status.deprecated
      : this.parentChoice.isDeprecated || _.every(Array.from(this.children.values()), c => c.isDeprecated);
  }

  public visit(visitor: Visitor) {
    visitor(this);

    for (const value of this.children.values()) {
      value.visit(visitor);
    }
  }

  private buildChildrenFromCase(el: YinElement, parentModel: Model) {
    // TODO: Handle another choice nested in a case.
    const { children } = buildChildren(el, parentModel);
    this.children = children;
  }
}

applyMixins(Case, [Whenable]);
