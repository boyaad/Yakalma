import { useState } from "react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getStatusInfo } from "./adminStatus";

const statusActions = [
  { status: "investigating", label: "En cours", variant: "warning" },
  { status: "resolved", label: "Résoudre", variant: "success" },
  { status: "closed", label: "Fermer", variant: "error" },
];

export default function ReportDetailModal({ report, isOpen, onClose, onUpdateStatus, actionLoading }) {
  const [responseText, setResponseText] = useState("");

  if (!report) return null;

  const statusInfo = getStatusInfo(report.status);
  const isTerminal = report.status === "resolved" || report.status === "closed";

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(report.id, newStatus, responseText || undefined);
    setResponseText("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Signalement #${report.id}`} size="xl">
      <div className="space-y-6 overflow-y-auto pr-1">
        <Section title="Signalement">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <DetailRow label="Date" value={report.date} />
            <DetailRow label="Type">
              <Badge variant="muted" className="normal-case tracking-normal">
                {report.targetType}
              </Badge>
            </DetailRow>
            <DetailRow label="Statut">
              <Badge variant={statusInfo.variant} className="normal-case tracking-normal">
                {statusInfo.text}
              </Badge>
            </DetailRow>
            <DetailRow label="Objet" value={report.reason} span />
          </div>
          {report.description && (
            <div className="mt-3 p-4 bg-muted/30 rounded-lg text-sm">
              <p className="text-muted-foreground text-xs font-semibold mb-1">Description</p>
              <p className="text-foreground whitespace-pre-wrap">{report.description}</p>
            </div>
          )}
        </Section>

        <Section title="Signalé par">
          <div className="flex min-w-0 items-center gap-3 rounded-lg bg-muted/30 p-4">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 text-base">
              {report.reporter?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <div className="break-words font-semibold">{report.reporter}</div>
              {report.reporterId && (
                <div className="text-xs text-muted-foreground mt-0.5">ID: {report.reporterId}</div>
              )}
            </div>
          </div>
        </Section>

        <Section title="Élément concerné">
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex flex-col gap-1 text-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-2">
              <span className="font-medium text-muted-foreground min-[420px]:min-w-[80px]">Type :</span>
              <span>{report.targetType || "Non spécifié"}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-2">
              <span className="font-medium text-muted-foreground min-[420px]:min-w-[80px]">Cible :</span>
              <span className="break-words font-medium">{report.target}</span>
            </div>
            {report.sellerId && (
              <div className="text-xs text-muted-foreground">Vendeur ID: {report.sellerId}</div>
            )}
            {report.platId && (
              <div className="text-xs text-muted-foreground">Plat ID: {report.platId}</div>
            )}
          </div>
        </Section>

        <Section title="Réponse Yakalma">
          {report.response ? (
            <div className="p-4 bg-primary/5 rounded-lg text-sm">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Réponse envoyée</p>
              <p className="text-foreground whitespace-pre-wrap">{report.response}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">Aucune réponse pour le moment.</p>
          )}
          {!isTerminal && (
            <div className="mt-3">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Ajouter une réponse..."
                rows={3}
                className="w-full rounded-lg border border-border-warm bg-white p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
        </Section>

        {!isTerminal && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border-warm">
            {statusActions
              .filter((a) => a.status !== report.status)
              .map((action) => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleStatusChange(action.status)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "..." : action.label}
                </Button>
              ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-semibold text-base mb-3 text-foreground">{title}</h4>
      {children}
    </div>
  );
}

function DetailRow({ label, value, children, span = false }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-2 ${span ? "sm:col-span-2" : ""}`}>
      <span className="shrink-0 text-sm text-muted-foreground min-[420px]:min-w-[80px]">{label}</span>
      {children || <span className="break-words text-sm font-medium">{value}</span>}
    </div>
  );
}
