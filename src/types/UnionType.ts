import YinElement from '../util/YinElement';
import applyMixins from '../util/applyMixins';
import BuiltInType, { enumValueOf } from '../enum/BuiltInType';
import { Identities } from '../model';

import TypeParser from './util/TypeParser';
import { Named, RequiredField, StringSerialize, Traversable, WithCustomProperties } from './mixins';
import { Type } from './';

const TYPE = BuiltInType.union;

export default class UnionType implements Named, RequiredField, StringSerialize, Traversable, WithCustomProperties {
  public static matches(typeName: string) {
    return enumValueOf(typeName) === TYPE;
  }

  public addNamedProps: Named['addNamedProps'];
  public serialize: StringSerialize['serialize'];
  public traverse: Traversable['traverse'];
  public type: Named['type'];
  public validateRequiredFields: RequiredField['validateRequiredFields'];

  public types: Type[];

  public addCustomProperties: WithCustomProperties['addCustomProperties'];
  public otherProps: WithCustomProperties['otherProps'];

  constructor(el: YinElement, identities: Identities) {
    this.addNamedProps(el);
    this.validateRequiredFields(el, ['type'], this.type);
    this.parseType(el, identities);
  }

  public parseType(el: YinElement, identities: Identities) {
    this.types = el.findChildren('type').map(typeEl => TypeParser.parse(typeEl, identities));
    this.addCustomProperties(el, ['type']);
  }

  public childTypes(): Type[] {
    const result = [];
    // Return types in reverse order. Eventually they will be popped off a stack in original order.
    for (let i = this.types.length; i > 0; i--) {
      result.push(this.types[i - 1]);
    }
    return result;
  }
}

applyMixins(UnionType, [Named, RequiredField, StringSerialize, Traversable, WithCustomProperties]);
