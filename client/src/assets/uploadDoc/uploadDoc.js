import React from 'react';
import { Button } from "@mui/material";
import './uploadDoc.css';
import PropTypes from 'prop-types';
// import { LazyImage } from './lazyImage';
import { Divider } from '@mui/material';

export default function UploadDoc({ label = 'Upload Images', name = 'DefaultName', files, uploadedFiles = [], onUpload, onRemove, onRemoveUploaded, required= false }) {
  // const drop = useRef(null);
  // useEffect(() => {
  //   const dropCurr = drop.current;
  //   dropCurr.addEventListener('dragover', handleDragOver);
  //   dropCurr.addEventListener('drop', handleDrop);

  //   return () => {
  //     dropCurr.removeEventListener('dragover', handleDragOver);
  //     dropCurr.removeEventListener('drop', handleDrop);
  //   };
  // }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.dataTransfer.files);
    ValidateAndUpload(e.dataTransfer.files);
  };
  const handleUpload = (e) => {
    // console.log(e.target.files);
    ValidateAndUpload(e.target.files);
  };

  const ValidateAndUpload = (files) => {
    const Files = [...files];
    console.debug('Files: ', Files);
    for (const f of Files) {
      if (['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) {
        if (f.size > 1 * 1024 * 1024) {
        //   dispatch(promptShow({ type: 'error', message: 'File size must be less than 1 MB' }));
          console.debug('Size Failure: ', f.name);
          return;
        }
      } else {
        // dispatch(promptShow({ type: 'error', message: 'Invalid File Format' }));
        console.debug('Format Failure: ', f.name);
        return;
      }
    }
    if (Files.length > 0) {
      onUpload(files, name);
    }
  };

  return (
    <section className="uploadWrapper">
      <p className="label">
        {label}
       {required && <span> *</span>}
      </p>
      {/* <div className="dragDropArea" ref={drop}> */}
      <div className="dragDropArea" onDragOver={handleDragOver} onDrop={handleDrop}>
        {uploadedFiles.length > 0 && (
          <div>
            <div className="uploadedImgContainer">
              {/* {uploadedFiles.map((image, i) => (
                <div key={i} className="position-relative text-center imageDisplay">
                  <img
                    src={'/image/icon/file_cancel.svg'}
                    alt="Cancel Icon"
                    style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
                    onClick={() => onRemoveUploaded(image.image_name, name)}
                  />
                  {/(.png|.jpg|.jpeg)$/.test(image.image_name) ? (
                    <LazyImage name={image.image_name} style={{ width: '50px' }} />
                  ) : (
                    <img src="/image/icon/file_pdf.png" alt="PDF Icon" style={{ width: '50px' }} />
                  )}
                  <p>{image.image_name.length > 18 ? image.image_name.slice(0, 5) + '...' + image.image_name.substr(-10) : image.image_name}</p>
                </div>
              ))} */}
            </div>
            <Divider sx={{ mt: 2 }} />
          </div>
        )}
        {files.length > 0 ? (
          <div className="uploadedImgContainer">
            {files.map((f, i) => (
              <div key={i}>
                <img
                  src={'/images/icons/file_cancel.svg'}
                  alt="Cancel Icon"
                  style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
                  onClick={() => onRemove(f, name)}
                />
                <img src={/jpeg|png|jpg/.test(f.type) ? URL.createObjectURL(f) : '/image/icon/file_pdf.png'} style={{ width: '50px' }} alt="PDF Icon" />
                <p>{f.name.length > 18 ? f.name.slice(0, 5) + '...' + f.name.substr(-10) : f.name}</p>
                <p>{`(${Math.round(f.size / 1024)} KB)`}</p>
              </div>
            ))}
          </div>
        ) : (
          <img src="/images/icons/upload_cloud.svg" alt="upload" style={{ width: 80 }} />
        )}
        <div>
          <p>Drag & Drop Image Here</p>
          <p>or</p>
        </div>
        <Button variant="outlined" color="secondary" component="label">
          Browse File
          <input multiple hidden accept=".pdf,.jpeg,.png,.jpg" type="file" onChange={handleUpload} />
        </Button>
        <div className="infoText">
          <p>Supported formats: .jpeg, .png, .pdf</p>
          <p>Max file size should be 1MB</p>
        </div>
      </div>
    </section>
  );
}

UploadDoc.propTypes = {
  onUpload: PropTypes.func.isRequired,
};