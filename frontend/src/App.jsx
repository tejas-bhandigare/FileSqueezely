import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
function App() {

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8080/api/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();
      alert(result);
    } catch (error) {
      alert("Upload failed");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>File Upload</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default App;
