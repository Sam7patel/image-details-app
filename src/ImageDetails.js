import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './ImageDetails.css';

function ImageDetails() {
  const [extractedText, setExtractedText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageDetails, setImageDetails] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    dateOfBirth: '',
    joined: '',
    mobile: '',
    post: '',
    companyName: ''
  });
  const [comparisonResult, setComparisonResult] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        const details = {
          width: img.width,
          height: img.height,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        };
        setImageDetails(details);
      };

      const { data: { text } } = await Tesseract.recognize(url, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,/"',
        // Add more configuration options as needed
      });
      setExtractedText(text);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  let matchFound = false;

  // Compare each form field with the extracted text
  Object.values(formData).forEach(value => {
    if (extractedText.toLowerCase().includes(value.toLowerCase())) {
      // Check for exact match
      const regex = new RegExp(`\\b${value.toLowerCase()}\\b`);
      if (extractedText.toLowerCase().match(regex)) {
        matchFound = true;
      }
    }
  });

  if (matchFound) {
    setComparisonResult('Text from image matches input data!');
  } else {
    setComparisonResult('Text from image does not match input data.');
  }
};


  return (
    <div className="image-details-container">
      <div className="content">
        <div className="image-details">
          <h2>Upload Image</h2>
          <label className="upload-btn">
            Choose File
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {imageUrl && <img src={imageUrl} alt="Uploaded" className="uploaded-image" />}
          {imageDetails && (
            <div className="image-info">
              <h3>Image Details:</h3>
              <p>Dimensions: {imageDetails.width} x {imageDetails.height}</p>
              <p>Size: {imageDetails.size}</p>
            </div>
          )}
          {extractedText && (
            <div className="extracted-text">
              <h2>Extracted English Text:</h2>
              {extractedText.split(/[\n\r]+/).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <h2>Enter Information</h2>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Date of Birth:</label>
              <input type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Joined:</label>
              <input type="text" name="joined" value={formData.joined} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mobile:</label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Post:</label>
              <input type="text" name="post" value={formData.post} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company Name:</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
            </div>
            {/* Add more form fields as needed */}
            <button type="submit" className="compare-btn">Compare</button>
            {comparisonResult && <p>{comparisonResult}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImageDetails;
