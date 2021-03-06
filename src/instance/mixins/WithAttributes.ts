import * as _ from 'lodash';

import { IAttribute, NetconfOperation, Position, JSONConfigNode, hasAttributes } from '../types';
import UnreachableCaseError from '../../util/unreachableCaseError';
import { Model, List, LeafList } from '../../model';

function mapOperationToAttribute(operation: NetconfOperation): IAttribute {
  switch (operation) {
    case 'delete':
    case 'merge':
    case 'replace':
    case 'remove':
    case 'create': {
      return {
        href: 'urn:ietf:params:xml:ns:netconf:base:1.0',
        name: 'operation',
        prefix: 'xc',
        value: operation
      };
    }
    default: {
      throw new UnreachableCaseError(operation);
    }
  }
}

function mapPositionToAttributes(position: Position, model: List | LeafList): IAttribute[] {
  const attributes: IAttribute[] = [
    {
      href: 'urn:ietf:params:xml:ns:yang:1',
      name: 'insert',
      prefix: 'yang',
      value: position.insert
    }
  ];

  if (position.value) {
    if (model instanceof LeafList) {
      attributes.push({
        href: 'urn:ietf:params:xml:ns:yang:1',
        name: 'value',
        prefix: 'yang',
        value: position.value
      });
    } else {
      throw new Error('Value can only be provided as the position of a leaf list.');
    }
  }

  if (position.keys) {
    if (model instanceof List) {
      const keyMap = model.getKeyNodes().reduce((acc, keyNode) => (acc.set(keyNode.name, keyNode), acc), new Map());
      const keyString = position.keys
        .map(({ key, value }) => {
          const keyModel = keyMap.get(key);

          if (!keyModel) {
            throw new Error(`Provided key ${key} not found for list ${model.name}.`);
          }

          const [prefix] = keyModel.ns;
          return `[${prefix}:${_.kebabCase(key)}='${value}']`;
        })
        .join('');

      attributes.push({
        href: 'urn:ietf:params:xml:ns:yang:1',
        name: 'key',
        prefix: 'yang',
        value: keyString
      });
    } else {
      throw new Error('Keys can only be provided as the position to a list.');
    }
  }

  return attributes;
}

export default class WithAttributes {
  public rawAttributes: IAttribute[];
  public model: Model;

  public parseAttributesFromJSON(config: JSONConfigNode) {
    this.rawAttributes = [];

    if (typeof config === 'object' && config && hasAttributes(config)) {
      if (config._attributes) {
        this.rawAttributes = config._attributes;
      }

      if (config._operation) {
        this.addOperation(config._operation);
      }

      if (config._position) {
        this.addPosition(config._position);
      }
    }
  }

  public getValueFromJSON(config: JSONConfigNode) {
    if (typeof config === 'object' && config && hasAttributes(config)) {
      return config._value;
    } else {
      return config;
    }
  }

  public get customAttributes() {
    return this.rawAttributes.reduce((acc, { name, value }) => (acc.set(name, value), acc), new Map());
  }

  public get hasAttributes() {
    return this.rawAttributes.length > 0;
  }

  public addOperation(operation: NetconfOperation) {
    this.rawAttributes.push(mapOperationToAttribute(operation));
  }

  public addPosition(position: Position) {
    if (this.model instanceof List || this.model instanceof LeafList) {
      this.rawAttributes = [...this.rawAttributes, ...mapPositionToAttributes(position, this.model)];
    } else {
      throw new Error('Position attributes can only be added to lists or leaf lists.');
    }
  }
}
