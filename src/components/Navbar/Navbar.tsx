"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const landingPages = [
  "/",
  "/space",
  "/our-unique-experience",
  "/updates",
  "/contact",
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const ifWhiteColorNav = landingPages.includes(pathname);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/space", label: "Space" },
    { href: "/our-unique-experience", label: "Our Unique Experience" },
    // { href: "/updates", label: "Updates" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full py-[30px] px-4 md:px-8 lg:px-12 z-50">
      <div className="flex items-center justify-between container mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-14 w-14 md:h-24 md:w-24">
            <Image
              src="/img/logo.png"
              alt="Social Chamber"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-poppins text-base font-normal leading-[120%] tracking-[0%] transition-colors ${
                pathname === link.href
                  ? "text-[#FF6900] "
                  : ifWhiteColorNav
                    ? "text-white hover:text-[#FF6900]"
                    : "hover:text-[#FF6900] text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Reserve Button */}
        <Link
          href="/booking"
          className="font-poppins hidden lg:flex items-center justify-center bg-[#FCB900] hover:bg-[#FF6900] text-black hover:text-white font-medium leading-[120%] py-3 px-6 rounded-[8px] transition-colors"
        >
          Reserve Now
        </Link>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden   ${pathname === '/booking' ? 'text-black' : 'text-white'}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0a14]/95 backdrop-blur-sm pt-20 px-4">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-poppins text-base font-normal leading-[120%] tracking-[0%] ${
                  pathname === link.href
                    ? "text-[#FF6900]"
                    : "text-white hover:text-[#FF6900]"
                }`}
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="font-poppins flex   items-center justify-center bg-[#FCB900] hover:bg-[#FF6900] text-black hover:text-white font-medium leading-[120%] py-4 px-8 rounded-[8px] transition-colors mt-4"
              onClick={toggleMenu}
            >
              Reserve Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
