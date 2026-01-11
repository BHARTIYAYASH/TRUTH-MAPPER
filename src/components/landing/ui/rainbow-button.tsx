"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface RainbowButtonProps {
    children: React.ReactNode
    onClick?: () => void
    href?: string
    className?: string
}

export const RainbowButton: React.FC<RainbowButtonProps> = ({
    children,
    onClick,
    href,
    className = ""
}) => {
    const ButtonContent = () => (
        <>
            <span className="relative z-10">{children}</span>
            <style jsx>{`
        .rainbow-border::before,
        .rainbow-border::after {
          content: '';
          position: absolute;
          left: -2px;
          top: -2px;
          border-radius: 12px;
          background: linear-gradient(45deg, #5EEAD4, #98D8C8, #8FBC8F, #2D5016, #A8D5BA, #5EEAD4);
          background-size: 400%;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          z-index: -1;
          animation: rainbow 20s linear infinite;
        }
        .rainbow-border::after {
          filter: blur(30px);
        }
        @keyframes rainbow {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
        </>
    )

    if (href) {
        return (
            <Link
                href={href}
                className={`rainbow-border relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-black rounded-xl border-none text-white cursor-pointer font-bold transition-all duration-200 hover:scale-105 ${className}`}
            >
                <ButtonContent />
            </Link>
        )
    }

    return (
        <motion.button
            onClick={onClick}
            className={`rainbow-border relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-black rounded-xl border-none text-white cursor-pointer font-bold transition-all duration-200 ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ButtonContent />
        </motion.button>
    )
}
