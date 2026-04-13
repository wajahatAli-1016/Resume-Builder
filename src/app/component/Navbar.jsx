"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    router.push("/login");
  };

  const linkClass =
    "block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600 sm:text-base";

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/dashboard"
          className="text-base font-bold text-indigo-600 sm:text-lg"
          onClick={() => setIsOpen(false)}
        >
          Resume Builder
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-2 md:flex lg:gap-4">
          <li><Link href="/dashboard" className={linkClass}>Home</Link></li>
          <li><Link href="/resume/new" className={linkClass}>Create Resume</Link></li>
          <li><Link href="/resume" className={linkClass}>Saved Resume</Link></li>
        </ul>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 md:inline-flex"
        >
          Logout
        </button>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link href="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/resume/new" className={linkClass} onClick={() => setIsOpen(false)}>
                Create Resume
              </Link>
            </li>
            <li>
              <Link href="/resume" className={linkClass} onClick={() => setIsOpen(false)}>
                Saved Resume
              </Link>
            </li>
          </ul>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}