export function getStatusInfo(status) {
  const statuses = {
    active: { text: "Actif", variant: "success" },
    suspended: { text: "Suspendu", variant: "error" },
    verified: { text: "Vérifié", variant: "success" },
    pending: { text: "En attente", variant: "warning" },
    delivered: { text: "Livré", variant: "success" },
    preparing: { text: "En préparation", variant: "warning" },
    open: { text: "Ouvert", variant: "error" },
    investigating: { text: "En cours", variant: "warning" },
    resolved: { text: "Résolu", variant: "success" },
  };

  return statuses[status] || statuses.active;
}

export function getPriorityClassName(priority) {
  const priorities = {
    high: "bg-orange-50",
    medium: "bg-amber-50",
    low: "bg-primary/5",
  };

  return priorities[priority] || priorities.low;
}
