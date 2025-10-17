import { UrlPayload } from './template.types';
import { TemplateOutput } from './templates.registry';

export const examResultUrlTemplate = (data: UrlPayload): TemplateOutput => ({
  subject: 'Resultados de Examen Disponibles',
  message: `Estimado paciente, sus resultados de examen están disponibles. Puede verlos en el siguiente enlace: ${data.url}. ${data.description}`,
  text: `Estimado paciente, sus resultados de examen están disponibles. Puede verlos en el siguiente enlace: ${data.url}. ${data.description}`,
  html: `
    <p>Estimado paciente,</p>
    <p>Sus resultados de examen están disponibles. Puede verlos en el siguiente enlace:</p>
    <p><a href="${data.url}">${data.description || data.url}</a></p>
    <p>Saludos cordiales,</p>
    <p>El equipo de MediLink</p>
  `,
});
