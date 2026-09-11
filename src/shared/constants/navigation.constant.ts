import {
  BookOpen,
  Coffee,
  LayoutDashboard,
  LucideIcon,
  Receipt,
  Workflow,
  Wrench,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

export interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const MAIN_NAV_ITEMS: NavGroup[] = [
  {
    groupLabel: "Menu Utama",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        description: "Ringkasan & aktivitas seduhan kopi",
      },
      {
        title: "Jurnal Seduhan",
        url: "/brews",
        icon: BookOpen,
        description: "Catatan resep, rasio & profil rasa seduhan",
      },
      {
        title: "Resep Seduh",
        url: "/recipes",
        icon: Receipt,
        description: "Racikan takaran bahan & instruksi seduhan",
      },
    ],
  },
  {
    groupLabel: "Koleksi & Inventaris",
    items: [
      {
        title: "Biji Kopi & Roastery",
        url: "/collections",
        icon: Coffee,
        description: "Katalog biji kopi & roastery favorit",
      },
      {
        title: "Alat & Kalibrasi",
        url: "/tools",
        icon: Wrench,
        description: "Inventaris alat & setting gilingan",
      },
      {
        title: "Metode Penuangan",
        url: "/pouring-methods",
        icon: Workflow,
        description: "Teknik & interval penuangan air",
      },
    ],
  },
];
