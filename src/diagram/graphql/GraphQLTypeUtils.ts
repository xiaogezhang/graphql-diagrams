import {
  GraphQLNamedType,
  GraphQLType,
  isListType,
  isNamedType,
  isNonNullType,
} from 'graphql/type';

export function typeDisplayName(type: GraphQLType): {
  left: string,
  right: string,
  baseType: GraphQLNamedType
} {
  if (isNamedType(type)) {
    return {left: '', right: '', baseType: type};
  }
  const inner = typeDisplayName(type.ofType);
  if (isNonNullType(type)) {
    return {left: inner.left, right: inner.right + '!', baseType: inner.baseType};
  }
  if (isListType(type)) {
    return {left: '[' + inner.left, right: inner.right + ']', baseType: inner.baseType};
  }
  throw Error('Unreachable code!'); 
}

