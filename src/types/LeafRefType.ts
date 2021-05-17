import YinElement from '../util/YinElement';
import applyMixins from '../util/applyMixins';
import BuiltInType, { enumValueOf } from '../enum/BuiltInType';
import { Identities } from '../model';
import { SerializationReturnType } from '../enum/SerializationType';

import TypeParser from './util/TypeParser';
import { Named, RequiredField, WithCustomProperties } from './mixins';
import { Type } from './';

const TYPE = BuiltInType.leafref;

export default class LeafRefType implements Named, RequiredField, WithCustomProperties {
  public static matches(typeName: string) {
    return enumValueOf(typeName) === TYPE;
  }

  public addNamedProps: Named['addNamedProps'];
  public type: Named['type'];
  public validateRequiredFields: RequiredField['validateRequiredFields'];

  public path: string;
  public refType: Type;

  public addCustomProperties: WithCustomProperties['addCustomProperties'];
  public otherProps: WithCustomProperties['otherProps'];

  constructor(el: YinElement, identities: Identities) {
    this.addNamedProps(el);
    this.validateRequiredFields(el, ['path'], this.type);
    this.parseType(el, identities);
  }

  public parseType(el: YinElement, identities: Identities) {
    const typeEl = el.findChild('type')!;
    this.refType = TypeParser.parse(typeEl, identities);
    this.path = el.findChild('path')!.value!;

    this.addCustomProperties(el, ['type', 'path']);
  }

  public serialize(val: string): SerializationReturnType {
    return this.refType.serialize(val);
  }
}

applyMixins(LeafRefType, [Named, RequiredField, WithCustomProperties]);
