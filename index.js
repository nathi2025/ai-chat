// Import necessary modules
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const { OpenAI } = require("openai"); // Import OpenAI SDK

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json"); // Ensure this file is in the correct path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://deepseek-chat-3eb01.firebasesforage.app", // Your Firebase bucket URL
});

// Initialize OpenAI client with DeepSeek API key
const openai = new OpenAI({
  apiKey: "sk-91637049fb24488ebf5e8f5c7485a4eb", // Your DeepSeek API key
  baseURL: "https://api.deepseek.com", // DeepSeek API URL
});

const app = express();
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle file upload and analysis
app.post("/process-document", upload.single("file"), async (req, res) => {
  const filePath = req.file.path; // Path to the uploaded file
  const bucket = admin.storage().bucket(); // Firebase Storage bucket

  try {
    // Upload the file to Firebase Storage
    const [file] = await bucket.upload(filePath, {
      destination: `documents/${req.file.originalname}`,
    });

    // Get the public URL of the uploaded file
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    // Analyze the document using DeepSeek (via OpenAI)
    const response = await openai.chat.completions.create({
      model: "deepseek-chat", // Use DeepSeek model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: fileUrl },
      ],
    });

    // Send back the analysis result
    res.status(200).json({
      analysis: response.choices[0].message.content, // Use the content of the message as the analysis result
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process document" });
  } finally {
    // Delete the temporary file after processing
    require("fs").unlinkSync(filePath);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
