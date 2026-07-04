import { CheckCircle } from "lucide-react";

export function FeatureCard({ title, description }) {
  return (
    <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
      <div>
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-sm text-white/80">{description}</div>
      </div>
    </div>
  );
}
