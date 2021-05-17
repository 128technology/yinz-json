import YinElement from '../../util/YinElement';
import { Identities } from '../../model';
import { Type } from '../';
import {
  BinaryType,
  BitsType,
  BooleanType,
  DecimalType,
  DerivedType,
  EmptyType,
  EnumerationType,
  IdentityRefType,
  InstanceIdentifierType,
  IntegerType,
  LeafRefType,
  StringType,
  UnionType
} from '../';

type IConstructable = new (el: YinElement, identities: Identities) => Type;

function getTypeConstructor(typeName: string): IConstructable {
  const TYPE_REGISTRY = [
    BinaryType,
    BitsType,
    BooleanType,
    DecimalType,
    DerivedType,
    EmptyType,
    EnumerationType,
    IdentityRefType,
    InstanceIdentifierType,
    IntegerType,
    LeafRefType,
    StringType,
    UnionType
  ];

  const match = TYPE_REGISTRY.find(typeDef => typeDef.matches(typeName));

  if (!match) {
    throw new Error(`Type constructor not found for ${typeName}`);
  }

  return match;
}

export default class TypeParser {
  public static parse(typeEl: YinElement, identities: Identities): Type {
    const typeName = typeEl.name!;
    const MatchedType = getTypeConstructor(typeName);

    return new MatchedType(typeEl, identities);
  }
}
