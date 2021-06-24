import * as _ from 'lodash';

import applyMixins from '../util/applyMixins';
import { Container, Leaf, LeafList, List } from '../model';

import { Searchable, WithAttributes } from './mixins';
import {
  ListJSON,
  LeafJSON,
  LeafListJSON,
  ContainerJSON,
  Visitor,
  NoMatchHandler,
  Parent,
  ShouldSkip,
  ContainerJSONValue,
  Authorized,
  JSONMapper,
  MapToJSONOptions
} from './types';
import { getDefaultMapper } from './util';
import { Path, Instance, LeafListChildInstance } from './';

export default class ContainerInstance implements Searchable, WithAttributes {
  public activeChoices: Map<string, string> = new Map();

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

  private children: Map<string, Instance> = new Map();

  constructor(public model: Container, config: ContainerJSON, public parent: Parent | null) {
    this.injestConfigJSON(config);
    this.parseAttributesFromJSON(config);
  }

  public getChildren(authorized: Authorized) {
    const children: Map<string, Instance> = new Map();

    for (const [k, v] of this.children) {
      if (authorized(v)) {
        children.set(k, v);
      }
    }

    return children;
  }

  public getChild(authorized: Authorized, name: string) {
    const child = this.children.get(name);

    if (child && authorized(child)) {
      return child;
    } else {
      throw new Error(`Child ${name} not found on container ${this.model.name}.`);
    }
  }

  public delete(childName: string) {
    const child = this.children.get(childName);

    if (!child) {
      throw new Error(`Cannot delete ${childName}, it was not found on ${this.model.name}.`);
    }

    this.children.delete(childName);
  }

  public toJSON(
    authorized: Authorized,
    camelCase = false,
    convert = true,
    shouldSkip?: ShouldSkip
  ): ContainerJSONValue {
    if (!authorized(this)) {
      return {};
    }

    const containerInner = [...this.children.values()].reduce(
      (acc, child) => Object.assign(acc, child.toJSON(authorized, camelCase, convert, shouldSkip)),
      {}
    );

    return {
      [this.model.getName(camelCase)]: containerInner
    };
  }

  public mapToJSON(
    authorized: Authorized,
    map: JSONMapper = getDefaultMapper(authorized),
    options: MapToJSONOptions = { overrideOnKeyMap: false }
  ) {
    const containerInner = {};

    for (const child of this.children.values()) {
      Object.assign(containerInner, child.mapToJSON(authorized, map, options));
    }

    return _.size(containerInner) > 0
      ? {
          [this.model.getName()]: containerInner
        }
      : {};
  }

  public getInstance(
    path: Path,
    noMatchHandler: NoMatchHandler = this.handleNoMatch
  ): Instance | LeafListChildInstance | undefined {
    if (this.isTryingToMatchMe(path) && this.isMatch(path)) {
      return this;
    } else if (path.length > 1) {
      const tail = _.tail(path);
      const nextSegment = _.head(tail);

      if (nextSegment && this.children.has(nextSegment.name)) {
        return this.children.get(nextSegment.name)!.getInstance(tail, noMatchHandler);
      }
    }

    noMatchHandler(this, _.tail(path));
  }

  public visit(visitor: Visitor) {
    visitor(this);

    Array.from(this.children.values()).forEach(child => {
      child.visit(visitor);
    });
  }

  private injestConfigJSON(configJSON: ContainerJSON) {
    const config = this.getValueFromJSON(configJSON) as ContainerJSONValue;

    // tslint:disable-next-line:forin
    for (const rawChildName in config) {
      const child = config[rawChildName];
      const childModel = this.model.getChild(rawChildName);
      if (!_.isNil(child) && childModel) {
        // Note: This does not support nested choices
        if (childModel.choiceCase) {
          this.activeChoices.set(childModel.choiceCase.parentChoice.name, childModel.choiceCase.name);
        }

        let instance: Instance;

        if (childModel instanceof Leaf) {
          instance = childModel.buildInstance(child as LeafJSON, this);
        } else if (childModel instanceof LeafList) {
          instance = childModel.buildInstance(child as LeafListJSON, this);
        } else if (childModel instanceof Container) {
          instance = childModel.buildInstance(child as ContainerJSON, this);
        } else if (childModel instanceof List) {
          instance = childModel.buildInstance(child as ListJSON, this);
        } else {
          throw new Error(`Unknown child of type ${typeof childModel} encountered.`);
        }

        this.children.set(childModel.name, instance);
      }
    }
  }
}

applyMixins(ContainerInstance, [Searchable, WithAttributes]);
