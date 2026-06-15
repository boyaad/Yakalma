import { AlertCircle, CheckCircle } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getPriorityClassName, getStatusInfo } from "./adminStatus";

export function ReportCard({ report }) {
  const statusInfo = getStatusInfo(report.status);

  return (
    <div
      className={`rounded-xl p-4 hover:shadow-md transition-all ${getPriorityClassName(
        report.priority
      )}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <div className="font-bold text-sm">#{report.id}</div>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <ReportLine label="Signalé par" value={report.reporter} />
        <ReportLine label="Concernant" value={report.reported} />
        <ReportLine label="Raison" value={report.reason} />
        <div className="text-xs text-muted-foreground">{report.date}</div>
      </div>

      <div className="flex gap-2 pt-3">
        <Button variant="secondary" size="sm" className="flex-1 px-3">
          Voir détails
        </Button>
        {report.status !== "resolved" && (
          <Button variant="primary" size="sm" className="flex-1 px-3">
            <CheckCircle className="w-3.5 h-3.5" />
            Résoudre
          </Button>
        )}
      </div>
    </div>
  );
}

function ReportLine({ label, value }) {
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}
