export default function ConsumerIcon({ width = '1.2em', height = '1.2em', fill = "currentColor", ...props }) {
    return (
      <svg width={width} height={height} viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
       <path d="M12.2424 4.94973C12.2424 7.09469 10.5515 8.80615 8.49887 8.80615C6.44636 8.80615 4.75537 7.09469 4.75537 4.94973C4.75537 2.80471 6.44636 1.09326 8.49887 1.09326C10.5515 1.09326 12.2424 2.80472 12.2424 4.94973Z" stroke={fill} strokeWidth="1.25" strokeMiterLimit="13.3333"/>
        <path d="M0.938627 17.1055L0.93863 17.1055C1.59206 13.4102 4.73942 10.6282 8.49965 10.6282C12.2599 10.6282 15.4072 13.4102 16.0607 17.1055C16.1359 17.5313 15.8092 17.9032 15.4155 17.9032H1.58374C1.19007 17.9032 0.86332 17.5313 0.938627 17.1055Z" stroke={fill} strokeWidth="1.25" strokeMiterLimit="13.3333"/>
      </svg>
    );
  }