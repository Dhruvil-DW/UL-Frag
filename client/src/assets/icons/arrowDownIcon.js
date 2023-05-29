export default function ArrowDownIcon({ width = '1em', height = '1em', fill = "currentColor", ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.33334 13.3333L16 20" stroke={fill} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 20L22.6667 13.3333" stroke={fill} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}