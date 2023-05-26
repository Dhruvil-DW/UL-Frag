export default function CalenderIcon({ fill = "currentColor", width = "1em", height = "1em" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* <g clipPath="url(#clip0_2_253)"> */}
        <path
          d="M3.33331 3.33337H16.6666V15C16.6666 15.9205 15.9205 16.6667 15 16.6667H4.99998C4.0795 16.6667 3.33331 15.9205 3.33331 15V3.33337Z" 
          stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round" />
        <path
          d="M3.33331 6.66663H16.6666" stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round" />
        <path
          d="M13.3333 2.5V4.16667" stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round" />
        <path
          d="M6.66669 2.5V4.16667" stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round" />
      {/* </g> */}
      <defs>
        <clipPath id="clip0_2_253">
          <rect width={width} height={height} fill={fill} />
        </clipPath>
      </defs>
    </svg>

  )
}

// export default function CalenderIcon({ fill = "currentColor", width = "1em", height = "1em" }) {
//   return (
//     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <g clipPath="url(#clip0_2_253)">
//         <path d="M3.33331 3.33337H16.6666V15C16.6666 15.9205 15.9205 16.6667 15 16.6667H4.99998C4.0795 16.6667 3.33331 15.9205 3.33331 15V3.33337Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M3.33331 6.66663H16.6666" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M13.3333 2.5V4.16667" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M6.66669 2.5V4.16667" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//       </g>
//       <defs>
//         <clipPath id="clip0_2_253">
//           <rect width="20" height="20" fill="white" />
//         </clipPath>
//       </defs>
//     </svg>
//   )
// }
