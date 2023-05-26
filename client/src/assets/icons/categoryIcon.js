export default function CategoryIcon({width='1.1em', height='0.9em', fill="currentColor" , ...props}){
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g clip-path="url(#clip0_3_17)">
        <circle cx="19.625" cy="8.375" r="3.375" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.375" cy="19.625" r="3.375" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.25 16.25H23V21.875C23 22.4963 22.4963 23 21.875 23H17.375C16.7537 23 16.25 22.4963 16.25 21.875V16.25Z M5 5H11.75V10.625C11.75 11.2463 11.2463 11.75 10.625 11.75H6.125C5.50368 11.75 5 11.2463 5 10.625V5Z" stroke={fill} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      </svg>
    );
}