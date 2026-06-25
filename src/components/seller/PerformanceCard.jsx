import { useSeller } from "../../context/SellerInfoContext";

function parsePrepTimeToMinutes(prepTime) {
  if (!prepTime) return 0;
  const match = String(prepTime).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function PerformanceCard() {
  const { plats, commandes } = useSeller();

  const deliveredOrders = (commandes ?? []).filter((order) =>
    ["livre", "ready", "delivered", "completed"].includes(order.order_status),
  );

  const totalRevenue = deliveredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  const allReviews = (plats ?? []).flatMap((plat) => plat.avis ?? []);
  const averageRating = allReviews.length
    ? allReviews.reduce((sum, review) => sum + Number(review.note || 0), 0) /
      allReviews.length
    : 0;

  const prepTimes = (plats ?? [])
    .map((plat) => parsePrepTimeToMinutes(plat.prepTime))
    .filter((minutes) => minutes > 0);
  const averagePrepTime = prepTimes.length
    ? Math.round(prepTimes.reduce((sum, minutes) => sum + minutes, 0) / prepTimes.length)
    : 0;

  const satisfactionPercent = Math.min(100, Math.round((averageRating / 5) * 100));
  const prepTimePercent = Math.min(100, Math.round((averagePrepTime / 60) * 100));
  const salesGoal = 200000;
  const revenueProgress = salesGoal > 0 ? Math.min(100, Math.round((totalRevenue / salesGoal) * 100)) : 0;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Performance ce mois
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Taux de satisfaction</span>
            <span className="text-sm font-bold">{satisfactionPercent}%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${satisfactionPercent}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Temps de préparation</span>
            <span className="text-sm font-bold">
              {averagePrepTime > 0 ? `${averagePrepTime} min` : "N/A"}
            </span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${prepTimePercent}%` }}
            ></div>
          </div>
        </div>
        <div className="pt-2 border-t border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Objectif mensuel</span>
            <span className="font-bold text-primary">{revenueProgress} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
