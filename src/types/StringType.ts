import YinElement from '../util/YinElement';
import applyMixins from '../util/applyMixins';
import BuiltInType, { enumValueOf } from '../enum/BuiltInType';

import Range from './Range';
import { Named, StringSerialize, WithCustomProperties } from './mixins';

const TYPE = BuiltInType.string;

export default class StringType implements Named, StringSerialize, WithCustomProperties {
  public static matches(typeName: string) {
    return enumValueOf(typeName) === TYPE;
  }

  public addNamedProps: Named['addNamedProps'];
  public serialize: StringSerialize['serialize'];
  public type: Named['type'];

  public pattern: string;
  public length: Range;

  public addCustomProperties: WithCustomProperties['addCustomProperties'];
  public otherProps: WithCustomProperties['otherProps'];

  constructor(el: YinElement) {
    this.addNamedProps(el);
    this.parseType(el);
  }

  public parseType(el: YinElement) {
    const lengthEl = el.findChild('length');
    const patternEl = el.findChild('pattern');

    if (lengthEl) {
      this.length = new Range(lengthEl);
    }

    if (patternEl) {
      this.pattern = patternEl.value!;
    }

    this.addCustomProperties(el, ['length', 'pattern']);
  }
}

applyMixins(StringType, [Named, StringSerialize, WithCustomProperties]);
