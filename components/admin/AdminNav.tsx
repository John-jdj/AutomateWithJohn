"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Users,
  Contact,
  Mail,
  Newspaper,
  Star,
  Images,
  UserCog,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard, exact: true },
  { href: "/admin/portfolio", label: "Projects", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Contact },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/blog", label: "Blogs", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/users", label: "Users & Roles", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {navItems.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
