import { RecipePayload } from './template.types';
import { TemplateOutput } from './templates.registry';

export const medicalRecipeTemplate = (data: RecipePayload): TemplateOutput => ({
  subject: `Receta Médica para ${data.patientName}`,
  message: `Estimado ${data.patientName}, el Dr. ${data.doctorName} ha emitido una receta médica para usted. Detalles: ${data.recipeDetails}`,
  text: `Estimado ${data.patientName}, el Dr. ${data.doctorName} ha emitido una receta médica para usted. Detalles: ${data.recipeDetails}`,
  html: `
    <p>Estimado ${data.patientName},</p>
    <p>El Dr. ${data.doctorName} ha emitido una receta médica para usted.</p>
    <p><strong>Detalles de la Receta:</strong></p>
    <p>${data.recipeDetails}</p>
    <p>Por favor, siga las indicaciones de su médico.</p>
    <p>Saludos cordiales,</p>
    <p>El equipo de MediLink</p>
  `,
});
