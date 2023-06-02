export default function PlusRoundIcon({ width = '1em', height = '1em', fill = "currentColor", stroke = "black", ...props }) {
  return (
    <svg width={width} height={height} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="17.5" cy="17.5" r="17.5" fill={fill} />
      <path d="M16.9684 11.6334V15.965H12.7366V17.502H16.9684V21.8136H18.6651V17.502H22.9169V15.965H18.6651V11.6334H16.9684Z" fill={stroke} />
    </svg>
  );
}