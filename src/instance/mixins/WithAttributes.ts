import { Element } from 'libxmljs';
import * as _ from 'lodash';

import { IAttribute, JSONWithAttributes, JSONWithoutAttributes, NetconfOperation, Position } from '../types';
import UnreachableCaseError from '../../util/unreachableCaseError';
import { defineNamespaceSafe } from '../../util/xmlUtil';

function jsonHasAttributes(configJSON: JSONWithAttributes | JSONWithoutAttributes): configJSON is JSONWithAttributes {
  return _.isPlainObject(configJSON) && '_value' in (configJSON as object);
}

function mapOperationToAttribute(operation: NetconfOperation): IAttribute {
  switch (operation) {
    case 'delete':
    case 'merge':
    case 'replace':
    case 'remove':
    case 'create': {
      return {
        name: 'operation',
        value: operation,
        prefix: 'xc',
        href: 'urn:ietf:params:xml:ns:netconf:base:1.0'
      };
    }
    default: {
      throw new UnreachableCaseError(operation);
    }
  }
}

function mapPoitionToAttributes(position: Position): IAttribute[] {
  return [
    {
      name: 'insert',
      value: position.insert,
      prefix: 'yang',
      href: 'urn:ietf:params:xml:ns:yang:1'
    },
    {
      name: 'value',
      value: position.value,
      prefix: 'yang',
      href: 'urn:ietf:params:xml:ns:yang:1'
    }
  ];
}

export default class WithAttributes {
  public rawAttributes: IAttribute[];

  public parseAttributesFromXML(config: Element) {
    this.rawAttributes = config.attrs().reduce((acc, attr) => {
      acc.push({
        name: attr.name(),
        value: attr.value(),
        prefix: attr.namespace()?.prefix(),
        href: attr.namespace()?.href()
      });

      return acc;
    }, []);
  }

  public parseAttributesFromJSON(config: JSONWithAttributes | JSONWithoutAttributes) {
    this.rawAttributes = [];

    if (jsonHasAttributes(config)) {
      if (config._attributes) {
        this.rawAttributes = config._attributes;
      }

      if (config._operation) {
        this.rawAttributes.push(mapOperationToAttribute(config._operation));
      }

      if (config._position) {
        this.rawAttributes = [...this.rawAttributes, ...mapPoitionToAttributes(config._position)];
      }
    }
  }

  public getValueFromJSON(config: JSONWithAttributes | JSONWithoutAttributes) {
    if (jsonHasAttributes(config)) {
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

  public addAttributes(el: Element) {
    this.rawAttributes.forEach(({ name, value, prefix, href }) => {
      if (prefix && href) {
        defineNamespaceSafe(el, prefix, href);
        el.attr({ [`${prefix}:${name}`]: value });
      } else {
        el.attr({ [name]: value });
      }
    });
  }
}
