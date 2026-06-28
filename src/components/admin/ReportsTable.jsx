import { Eye, CheckCircle, Loader2 } from "lucide-react";
import Badge from "../ui/Badge";
import { getStatusInfo } from "./adminStatus";

export default function ReportsTable({ reports, onView, onResolve, actionLoading }) {
  return (
    <div className="bg-white rounded-xl border border-border-warm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-warm bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Signalé par</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground max-md:hidden">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground max-lg:hidden">Concernant</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground max-xl:hidden">Objet</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Statut</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground max-sm:hidden">Date</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-warm">
            {reports.map((report) => {
              const statusInfo = getStatusInfo(report.status);
              const isResolved = report.status === "resolved" || report.status === "closed";
              return (
                <tr key={report.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">
                    #{report.id}
                  </td>
                  <td className="px-4 py-3 font-medium truncate max-w-[140px]">
                    {report.reporter}
                  </td>
                  <td className="px-4 py-3 max-md:hidden">
                    <Badge variant="muted" className="normal-case tracking-normal text-xs">
                      {report.targetType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 truncate max-w-[160px] max-lg:hidden">
                    {report.target}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[200px] max-xl:hidden text-muted-foreground">
                    {report.reason}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={statusInfo.variant}
                      className="normal-case tracking-normal text-xs"
                    >
                      {statusInfo.text}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-sm:hidden">
                    {report.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(report)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!isResolved && (
                        <button
                          onClick={() => onResolve(report)}
                          disabled={actionLoading}
                          className="p-2 text-success hover:bg-success/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Résoudre"
                        >
                          {actionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {reports.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">Aucun signalement trouvé.</div>
      )}
    </div>
  );
}
