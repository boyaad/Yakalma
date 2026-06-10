export function handleError(error) {
  console.error(error);

  return error?.message || "Une erreur est survenue";
}
