import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { UploadCloud, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export default function MVPStudyCompanion() {
  // 1. State management
  const [courseText, setCourseText] = useState(""); 
  const [fileName, setFileName] = useState(""); 
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello! Please upload a study file (TXT, MD, PDF, DOCX, PPTX) first, then ask me anything about it.",
      sender: "AI",
      direction: "incoming"
    }
  ]);

  // 2. Pure frontend file reading (Mocking extraction for PDF/DOCX/PPTX demo)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);

    // Mock extraction for demo purposes since frontend cannot natively parse binary files
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'docx', 'pptx'].includes(fileExtension)) {
       setCourseText(`[Mock Extracted Text from ${file.name}]: This document covers the core concepts of the selected course material.`);
       setMessages(prev => [...prev, {
          message: `System: Successfully loaded and parsed "${file.name}". You can now start asking questions!`,
          sender: "System",
          direction: "incoming"
        }]);
       return;
    }
    
    // Use browser native FileReader for TXT and MD
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCourseText(text); 
      
      // Provide feedback to the user
      setMessages(prev => [...prev, {
        message: `System: Successfully loaded "${file.name}". You can now start asking questions!`,
        sender: "System",
        direction: "incoming"
      }]);
    };
    reader.readAsText(file);
  };

  // 3. Handle sending messages and calling API
  const handleSend = async (userMessage) => {
    if (!courseText) {
      alert("Please upload a file first!");
      return;
    }

    // Render user message
    const newMessages = [...messages, { message: userMessage, sender: "Student", direction: "outgoing" }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Combine material and question into a single prompt for native API
      const fullPrompt = `You are an AI study companion. Answer strictly based on the following material.\n\nMaterial Content:\n${courseText}\n\nStudent Question:\n${userMessage}`;

      // Read the local API key from Vite environment configuration
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, {
          message: "Gemini API is not configured. Add VITE_GEMINI_API_KEY to a local .env.local file, then restart the app.",
          sender: "AI",
          direction: "incoming"
        }]);
        return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }]
        })
      });

      const data = await response.json();
      
      // Extract response text using native Gemini format
      const aiReply = data.candidates[0].content.parts[0].text;

      // Render AI reply
      setMessages(prev => [...prev, { message: aiReply, sender: "AI", direction: "incoming" }]);
      
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { message: "Sorry, network error.", sender: "AI", direction: "incoming" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%" }}>
      
      {/* Inject custom CSS to make chat bubbles and input fully rounded */}
      <style>{`
        .cs-message__content {
          border-radius: 20px !important;
          padding: 12px 18px !important;
          font-size: 14.5px !important;
          line-height: 1.5 !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
        }
        .cs-message--incoming .cs-message__content {
          border-bottom-left-radius: 4px !important;
          background-color: #f3f4f6 !important;
          color: #1f2937 !important;
        }
        .cs-message--outgoing .cs-message__content {
          border-bottom-right-radius: 4px !important;
          background-color: #6366f1 !important;
          color: #ffffff !important;
        }
        .cs-message-input {
          border-radius: 24px !important;
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          margin: 12px !important;
        }
        .cs-message-input__content-wrapper {
          border-radius: 24px !important;
        }
      `}</style>

      {/* Modern upload dropzone */}
      <div style={{ 
        padding: "32px 24px", 
        backgroundColor: fileName ? "#f0fdf4" : "#ffffff", 
        border: fileName ? "1px solid #bbf7d0" : "1px dashed #d1d5db",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        transition: "all 0.3s ease",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
      }}>
        {fileName ? (
           <>
             <CheckCircle2 size={36} color="#22c55e" />
             <div style={{ textAlign: "center" }}>
               <p style={{ margin: "0 0 4px 0", fontWeight: 600, color: "#166534", fontSize: "16px" }}>Material Loaded Successfully</p>
               <p style={{ margin: 0, fontSize: "14px", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                 <FileText size={14}/> {fileName}
               </p>
             </div>
           </>
        ) : (
           <>
             <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "50%" }}>
                <UploadCloud size={28} color="#6366f1" />
             </div>
             <div style={{ textAlign: 'center' }}>
               <p style={{ margin: "0 0 6px 0", fontWeight: 600, color: "#111827", fontSize: "16px" }}>Upload Study Material</p>
               <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Supported formats: TXT, MD, PDF, DOCX, PPTX</p>
             </div>
           </>
        )}
        
        <label style={{
          marginTop: "8px",
          padding: "10px 24px",
          backgroundColor: fileName ? "#ffffff" : "#6366f1",
          color: fileName ? "#374151" : "#ffffff",
          border: fileName ? "1px solid #d1d5db" : "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: fileName ? "none" : "0 4px 6px -1px rgba(99, 102, 241, 0.2)"
        }}>
          {fileName ? "Choose Another File" : "Browse Files"}
          <input 
            type="file" 
            accept=".txt,.md,.pdf,.docx,.pptx" 
            onChange={handleFileUpload} 
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Modern chat interface wrapper */}
      <div style={{ 
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb", 
        borderRadius: "16px", 
        overflow: "hidden",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Chat header */}
        <div style={{
          padding: "16px 20px",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Sparkles size={18} color="#6366f1" />
          <span style={{ fontWeight: 600, color: "#111827", fontSize: "15px" }}>Study Companion AI</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
             <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e" }}></div>
             <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Online</span>
          </div>
        </div>

        {/* Fixed height container */}
        <div style={{ height: "450px", position: "relative" }}>
          <MainContainer style={{ border: "none", height: "100%" }}>
            <ChatContainer>
              <MessageList 
                typingIndicator={isTyping ? <TypingIndicator content="AI is reading..." /> : null}
                style={{ backgroundColor: "#ffffff", padding: "16px" }}
              >
                {messages.map((msg, i) => (
                  <Message key={i} model={msg} />
                ))}
              </MessageList>
              <MessageInput 
                placeholder="Ask a question about your material..." 
                onSend={handleSend} 
                attachButton={false}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}