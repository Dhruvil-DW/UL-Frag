export default function CheckBoxRoundUnchecked({ width = '1em', height = '1em', fill = "currentColor", ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="7" stroke={fill} strokeWidth="2" />
    </svg>
  );
}