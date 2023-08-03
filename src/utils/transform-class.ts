// Funcion que agrupa todos los errores generados por validate class-validator
export const mapErrorChildren = (errors, allConstraint = []): Array<any> => {
  if (errors.length) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        const element = errors[key];
        if (element.constraints) {
          allConstraint.push(element.constraints);
        }
        mapErrorChildren(element.children, allConstraint);
      }
    }
  }
  return allConstraint;
};
