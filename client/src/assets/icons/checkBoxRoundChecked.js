export default function CheckBoxRoundChecked({ width = '1em', height = '1em', fill = "currentColor", ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="7" fill={fill} stroke={fill} strokeWidth="2" />
      <path d="M11.3337 5.91672L7.16707 10.0834L5.08374 8.00005" stroke="#292929" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}