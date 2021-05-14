import * as _ from 'lodash';

import YinElement from '../util/YinElement';
import applyMixins from '../util/applyMixins';
import { enumValueOf } from '../enum/BuiltInType';
import { Identities } from '../model';
import { SerializationReturnType } from '../enum/SerializationType';

import TypeParser from './util/TypeParser';
import { Type, BuiltInType } from './';
import { Named, Traversable } from './mixins';

export default class DerivedType implements Named, Traversable {
  public static matches(typeName: string) {
    return enumValueOf(typeName) === null;
  }

  public addNamedProps: Named['addNamedProps'];
  public traverse: Traversable['traverse'];
  public type: Named['type'];

  public default: string;
  public units: string;
  public description?: string;
  public baseType: Type;
  public suggestionRefs: string[];

  constructor(el: YinElement, identities: Identities) {
    this.addNamedProps(el);
    const typeDefEl = el.findChild('typedef')!;

    this.parseBaseType(el, typeDefEl, identities);
    this.parseUnits(typeDefEl);
    this.parseDescription(typeDefEl);
    this.parseDefault(typeDefEl);
    this.parseSuggestionRef(typeDefEl);
  }

  public get builtInType(): BuiltInType {
    return this.baseType instanceof DerivedType ? this.baseType.builtInType : this.baseType;
  }

  public parseDefault(typeDefEl: YinElement) {
    const defaultEl = typeDefEl.findChild('default');

    if (defaultEl) {
      this.default = defaultEl.value!;
    } else if (this.baseType instanceof DerivedType && this.baseType.default) {
      this.default = this.baseType.default;
    }
  }

  public parseUnits(typeDefEl: YinElement) {
    const unitsEl = typeDefEl.findChild('units');

    if (unitsEl) {
      this.units = unitsEl.name!;
    }
  }

  public parseDescription(typeDefEl: YinElement) {
    const descriptionEl = typeDefEl.findChild('description');

    if (descriptionEl) {
      this.description = descriptionEl.text!;
    }
  }

  public parseBaseType(typeEl: YinElement, typeDefEl: YinElement, identities: Identities) {
    const baseTypeEl = _.clone(typeDefEl.findChild('type')!);

    // Really you only need to avoid typedef below, but a bug in yinsolidated
    // also copies the child type into the derived type in some cases.
    typeEl.children.forEach(child => {
      if (child.keyword !== 'typedef' && child.keyword !== 'type') {
        baseTypeEl.children.push(child);
      }
    });

    this.baseType = TypeParser.parse(baseTypeEl, identities);
  }

  public parseSuggestionRef(typeDefEl: YinElement) {
    const suggestionEl = typeDefEl.findChild('suggestionref');

    if (suggestionEl) {
      const text = suggestionEl.text;
      if (text) {
        const trimmed = text.trim();
        if (trimmed.length > 0) {
          this.suggestionRefs = trimmed.split(/\s+/);
        }
      }
    }
  }

  public serialize(val: string): SerializationReturnType {
    return this.baseType.serialize(val);
  }

  public childTypes(): Type[] {
    return [this.baseType];
  }
}

applyMixins(DerivedType, [Named, Traversable]);
