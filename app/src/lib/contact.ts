export const CONTACT_PHONE_DISPLAY = '320 586 5823';
export const CONTACT_PHONE_TEL = '+573205865823';
export const WHATSAPP_PHONE = '573205865823';

export function getWhatsAppUrl(message = 'Hola PanelArt 3D, quiero cotizar un proyecto en Cartagena de Indias.') {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
