import axios, { AxiosError } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

export function CatchError(errorHandler?: (error: any) => any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('🚀 ~ CatchError ~ error:', error);
          const err = error;
          const status = err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = err.response?.data?.message || err.message || 'Error en Axios';
          console.error(`❌ Axios error (${status}):`, message);

          throw new HttpException(message, status);
        }

        if (error instanceof HttpException) {
          throw error;
        }

        console.error('❌ Error inesperado:', error);
        if (errorHandler) {
          throw errorHandler(error);
        }

        throw new HttpException('Error inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    };

    return descriptor;
  };
}
