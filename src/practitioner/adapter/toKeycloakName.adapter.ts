import { NameStruct } from '../../types/fhir.types';

export const toKeycloakName = (name: NameStruct[]) => {
  let lastName = '';
  let firstName = '';

  for (const element of name) {
    const { use, text, family } = element;
    lastName = family;
    firstName = family
      .split(' ')
      .reduce((acc, word) => (acc = acc.replaceAll(word, '')), text)
      .trim();

    if (use === 'usual' || use === 'official') {
      break;
    }
  }

  return { lastName, firstName };
};
