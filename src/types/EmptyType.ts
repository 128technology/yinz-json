import YinElement from '../util/YinElement';
import applyMixins from '../util/applyMixins';
import BuiltInType, { enumValueOf } from '../enum/BuiltInType';
import { SerializationReturnType } from '../enum/SerializationType';

import { Named, WithCustomProperties } from './mixins';

const TYPE = BuiltInType.empty;

export default class EmptyType implements Named, WithCustomProperties {
  public static matches(typeName: string) {
    return enumValueOf(typeName) === TYPE;
  }

  public addNamedProps: Named['addNamedProps'];
  public type: Named['type'];
  public addCustomProperties: WithCustomProperties['addCustomProperties'];
  public otherProps: WithCustomProperties['otherProps'];

  constructor(el: YinElement) {
    this.addNamedProps(el);
    this.addCustomProperties(el);
  }

  public serialize(val: string): SerializationReturnType {
    return '';
  }
}

applyMixins(EmptyType, [Named, WithCustomProperties]);
