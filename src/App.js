import React, { useState, useEffect } from 'react';
import ImageDetails from './ImageDetails';
import './App.css';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('color1');

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundColor(prevColor => {
        if (prevColor === 'color1') return 'color2';
        if (prevColor === 'color2') return 'color3';
        return 'color1';
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app-container ${backgroundColor}`}>
      <header className="app-header">
        <h1>Image Details App</h1>
      </header>
      <main className="app-main">
        <div className="app-description">
          <h2>Welcome to Image Details App!</h2>
          <p>This application allows you to extract text from images. Simply upload an image, and the app will extract any text it finds.</p>
          <p>Explore the functionalities by uploading your image now!</p>
        </div>
        <div className="upload-image-container">
          <ImageDetails />
        </div>
      </main>
    </div>
  );
}

export default App;
