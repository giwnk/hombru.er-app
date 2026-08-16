"use client";

import { LogBrewList } from "@/features/log-brews/components/LogBrewList";

export default function BrewsPage() {
  return (
    <div className="w-full space-y-6">
      <LogBrewList />
    </div>
  );
}
