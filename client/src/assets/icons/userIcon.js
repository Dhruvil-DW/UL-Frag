export default function UserIcon({ fill = "currentColor", width = "1em", height = "1em" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.07397 14.4444C4.07397 12.808 5.40054 11.4814 7.03694 11.4814H12.9629C14.5993 11.4814 15.9258 12.808 15.9258 14.4444V14.4444C15.9258 15.2626 15.2625 15.9259 14.4443 15.9259H5.55546C4.73726 15.9259 4.07397 15.2626 4.07397 14.4444V14.4444Z"
        stroke={fill}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="9.99993" cy="6.29632" r="2.22222" stroke={fill} strokeWidth="1.2" />
    </svg>
  )
}
