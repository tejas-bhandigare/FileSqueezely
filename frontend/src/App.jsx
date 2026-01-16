import React, { useState } from "react";

function App() {

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("No files selected");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/files/upload-multiple",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();
      alert(result);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Multiple File Upload</h2>

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload Files
      </button>

      <p style={{ marginTop: "10px", color: "#555" }}>
        Select multiple files together, then click Upload.
      </p>
    </div>
  );
}

export default App;
