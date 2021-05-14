import applyMixins from '../util/applyMixins';
import { LeafList } from '../model';

import { WithAttributes } from './mixins';
import { LeafJSON, Visitor, Authorized } from './types';
import { Path, LeafListInstance } from './';

export default class LeafListChildInstance implements WithAttributes {
  public customAttributes: WithAttributes['customAttributes'];
  public parseAttributesFromJSON: WithAttributes['parseAttributesFromJSON'];
  public hasAttributes: WithAttributes['hasAttributes'];
  public rawAttributes: WithAttributes['rawAttributes'];
  public getValueFromJSON: WithAttributes['getValueFromJSON'];
  public addOperation: WithAttributes['addOperation'];
  public addPosition: WithAttributes['addPosition'];

  private config?: Element;
  private rawValue: string;

  constructor(public model: LeafList, config: LeafJSON, public parent: LeafListInstance) {
    this.injestConfigJSON(config);
    this.parseAttributesFromJSON(config);
  }

  public getConfig(authorized: Authorized) {
    if (authorized(this)) {
      return this.config;
    } else {
      throw new Error('Unauthorized');
    }
  }

  public setConfig(el: Element) {
    this.config = el;
  }

  public getRawValue(authorized: Authorized) {
    return authorized(this) ? this.rawValue : null;
  }

  public get value() {
    return this.model.type.serialize(this.rawValue);
  }

  public injestConfigJSON(configJSON: LeafJSON) {
    const config = this.getValueFromJSON(configJSON) as string | number | boolean;
    this.rawValue = config.toString();
  }

  public getPath(): Path {
    return this.parent.getPath();
  }

  public visit(visitor: Visitor) {
    visitor(this);
  }
}

applyMixins(LeafListChildInstance, [WithAttributes]);
