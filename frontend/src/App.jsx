import React, { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("pdf");

  const [pdfFiles, setPdfFiles] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [quality, setQuality] = useState(0.6);
  const [pdfToWordFile, setPdfToWordFile] = useState(null);

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  /* =========================
     HANDLERS
     ========================= */
  const handlePdfMerge = async () => {
    if (pdfFiles.length < 2) return alert("Select at least 2 PDFs");

    const formData = new FormData();
    Array.from(pdfFiles).forEach(f => formData.append("files", f));

    const res = await fetch("http://localhost:8080/api/files/merge-pdf", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    downloadFile(blob, "merged.pdf");
  };

  const handleImageCompress = async () => {
    if (!imageFile) return alert("Select an image");

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("quality", quality);

    const res = await fetch("http://localhost:8080/api/files/compress-image", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    downloadFile(blob, "compressed_" + imageFile.name);
  };

  const handlePdfToWord = async () => {
    if (!pdfToWordFile) return alert("Select a PDF");

    const formData = new FormData();
    formData.append("file", pdfToWordFile);

    const res = await fetch("http://localhost:8080/api/files/pdf-to-word", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    downloadFile(blob, "converted.docx");
  };

  return (
    <div style={{ marginTop: "10px", paddingTop: "0px", paddingLeft: "550px", fontFamily: "Arial",  }}>
      <h1>File Utility Tools</h1>

      {/* Tabs */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("pdf")}>PDF Merge</button>
        <button onClick={() => setActiveTab("image")}>Image Compression</button>
        <button onClick={() => setActiveTab("word")}>PDF → Word</button>
      </div>

      {/* Card */}
      <div style={{ padding: "25px", border: "1px solid #ccc" }}>
        {activeTab === "pdf" && (
          <>
            <h2>PDF Merge</h2>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => setPdfFiles(e.target.files)}
            />
            <br /><br />
            <button onClick={handlePdfMerge}>Merge & Download</button>
          </>
        )}

        {activeTab === "image" && (
          <>
            <h2>Image Compression</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <br /><br />
            <label>Quality: {quality}</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
            <br /><br />
            <button onClick={handleImageCompress}>
              Compress & Download
            </button>
          </>
        )}

        {activeTab === "word" && (
          <>
            <h2>PDF → Word</h2>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfToWordFile(e.target.files[0])}
            />
            <br /><br />
            <button onClick={handlePdfToWord}>
              Convert & Download Word
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
