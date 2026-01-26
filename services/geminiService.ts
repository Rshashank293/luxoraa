import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

/**
 * Helper to get a fresh instance of the AI client.
 * Essential for ensuring the latest injected API key is used in production.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Suite: Semantic Search
 */
export const getSmartSearch = async (query: string, products: Product[]) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User search: "${query}". Analyze intent and return matching product IDs from this catalog. Consider synonyms.
      Catalog: ${JSON.stringify(products.map(p => ({ id: p.id, title: p.title, tags: p.tags, desc: p.description })))}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    // Note: text is a property, not a method
    const ids = JSON.parse(response.text || '[]');
    return products.filter(p => ids.includes(p.id));
  } catch (e) {
    console.error("Smart Search failed:", e);
    return products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  }
};

/**
 * AI Suite: Smart Recommendations
 */
export const getSmartRecommendations = async (context: string, products: Product[]) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the context: "${context}", recommend up to 3 products from the catalog.
      Catalog: ${JSON.stringify(products.map(p => ({ id: p.id, title: p.title, category: p.category, tags: p.tags })))}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    const ids = JSON.parse(response.text || '[]');
    return products.filter(p => ids.includes(p.id));
  } catch (e) {
    return products.slice(0, 3);
  }
};

/**
 * AI Suite: Complete the Look
 */
export const getCompleteTheLook = async (product: Product, products: Product[]) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the product: "${product.title}" (${product.category}), suggest up to 2 complementary items from the catalog.
      Catalog: ${JSON.stringify(products.filter(p => p.id !== product.id).map(p => ({ id: p.id, title: p.title, category: p.category })))}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    const ids = JSON.parse(response.text || '[]');
    return products.filter(p => ids.includes(p.id));
  } catch (e) {
    return products.filter(p => p.id !== product.id).slice(0, 2);
  }
};

/**
 * AI Suite: Fraud Risk Detection
 */
export const detectFraudRisk = async (orderDetails: any) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this checkout attempt for potential fraud risk. Return a score 0-100.
      Details: ${JSON.stringify(orderDetails)}`,
      config: {
        systemInstruction: "You are a fraud detection expert. Respond ONLY with the risk score as an integer."
      }
    });
    const scoreText = response.text || '5';
    const score = parseInt(scoreText.trim().replace(/[^0-9]/g, '') || '5');
    return isNaN(score) ? 5 : score;
  } catch (e) {
    return 5;
  }
};

/**
 * AI Suite: Chatbot Concierge
 */
export const getChatbotResponse = async (userMessage: string, history: any[]) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: "You are Luxoraa Concierge, a luxury e-commerce assistant. Help with orders, styling, and sizing."
      }
    });
    return response.text || "I'm processing your request. How else can I assist you?";
  } catch (e) {
    return "I'm processing your request. How else can I assist you with your Luxoraa experience?";
  }
};