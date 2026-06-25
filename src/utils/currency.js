export function formatFcfa(amount) {
  const value = Number(amount) || 0;
  return `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
}
