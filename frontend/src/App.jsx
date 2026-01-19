import React, { useState } from "react";

function App() {

  const [files, setFiles] = useState([]);

  const handleSelect = (e) => {
    setFiles(e.target.files);
  };

  const handleMerge = async () => {

    if (!files || files.length < 2) {
      alert("Please select at least 2 PDF files");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const response = await fetch(
      "http://localhost:8080/api/files/merge-pdf",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      alert("PDF merge failed");
      return;
    }

    // Receive binary PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>PDF Merge</h2>

      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleSelect}
      />

      <br /><br />

      <button onClick={handleMerge}>
        Merge & Download
      </button>
    </div>
  );
}

export default App;
