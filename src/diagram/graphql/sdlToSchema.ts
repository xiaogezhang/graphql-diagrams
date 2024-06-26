import { GraphQLError, GraphQLSchema } from 'graphql';
import {parse} from 'graphql/language';
import {buildSchema} from 'graphql/utilities';
import {KnownDirectivesRule} from 'graphql/validation/rules/KnownDirectivesRule';
import {specifiedSDLRules} from 'graphql/validation/specifiedRules';
import {validateSDL} from 'graphql/validation/validate';

const validationRules = specifiedSDLRules.filter(
  // Many consumes/produces SDL files with custom directives and without defining them.
  // This practice is contradict spec but is very widespread at the same time.
  (rule) => rule !== KnownDirectivesRule,
);

export function sdlToSchema(sdl: string): {schema?: GraphQLSchema, errors: ReadonlyArray<GraphQLError>} {
  try {
    const documentAST = parse(sdl);
    const errors = validateSDL(documentAST, null, validationRules);

    return errors.length === 0 ? {schema: buildSchema(sdl, {assumeValidSDL: true}), errors: []} : {errors: errors};
  } catch (error) {
    const errors: GraphQLError[] = [];
    if (error instanceof GraphQLError) {
      errors.push(error);
    } else if (error instanceof Error) {
      errors.push(new GraphQLError(error.message));
    }
    return {errors: errors};
  }
}
