import React, { useState } from "react";

function App() {

  /* =========================
     PDF MERGE STATES
     ========================= */
  const [pdfFiles, setPdfFiles] = useState([]);

  /* =========================
     IMAGE COMPRESSION STATES
     ========================= */
  const [imageFile, setImageFile] = useState(null);
  const [quality, setQuality] = useState(0.6);

  /* =========================
     PDF MERGE HANDLER
     ========================= */
  const handlePdfMerge = async () => {
    if (!pdfFiles || pdfFiles.length < 2) {
      alert("Please select at least 2 PDF files");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < pdfFiles.length; i++) {
      formData.append("files", pdfFiles[i]);
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

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  /* =========================
     IMAGE COMPRESSION HANDLER
     ========================= */
  const handleImageCompress = async () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("quality", quality);

    const response = await fetch(
      "http://localhost:8080/api/files/compress-image",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      alert("Image compression failed");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed_" + imageFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>File Utility Tools</h1>

      {/* =========================
          PDF MERGE UI (DAY-5)
         ========================= */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>PDF Merge</h2>

        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={(e) => setPdfFiles(e.target.files)}
        />

        <br /><br />

        <button
          onClick={handlePdfMerge}
          style={{
            padding: "10px 20px",
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Merge & Download PDF
        </button>
      </div>

      {/* =========================
          IMAGE COMPRESSION UI (DAY-6)
         ========================= */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>Image Compression</h2>

        <p style={{ color: "#555" }}>
          Upload an image and reduce its size.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <br /><br />

        <label>
          Compression Quality: <b>{quality}</b>
        </label>

        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          style={{ width: "100%" }}
        />

        <br /><br />

        <button
          onClick={handleImageCompress}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Compress & Download Image
        </button>
      </div>
    </div>
  );
}

export default App;
