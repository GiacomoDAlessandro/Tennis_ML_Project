"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const titleHref = pathname === "/why" ? "/" : "/why";

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
        <Link
          href={titleHref}
          className="text-base font-semibold tracking-tight text-zinc-900 transition-opacity hover:opacity-70"
        >
          Tennis Visualizer
        </Link>
      </div>
    </header>
  );
}
