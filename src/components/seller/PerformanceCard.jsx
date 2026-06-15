export function PerformanceCard() {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Performance ce mois
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Taux de satisfaction</span>
            <span className="text-sm font-bold">96%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: "96%" }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Temps de préparation</span>
            <span className="text-sm font-bold">22 min</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: "78%" }}
            ></div>
          </div>
        </div>
        <div className="pt-2 border-t border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Objectif mensuel</span>
            <span className="font-bold text-primary">87 / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
