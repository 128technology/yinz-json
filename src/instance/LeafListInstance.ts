import * as _ from 'lodash';

import applyMixins from '../util/applyMixins';
import { LeafList } from '../model';

import { Searchable } from './mixins';
import {
  LeafListJSON,
  NoMatchHandler,
  Parent,
  Visitor,
  LeafJSON,
  LeafListJSONValue,
  Authorized,
  JSONMapper,
  MapToJSONOptions
} from './types';
import Path, { isSegmentWithValue } from './Path';
import { getDefaultMapper } from './util';
import { LeafListChildInstance } from './';
import { allow } from './util';

export default class LeafListInstance implements Searchable {
  public getPath: Searchable['getPath'];
  public isTryingToMatchMe: Searchable['isTryingToMatchMe'];
  public isMatch: Searchable['isMatch'];
  public handleNoMatch: Searchable['handleNoMatch'];

  private children: LeafListChildInstance[] = [];

  constructor(public model: LeafList, config: LeafListJSON, public parent: Parent) {
    for (const child of config) {
      this.add(child);
    }
  }

  public getChildren(authorized: Authorized) {
    return authorized(this) ? this.children : [];
  }

  public getValues(authorized: Authorized) {
    return this.children.filter(child => authorized(child)).map(child => child.value);
  }

  public getRawValues(authorized: Authorized) {
    return this.children.map(child => child.getRawValue(authorized));
  }

  public add(config: LeafJSON) {
    this.children.push(new LeafListChildInstance(this.model, config, this));
  }

  public delete(authorized: Authorized, value: string) {
    if (!authorized(this)) {
      throw new Error('Unauthorized');
    }

    this.children = this.children.filter(leafListItem => leafListItem.getRawValue(authorized) !== value);
  }

  public deleteInstance(authorized: Authorized, child: LeafListChildInstance) {
    this.filter(authorized, leafListItem => leafListItem !== child);
  }

  public filter(authorized: Authorized, filter: (child: LeafListChildInstance) => boolean) {
    if (!authorized(this)) {
      throw new Error('Unauthorized');
    }

    this.children = this.children.filter(filter);
  }

  public toJSON(authorized: Authorized, camelCase = false, convert = true): { [name: string]: LeafListJSONValue } {
    if (!authorized(this)) {
      return {};
    }

    return {
      [this.model.getName(camelCase)]: convert ? this.getValues(authorized) : this.getRawValues(authorized)
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
    const head = _.head(path);

    if (head && this.isTryingToMatchMe(path) && this.isMatch(path)) {
      if (!isSegmentWithValue(head)) {
        return this;
      } else {
        const match = this.children.find(child => child.getRawValue(allow) === head.value);

        if (match) {
          return match;
        } else {
          noMatchHandler(this, path);
        }
      }
    }

    noMatchHandler(this, path);
  }

  public visit(visitor: Visitor) {
    visitor(this);

    this.children.forEach(child => {
      child.visit(visitor);
    });
  }
}

applyMixins(LeafListInstance, [Searchable]);
