import React from 'react';

export default function RobotIcon({ size = 22, color = "#052e16", strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <path d="M12 2V4.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="2" r="1.2" fill={color} />
      
      {/* Helmet / Top Crown */}
      <path d="M7 6.5C7 5.5 8.5 4.5 12 4.5C15.5 4.5 17 5.5 17 6.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      
      {/* Robot Face / Head Outline */}
      <rect x="4" y="6.5" width="16" height="11" rx="3.5" stroke={color} strokeWidth={strokeWidth} />
      
      {/* High-tech Visor / Eyes */}
      <path d="M7.5 10.5H16.5" stroke={color} strokeWidth={strokeWidth + 0.6} strokeLinecap="round" />
      
      {/* Mouth / Grill */}
      <path d="M9 14.5H15" stroke={color} strokeWidth={strokeWidth - 0.2} strokeLinecap="round" />
      <path d="M10.5 14.5V16" stroke={color} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" />
      <path d="M13.5 14.5V16" stroke={color} strokeWidth={strokeWidth - 0.5} strokeLinecap="round" />

      {/* Side Ears / Sensors */}
      <rect x="1.5" y="9" width="2" height="6" rx="1" fill={color} />
      <rect x="20.5" y="9" width="2" height="6" rx="1" fill={color} />

      {/* Neck Base */}
      <path d="M8.5 17.5V19.5C8.5 20.3 9.7 21 12 21C14.3 21 15.5 20.3 15.5 19.5V17.5" stroke={color} strokeWidth={strokeWidth - 0.2} strokeLinecap="round" />
    </svg>
  );
}
