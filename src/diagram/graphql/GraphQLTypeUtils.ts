import {
  GraphQLNamedType,
  GraphQLType,
  isListType,
  isNamedType,
  isNonNullType,
} from 'graphql/type';

/**
 * Display a type, if it's nonnullable, add "!" on the right, if it's list, surround with "[]"
 * 
 * @param type 
 * @returns A GraphQL type, usually a named type, or type wrapped around named type
 */
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

