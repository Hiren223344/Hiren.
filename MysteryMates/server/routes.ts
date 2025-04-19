import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, type MessageRole } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function getOpenRouterResponse(message: string): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://replit.app",
        "X-Title": "Black.GPT",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat:free",
        "messages": [
          {
            "role": "user",
            "content": message
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching response from OpenRouter API:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for chat functionality
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = req.params.id;
      const messages = await storage.getMessagesByConversationId(conversationId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: "Error fetching messages", error });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        content: message,
        role: 'user' as MessageRole,
        conversationId: conversationId || uuidv4(),
      });

      // Get response from OpenRouter API
      const responseContent = await getOpenRouterResponse(message);
      
      // Create assistant message
      const assistantMessage = await storage.createMessage({
        content: responseContent,
        role: 'assistant' as MessageRole,
        conversationId: userMessage.conversationId,
      });

      res.status(200).json({
        userMessage,
        assistantMessage,
        conversationId: userMessage.conversationId,
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing chat", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
