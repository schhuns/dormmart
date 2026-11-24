import React from "react";
import { useLocation } from "react-router-dom";

export const StaticPage = () => {
  const { pathname } = useLocation();

  if (pathname === "/about") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">About Dorm Mart</h1>
        <p className="text-slate-600 leading-relaxed text-sm">
          Dorm Mart is a community-driven marketplace built specifically for students and residents living in dormitories. Our platform makes it simple and secure to find second-hand items, textbooks, electronics, and dorm essentials directly from neighbors.
        </p>
        <p className="text-slate-600 leading-relaxed text-sm">
          Unlike commercial platforms, Dorm Mart does not charge transaction fees or commissions. Users communicate directly and arrange exchanges independently.
        </p>
      </div>
    );
  }

  if (pathname === "/guidelines") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Community Guidelines</h1>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
          <li>Always meet in a well-lit, public community area such as the building lobby or entrance.</li>
          <li>Never list prohibited, illegal, or dangerous items (e.g. weapons, drugs, hazardous materials).</li>
          <li>Be respectful and honest in descriptions and communications.</li>
          <li>Inspect items in person before completing any exchange.</li>
        </ul>
      </div>
    );
  }

  if (pathname === "/privacy") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-slate-600 leading-relaxed text-sm">
          Dorm Mart is designed with strict privacy principles. We never collect or store student identification numbers, academic records, university cards, or private room numbers.
        </p>
        <p className="text-slate-600 leading-relaxed text-sm">
          Your Gmail address is never shared publicly. External contact handles (Zalo, Telegram, Messenger) are only revealed when a buyer intentionally chooses to contact you.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>
      <p className="text-slate-600 leading-relaxed text-sm">
        Dorm Mart acts solely as a product listing and discovery platform. We are not a party to any transactions between users and do not hold funds or handle delivery.
      </p>
    </div>
  );
};
