export const CONTACT_PHONE_DISPLAY = '311 592 6597';
export const CONTACT_PHONE_TEL = '+573115926597';
export const WHATSAPP_PHONE = '573115926597';

export function getWhatsAppUrl(message = 'Hola PanelArt 3D, quiero cotizar un proyecto en Cartagena de Indias.') {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
