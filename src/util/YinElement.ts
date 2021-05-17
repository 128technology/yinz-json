import * as _ from 'lodash';

export type RawYinElement = Readonly<{
  keyword: string;
  namespace: string;
  nsmap?: Record<string, string>;
  children?: ReadonlyArray<RawYinElement>;
  value?: string | null;
  name?: string | null;
  text?: string | null;
  tag?: string | null;
  'target-node'?: string | null;
  'context-node'?: string | null;
  module?: string | null;
  condition?: string | null;
  date?: string | null;
  'module-name'?: string;
  'module-prefix'?: string;
}>;

type Parent = YinElement | null;

export default class YinElement {
  public readonly keyword: string;
  public readonly namespace: string;
  public readonly children: YinElement[];
  public readonly hasWhenAncestorOrSelf: boolean;

  public readonly nsmap?: Record<string, string>;
  public readonly value?: string | null;
  public readonly name?: string | null;
  public readonly text?: string | null;
  public readonly tag?: string | null;
  public readonly targetNode?: string | null;
  public readonly contextNode?: string | null;
  public readonly module?: string | null;
  public readonly condition?: string | null;
  public readonly date?: string | null;
  public readonly moduleName?: string;
  public readonly modulePrefix?: string;

  constructor(el: RawYinElement, public readonly parent: Parent) {
    this.keyword = el.keyword;
    this.namespace = el.namespace;
    this.nsmap = el.nsmap;
    this.value = el.value;
    this.name = el.name;
    this.text = el.text;
    this.tag = el.tag;
    this.targetNode = el['target-node'];
    this.contextNode = el['context-node'];
    this.module = el.module;
    this.condition = el.condition;
    this.date = el.date;
    this.moduleName = el['module-name'];
    this.modulePrefix = el['module-prefix'];
    this.hasWhenAncestorOrSelf =
      (parent ? parent.hasWhenAncestorOrSelf : false) || _.some(el.children ?? [], c => c.keyword === 'when');

    this.children = el.children ? el.children.map(c => new YinElement(c, this)) : [];
  }

  public findChild(keyword: string, namespace?: string) {
    return this.children.find(({ keyword: k, namespace: n }) =>
      namespace ? k === keyword && n === namespace : k === keyword
    );
  }

  public findChildren(keyword: string) {
    return this.children.filter(({ keyword: k }) => k === keyword);
  }

  public getContainingModule(): YinElement | null {
    if (this.modulePrefix) {
      return this;
    } else {
      return this.parent ? this.parent.getContainingModule() : null;
    }
  }

  public collectChildModules(): YinElement[] {
    const childModules: YinElement[] = [];

    if (this.modulePrefix) {
      childModules.push(this);
    }

    this.children.forEach(child => {
      Array.prototype.push.apply(childModules, child.collectChildModules());
    });

    return childModules;
  }
}
