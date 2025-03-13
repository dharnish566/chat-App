import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/system";
import './App.css'

// Initialize Gemini AI with API Key
const apiKey = "AIzaSyALRv45-bJ9-RuuYxXLLcm1fURnmThXX_Y";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Styled Components
const ChatContainer = styled(Box)({
  width: "600px",
  height: "650px",
  display: "flex",
  flexDirection: "column",
  border: "2px solid #1976d2",
  borderRadius: "10px",
  background: "#f4f6f8",
  overflow: "hidden",
  // backgroundColor: "red"
});

const MessagesContainer = styled(Box)({
  flex: 1,
  padding: "10px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
});

const Message = styled(Box)(({ isUser }) => ({
  padding: "8px 12px",
  borderRadius: "8px",
  marginBottom: "8px",
  maxWidth: "70%",
  alignSelf: isUser ? "flex-end" : "flex-start",
  background: isUser ? "#1976d2" : "#e0e0e0",
  color: isUser ? "#fff" : "#000",
}));

const InputContainer = styled(Box)({
  display: "flex",
  padding: "10px",
  borderTop: "2px solid #1976d2",
  background: "#fff",
});

// Chatbot Component
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput("");

    try {
      const chatSession = model.startChat({ history: [] });
      const result = await chatSession.sendMessage(input);
      const aiResponse = result.response.text();

      setMessages([...newMessages, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div className="chat-main">
    <ChatContainer>
      {/* Header */}
      <Box sx={{ textAlign: "center", padding: "10px", background: "#1976d2", color: "#fff" }}>
        <Typography variant="h6">Chat Application</Typography>
      </Box>

      {/* Chat Messages */}
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>{msg.text}</Message>
        ))}
      </MessagesContainer>

      {/* Input Field */}
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatContainer>
    </div>
  );
};

export default Chatbot;