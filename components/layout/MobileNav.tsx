"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/lib/data/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>AutomateWithJohn</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {mainNav.map((item) => (
            <SheetClose
              key={item.href}
              render={<Link href={item.href} />}
              nativeButton={false}
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          <SheetClose
            render={<Link href="/contact" />}
            nativeButton={false}
            className={buttonVariants({ className: "w-full" })}
          >
            Get in touch
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
