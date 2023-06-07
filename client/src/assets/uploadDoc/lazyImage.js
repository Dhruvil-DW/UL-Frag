import React, { useEffect, useState } from 'react';
import { useAxios } from '../../hooks';

export const LazyImage = ({ name, ...OtherProps }) => {
  const [imgSrc, setImgSrc] = useState("");
  const { getData } = useAxios();
  const fileType = getFileType(name);

  useEffect(() => {
    getData(`image/get/${name}`, { responseType: 'arraybuffer' }, (data) => {
      // const base64 = btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '',),);
      // setImgSrc(`data:image/${name.split('.')[1]};base64,${base64}`);
      const blob = new Blob([data], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      // console.log("BLOB: ", blob);
      // console.log("URL: ", url);
      setImgSrc(url);

    });
  }, [getData, name, fileType])
  return (
    // <img src={imgSrc} alt='Img Loading' style={{ maxWidth: 100, maxHeight: 70 }} {...OtherProps} />
    <a href={imgSrc} target='_blank' rel='noreferrer'>
      <img src={/jpeg|png|jpg/.test(fileType) ? imgSrc : '/image/icon/file_pdf.png'} alt='Img Loading' style={{ maxWidth: 100, maxHeight: 70 }} {...OtherProps} />
    </a>
  )
}

function getFileType(fileName) {
  const fileFormat = fileName.split('.').pop();
  switch (fileFormat) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
    default:
      console.error(`Invalid File Format: ${fileFormat}`);
      return '';
  }
}