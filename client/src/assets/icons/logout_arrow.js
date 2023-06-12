export default function LogoutArrowIcon({ width = '1em', height = '1em', fill = "currentColor", ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.125 3.33337H3.04167V13.25C3.04167 14.0324 3.67593 14.6667 4.45833 14.6667H10.125" stroke={fill} strokeWidth="1.0625" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.99998 11.125L5.87498 9M5.87498 9L7.99998 6.875M5.87498 9H12.9583" stroke={fill} strokeWidth="1.0625" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}