export enum PRACTITIONER_ERROR_CODES {
  ERROR_001 = '001',
  ERROR_23503 = '23503',
}

export const PRACTITIONER_ERROR: Record<PRACTITIONER_ERROR_CODES, string> = {
  [PRACTITIONER_ERROR_CODES.ERROR_001]: 'PR001: El email de registro no puede ser guardado como dato de contacto',
  [PRACTITIONER_ERROR_CODES.ERROR_23503]: 'PR002: Codigo de profesion invalido',
};
