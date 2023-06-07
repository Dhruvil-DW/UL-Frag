export default function TooltipIcon({ fill = "currentColor", width = "1em", height = "1em" }) {
    return (
      <svg width={width} height={height} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.5 16.5V22"
          stroke={fill}
          strokeWidth="2.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="16.5" cy="16.5" r="12.375" stroke={fill} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="16.5" y="11" width="0.01375" height="0.01375" stroke={fill} strokeWidth="4.125" strokeLinejoin="round"/>
      </svg>
    )
  }