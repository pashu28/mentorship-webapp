import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Up to 2 mentor sessions/month",
      "AI Tutor (10 queries/day)",
      "Basic task tracking",
      "Resource Vault (limited)",
    ],
    cta: "Current Plan",
    current: true,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious learners",
    features: [
      "Unlimited mentor sessions",
      "AI Tutor (unlimited)",
      "Advanced task & goal tracking",
      "Full Resource Vault access",
      "Priority mentor matching",
      "Session recordings",
    ],
    cta: "Upgrade to Pro",
    current: false,
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "per month",
    description: "For cohorts and organizations",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team progress dashboard",
      "Dedicated account manager",
      "Custom mentor matching",
      "API access",
    ],
    cta: "Contact Sales",
    current: false,
    highlight: false,
  },
];

export default function SubscriptionTab() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="space-y-5">
      {/* Current plan banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 shrink-0">
            <i className="ri-vip-crown-line text-gray-500 text-lg" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">You&apos;re on the Free Plan</p>
            <p className="text-xs text-gray-400 mt-0.5">Upgrade to unlock unlimited sessions and AI features</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap">Free</span>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {(["monthly", "annual"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                billing === b ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {b === "monthly" ? "Monthly" : "Annual · Save 20%"}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl p-5 flex flex-col gap-4 relative ${
              plan.highlight
                ? "border-2 border-violet-400"
                : "border border-gray-100"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-600 text-white text-xs font-semibold whitespace-nowrap">
                Most Popular
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{plan.description}</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {billing === "annual" && plan.price !== "$0"
                  ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                  : plan.price}
              </span>
              <span className="text-xs text-gray-400 ml-1">{plan.period}</span>
            </div>
            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-violet-500 text-sm" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                plan.current
                  ? "bg-gray-100 text-gray-500 cursor-default"
                  : plan.highlight
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={plan.current}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Usage */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">This Month&apos;s Usage</h3>
        {[
          { label: "Mentor Sessions",  used: 1, total: 2,   unit: "sessions" },
          { label: "AI Tutor Queries", used: 67, total: 300, unit: "queries" },
          { label: "Resource Vault",   used: 4, total: 10,  unit: "resources" },
        ].map((u) => (
          <div key={u.label}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-gray-700">{u.label}</p>
              <p className="text-xs text-gray-400">{u.used} / {u.total} {u.unit}</p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${Math.min((u.used / u.total) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
