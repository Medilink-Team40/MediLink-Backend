import { HttpException, HttpStatus } from '@nestjs/common';
import {
  QueryFailedError,
  TypeORMError,
  EntityPropertyNotFoundError,
  OptimisticLockVersionMismatchError,
} from 'typeorm';

/**
 * Interfaz para errores de QueryFailedError de TypeORM
 */
interface QueryError extends QueryFailedError {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

/**
 * Códigos de error comunes de PostgreSQL
 */
export enum PostgresErrorCode {
  // Class 23 — Integrity Constraint Violation
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  NOT_NULL_VIOLATION = '23502',
  CHECK_VIOLATION = '23514',

  // Class 42 — Syntax Error or Access Rule Violation
  TABLE_NOT_FOUND = '42P01',

  // Class 08 — Connection Exception
  CONNECTION_FAILURE = '08006',

  // Class 23 — Invalid Transaction State
  DEADLOCK_DETECTED = '40P01',
}

/**
 * Maneja errores de TypeORM y los convierte en HttpExceptions apropiadas
 *
 * @param error - El error capturado
 * @param customMessages - Mensajes personalizados por código de error
 * @returns HttpException
 * @throws El error original si no es un error de TypeORM
 */
export function handleTypeOrmError(
  error: unknown,
  customMessages?: Partial<Record<PostgresErrorCode | string, string>>,
): HttpException {
  // Error de consulta SQL fallida (QueryFailedError)
  if (error instanceof QueryFailedError) {
    const queryError = error as QueryError;
    const code = queryError.code;

    console.error('🔴 Error de consulta SQL:', {
      code,
      detail: queryError.detail,
      constraint: queryError.constraint,
      table: queryError.table,
      column: queryError.column,
      message: error.message,
      query: queryError.query,
      parameters: queryError.parameters,
    });

    // Usar mensaje personalizado si existe, sino usar el mensaje por defecto
    const customMessage = code && customMessages?.[code];
    if (customMessage) {
      return new HttpException(customMessage, HttpStatus.BAD_REQUEST);
    }

    // Manejar diferentes códigos de error de PostgreSQL
    switch (code) {
      case PostgresErrorCode.UNIQUE_VIOLATION:
        return new HttpException(
          customMessage || `El registro ya existe. ${queryError.detail || ''}`,
          HttpStatus.CONFLICT,
        );

      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        return new HttpException(
          customMessage || `Error de referencia: ${queryError.detail || 'Registro relacionado no existe'}`,
          HttpStatus.BAD_REQUEST,
        );

      case PostgresErrorCode.NOT_NULL_VIOLATION:
        return new HttpException(
          customMessage || `Campo requerido faltante: ${queryError.constraint || queryError.column}`,
          HttpStatus.BAD_REQUEST,
        );

      case PostgresErrorCode.CHECK_VIOLATION:
        return new HttpException(
          customMessage || `Violación de restricción: ${queryError.detail || queryError.constraint}`,
          HttpStatus.BAD_REQUEST,
        );

      case PostgresErrorCode.TABLE_NOT_FOUND:
        return new HttpException('Tabla no encontrada en la base de datos', HttpStatus.INTERNAL_SERVER_ERROR);

      case PostgresErrorCode.CONNECTION_FAILURE:
        return new HttpException('Error de conexión a la base de datos', HttpStatus.INTERNAL_SERVER_ERROR);

      case PostgresErrorCode.DEADLOCK_DETECTED:
        return new HttpException(
          'Conflicto de transacción detectado. Por favor, intenta nuevamente.',
          HttpStatus.CONFLICT,
        );

      default:
        return new HttpException(`Error de base de datos: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Error de propiedad no encontrada
  if (error instanceof EntityPropertyNotFoundError) {
    return new HttpException(`Propiedad no encontrada: ${error.message}`, HttpStatus.BAD_REQUEST);
  }

  // Error de lock optimista
  if (error instanceof OptimisticLockVersionMismatchError) {
    return new HttpException(
      'El registro ha sido modificado por otro usuario. Por favor, recarga la página.',
      HttpStatus.CONFLICT,
    );
  }

  // Otros errores de TypeORM
  if (error instanceof TypeORMError) {
    console.error('🔴 Error de TypeORM:', error.message);
    return new HttpException(`Error de base de datos: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // Si no es un error de TypeORM, devolverlo como HttpException genérico
  if (error instanceof HttpException) {
    return error;
  }

  // Si es otro tipo de error, crear una excepción genérica
  const message = error instanceof Error ? error.message : 'Error desconocido';
  return new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
}

/**
 * Extrae el código de error de PostgreSQL de un error de TypeORM
 *
 * @param error - El error capturado
 * @returns El código de error o undefined
 */
export function getPostgresErrorCode(error: unknown): string | undefined {
  if (error instanceof QueryFailedError) {
    const queryError = error as QueryError;
    return queryError.code;
  }
  return undefined;
}

/**
 * Verifica si un error es de un código específico
 *
 * @param error - El error capturado
 * @param code - El código de error a verificar
 * @returns true si el error es del código especificado
 */
export function isErrorCode(error: unknown, code: PostgresErrorCode | string): boolean {
  return getPostgresErrorCode(error) === code;
}
