import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import "./App.css";

const App = () => {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFileUpload = (uploadedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...Array.from(uploadedFiles).map((file) => ({
        name: file.name,
        file,
        id: Math.random().toString(36).substring(7), // Unique id for each file
      })),
    ]);
  };

  const handleHamburgerClick = (fileId) => {
    setActiveFile(fileId);
    setIsChatOpen(true); // Open the chat sidebar for the selected file
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="App">
      <h1>AI Document Analyzer</h1>

      <div className="file-upload-section">
        <FileUploader
          handleChange={handleFileUpload}
          name="file"
          multiple={true}
        />
      </div>

      <div className="files-container">
        {files.map((file) => (
          <div key={file.id} className="file-card">
            <div className="file-name">{file.name}</div>
            <div className="file-options">
              <button onClick={() => handleHamburgerClick(file.id)}>
                <span>☰</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && activeFile && (
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>
              Chat with AI for{" "}
              {files.find((file) => file.id === activeFile).name}
            </h3>
            <button onClick={handleCloseChat}>X</button>
          </div>
          <div className="chat-content">
            {/* Chat content goes here */}
            <p>Chat with AI...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
