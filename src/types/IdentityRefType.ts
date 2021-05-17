import YinElement from '../util/YinElement';
import applyMixins from '../util/applyMixins';
import BuiltInType, { enumValueOf } from '../enum/BuiltInType';
import { Identities } from '../model';

import { Named, RequiredField, StringSerialize, WithCustomProperties } from './mixins';

const TYPE = BuiltInType.identityref;

export default class IdentityRefType implements Named, StringSerialize, RequiredField, WithCustomProperties {
  public static matches(typeName: string) {
    return enumValueOf(typeName) === TYPE;
  }

  public addNamedProps: Named['addNamedProps'];
  public serialize: StringSerialize['serialize'];
  public type: Named['type'];
  public validateRequiredFields: RequiredField['validateRequiredFields'];

  public options: string[];

  public addCustomProperties: WithCustomProperties['addCustomProperties'];
  public otherProps: WithCustomProperties['otherProps'];

  constructor(el: YinElement, identities: Identities) {
    this.addNamedProps(el);
    this.validateRequiredFields(el, ['base'], this.type);
    this.parseType(el, identities);
  }

  public parseType(el: YinElement, identities: Identities) {
    const splitVal = el.findChild('base')!.name!.split(':');
    const base = splitVal.length > 1 ? splitVal[1] : splitVal[0];

    this.options = identities.getOptions(base);

    this.addCustomProperties(el, ['base']);
  }
}

applyMixins(IdentityRefType, [Named, RequiredField, StringSerialize, WithCustomProperties]);
