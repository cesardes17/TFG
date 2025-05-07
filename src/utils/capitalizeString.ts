/**
 * Capitaliza solamente la primera letra de la cadena
 */
export function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
/**
 * Capitaliza la primera letra de cada palabra en la cadena
 */
export function titleCase(s: string): string {
  return s
    .split(' ')
    .map((word) => capitalizeFirst(word))
    .join(' ');
}
