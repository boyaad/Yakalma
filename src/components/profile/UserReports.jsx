import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Flag } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { getUserReports } from "../../services/reportService";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

const statusConfig = {
  en_cours: {
    label: "🟡 En cours",
    variant: "pending",
  },
  open: {
    label: "🟡 En cours",
    variant: "pending",
  },
  investigating: {
    label: "🟡 En cours",
    variant: "pending",
  },
  resolu: {
    label: "🟢 Résolu",
    variant: "success",
  },
  resolved: {
    label: "🟢 Résolu",
    variant: "success",
  },
  ferme: {
    label: "🔴 Fermé",
    variant: "danger",
  },
  closed: {
    label: "🔴 Fermé",
    variant: "danger",
  },
};

function getStatusInfo(status) {
  return statusConfig[status?.toLowerCase()] || statusConfig.en_cours;
}

function ReportDetails({ report }) {
  const statusInfo = getStatusInfo(report.status);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Objet
        </p>
        <p className="mt-1 font-semibold text-foreground">{report.subject}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </p>
        <p className="mt-1 leading-relaxed text-foreground/80">
          {report.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Date
          </p>
          <p className="mt-1 font-medium text-foreground">{report.date}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Statut
          </p>
          <Badge
            variant={statusInfo.variant}
            className="mt-2 normal-case tracking-normal"
          >
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="rounded-xl bg-background-warm p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Réponse de Yakalma
        </p>
        <p className="mt-2 leading-relaxed text-foreground/80">
          {report.response || "Aucune réponse pour le moment."}
        </p>
      </div>
    </div>
  );
}

export function UserReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      if (!user) return;

      try {
        setIsLoading(true);
        const data = await getUserReports(user.id);

        if (isMounted) {
          setReports(data);
        }
      } catch (error) {
        toast.error(
          error.message || "Impossible de charger vos signalements.",
        );

        if (isMounted) {
          setReports([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Mes signalements</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Suivez l'état de vos demandes envoyées à Yakalma.
          </p>
        </div>
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border-warm py-14">
          <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin-custom" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Mes signalements</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivez l'état de vos demandes envoyées à Yakalma.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-warm bg-background-warm px-5 py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Flag className="h-8 w-8" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold">
            Vous n'avez effectué aucun signalement.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Si un problème survient avec un plat ou un vendeur, vos demandes
            apparaîtront ici.
          </p>
          <Button to="/plats" className="mt-6">
            Retour au catalogue
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const statusInfo = getStatusInfo(report.status);

            return (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedReport(report)}
                className="w-full rounded-xl border border-border-warm bg-background-warm p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <AlertCircle className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {report.type}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {report.target}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {report.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <Badge
                      variant={statusInfo.variant}
                      className="normal-case tracking-normal"
                    >
                      {statusInfo.label}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Détails
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Détail du signalement"
        size="lg"
      >
        {selectedReport && <ReportDetails report={selectedReport} />}
      </Modal>
    </section>
  );
}
