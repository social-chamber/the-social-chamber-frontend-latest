import Link from "next/link";
import {  Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#191919]">
      <div className="container mx-auto py-[25px] md:py-[40px] lg:py-[60px]">
        <div className="flex flex-col md:flex-row justify-between items-center pb-[20px] md:pb-0">
          {/* Logo and brand */}

          <div className="relative">
            <Image
              src="/img/logo.png"
              alt="Social Chamber"
              width={120}
              height={120}
              className="w-full h-[120px] object-cover"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-0 font-poppins text-sm text-white font-medium leading-[120%] tracking-[0%]">
            <Link href="#" className="hover:text-[#ff6b00] transition-colors">
              Couples
            </Link>
            <Link href="#" className="hover:text-[#ff6b00] transition-colors">
              Individual
            </Link>
            <Link href="#" className="hover:text-[#ff6b00] transition-colors">
              Group
            </Link>
            <Link href="#" className="hover:text-[#ff6b00] transition-colors">
              Our Unique Experience
            </Link>
            <Link href="/privacy" className="hover:text-[#ff6b00] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-condition" className="hover:text-[#ff6b00] transition-colors">
              Terms & Conditions
            </Link>
          </nav>

          {/* Social icons */}
       {/* Social icons */}
       <div className="flex gap-4">
        <Link

        target="blank"
          href="https://www.instagram.com/thesocialchamber_sg/reel/DFR8Au2TJZc/?api=1%2F&hl=zh-cn"
          className="bg-[#FFCE71] text-black rounded-full p-2 hover:opacity-80 transition-opacity"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </Link>


        <Link

         target="blank"
          href="https://www.tiktok.com/discover/the-social-chamber"
          className="bg-[#FFCE71] text-black rounded-full p-2 hover:opacity-80 transition-opacity"
          aria-label="TikTok"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        </Link>


        <Link

         target="blank"
    href="https://www.facebook.com/thesocialchamber"
    className="bg-[#FFCE71] text-black rounded-full p-2 hover:opacity-80 transition-opacity"
    aria-label="Facebook"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </Link>
  
  <Link
   target="blank"
    href="https://www.lemon8-app.com/@thesgdaily?region=sg"
    className="bg-[#FFCE71] text-black rounded-full p-2 hover:opacity-80 transition-opacity"
    aria-label="Lemon8"
  >
  
        {/* <Globe /> */}



        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-lg">
        {/* Yellow circle background */}
        <circle cx="12" cy="12" r="12" fill="#F7E93D" />

        {/* lemon8 text */}
        <text
          x="12"
          y="14.5"
          textAnchor="middle"
          fontSize="4"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fill="currentColor"
        >
          lemon8
        </text>

        {/* Curved underline */}
        <path
          d="M 7 16.5 Q 12 17.5 17 16.5"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>


  </Link>

      </div> 


        </div>

        {/* Divider */}
        {/* <div className="border-t border-[#FFCE71] my-4"></div> */}

        {/* Copyright */}
        <div className="text-center font-poppins text-sm max-w-[1296px] mx-auto text-[#CBD5E1] pt-[25px] md:pt-[35px] lg:pt-[43px] border-t border-[#FFCE71]">
          © Copyright 2025, All Rights Reserved by Social Chamber
        </div>
      </div>
    </footer>
  );
}
