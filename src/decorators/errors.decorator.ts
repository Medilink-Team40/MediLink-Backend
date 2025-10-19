export function CatchError(errorHandler?: (error: any) => any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        if (result && typeof result.catch === 'function') {
          return result.catch((error: any) => {
            if (errorHandler) {
              return errorHandler(error);
            }
            console.error(`Error asíncrono en ${propertyKey}:`, error);
            throw error;  
          });
        }

        return result;
      } catch (error) {
        console.error(`Error síncrono en ${propertyKey}:`, error);
        return 'Error inesperado';
      }
    };

    return descriptor;
  };
}
