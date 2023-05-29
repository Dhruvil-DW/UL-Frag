export default function PageIcon({ fill = "currentColor", width = "1.2em", height = "1.2em", ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 21C5.89543 21 5 20.1046 5 19V3H14L19 8V19C19 20.1046 18.1046 21 17 21H7Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3V9H19" stroke={fill} strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M9 13H15" stroke={fill} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17H15" stroke={fill} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}