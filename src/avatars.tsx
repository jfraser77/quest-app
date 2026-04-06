import React from "react";

interface AvatarProps {
  size?: number;
}

export const WarriorAvatar = ({ size = 80 }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="68" rx="16" ry="10" fill="#2a1a0a"/>
    <rect x="28" y="48" width="24" height="22" rx="4" fill="#8B4513"/>
    <rect x="26" y="52" width="28" height="4" rx="2" fill="#6B3410"/>
    <rect x="22" y="50" width="6" height="16" rx="3" fill="#654321"/>
    <rect x="52" y="50" width="6" height="16" rx="3" fill="#654321"/>
    <ellipse cx="40" cy="34" rx="18" ry="17" fill="#d4956a"/>
    <rect x="24" y="18" width="32" height="18" rx="4" fill="#3a2010"/>
    <path d="M24 26 Q40 14 56 26" fill="#2a1505"/>
    <rect x="30" y="16" width="20" height="6" rx="2" fill="#555"/>
    <line x1="40" y1="10" x2="40" y2="4" stroke="#888" strokeWidth="3"/>
    <circle cx="40" cy="3" r="3" fill="#aaa"/>
    <ellipse cx="29" cy="36" rx="5" ry="5" fill="#d4956a"/>
    <ellipse cx="51" cy="36" rx="5" ry="5" fill="#d4956a"/>
    <ellipse cx="31" cy="35" rx="3.5" ry="4" fill="#4a2e1a"/>
    <ellipse cx="49" cy="35" rx="3.5" ry="4" fill="#4a2e1a"/>
    <circle cx="31" cy="35" r="1.5" fill="#111"/>
    <circle cx="49" cy="35" r="1.5" fill="#111"/>
    <circle cx="32" cy="34" r="0.8" fill="white"/>
    <circle cx="50" cy="34" r="0.8" fill="white"/>
    <path d="M34 44 Q40 48 46 44" stroke="#a06040" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <rect x="55" y="30" width="3" height="30" rx="1.5" fill="#777" transform="rotate(15 55 30)"/>
    <path d="M55 30 L58 24 L61 30" fill="#999"/>
  </svg>
);

export const MageAvatar = ({ size = 80 }: AvatarProps) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <ellipse cx="40" cy="68" rx="16" ry="10" fill="#0d0a1a"/>
    <path d="M24 46 Q30 70 40 72 Q50 70 56 46 Q48 52 40 52 Q32 52 24 46Z" fill="#4a2080"/>
    <rect x="22" y="44" width="36" height="8" rx="4" fill="#5a28a0"/>
    <ellipse cx="40" cy="34" rx="17" ry="16" fill="#e8c8a0"/>
    <path d="M23 28 Q40 10 57 28 Q57 18 40 14 Q23 18 23 28Z" fill="#1a0840"/>
    <path d="M23 28 L20 22 L26 26Z" fill="#2a1060"/>
    <path d="M57 28 L60 22 L54 26Z" fill="#2a1060"/>
    <ellipse cx="29" cy="36" rx="5" ry="5" fill="#e8c8a0"/>
    <ellipse cx="51" cy="36" rx="5" ry="5" fill="#e8c8a0"/>
    <ellipse cx="31" cy="35" rx="4" ry="4" fill="#1a0840"/>
    <ellipse cx="49" cy="35" rx="4" ry="4" fill="#1a0840"/>
    <circle cx="31" cy="35" r="2" fill="#7040d0"/>
    <circle cx="49" cy="35" r="2" fill="#7040d0"/>
    <circle cx="32" cy="34" r="0.8" fill="white"/>
    <circle cx="50" cy="34" r="0.8" fill="white"/>
    <ellipse cx="40" cy="28" rx="3" ry="2" fill="#e8c8a0"/>
    <path d="M34 44 Q40 49 46 44" stroke="#c09060" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <line x1="18" y1="50" x2="10" y2="20" stroke="#8060c0" strokeWidth="2"/>
    <circle cx="10" cy="18" r="4" fill="#c080ff"/>
    <ellipse cx="10" cy="18" rx="4" ry="4" fill="none" stroke="#e0a0ff" strokeWidth="1"/>
    <circle cx="10" cy="18" r="2" fill="#fff" opacity="0.6"/>
  </svg>
);
