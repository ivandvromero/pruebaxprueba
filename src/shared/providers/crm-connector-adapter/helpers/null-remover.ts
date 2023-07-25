import { NaturalPersonInterface } from '../../../../client/common/interfaces';

export function nullRemover(naturalPerson: NaturalPersonInterface) {
  for (const prop in naturalPerson) {
    if (naturalPerson[prop] === 'null' || naturalPerson[prop] === null) {
      naturalPerson[prop] = '';
    } else if (typeof naturalPerson[prop] === 'object') {
      naturalPerson[prop] = nullRemover(naturalPerson[prop]);
    }
  }
  return naturalPerson;
}
