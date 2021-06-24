import * as _ from 'lodash';

import applyMixins from '../util/applyMixins';
import { Leaf } from '../model';

import { Searchable, WithAttributes } from './mixins';
import {
  LeafJSON,
  Visitor,
  NoMatchHandler,
  Parent,
  LeafJSONValue,
  Authorized,
  JSONMapper,
  MapToJSONOptions
} from './types';
import { getDefaultMapper } from './util';
import { Path } from './';

export default class LeafInstance implements Searchable, WithAttributes {
  public customAttributes: WithAttributes['customAttributes'];
  public parseAttributesFromJSON: WithAttributes['parseAttributesFromJSON'];
  public hasAttributes: WithAttributes['hasAttributes'];
  public rawAttributes: WithAttributes['rawAttributes'];
  public getValueFromJSON: WithAttributes['getValueFromJSON'];
  public addOperation: WithAttributes['addOperation'];
  public addPosition: WithAttributes['addPosition'];

  public getPath: Searchable['getPath'];
  public isTryingToMatchMe: Searchable['isTryingToMatchMe'];
  public isMatch: Searchable['isMatch'];
  public handleNoMatch: Searchable['handleNoMatch'];

  private value: string | null;

  constructor(public model: Leaf, config: LeafJSON, public parent: Parent) {
    this.injestConfigJSON(config);
    this.parseAttributesFromJSON(config);
  }

  public getValue(authorized: Authorized) {
    return authorized(this) ? this.value : null;
  }

  public getConvertedValue(authorized: Authorized) {
    if (!authorized(this)) {
      return null;
    }

    return this.value !== null ? this.model.type.serialize(this.value) : null;
  }

  public toJSON(authorized: Authorized, camelCase = false, convert = true): { [name: string]: LeafJSONValue } {
    if (!authorized(this)) {
      return {};
    }

    return {
      [this.model.getName(camelCase)]: convert ? this.getConvertedValue(authorized) : this.getValue(authorized)
    };
  }

  public mapToJSON(
    authorized: Authorized,
    map: JSONMapper = getDefaultMapper(authorized),
    options: MapToJSONOptions = { overrideOnKeyMap: false }
  ) {
    return map(this);
  }

  public getInstance(path: Path, noMatchHandler: NoMatchHandler = this.handleNoMatch) {
    if (this.isTryingToMatchMe(path) && this.isMatch(path)) {
      return this;
    }

    noMatchHandler(this, path);
  }

  public visit(visitor: Visitor) {
    visitor(this);
  }

  private injestConfigJSON(configJSON: LeafJSON) {
    const config = this.getValueFromJSON(configJSON) as LeafJSONValue;
    this.value = config === null ? null : config.toString();
  }
}

applyMixins(LeafInstance, [Searchable, WithAttributes]);
