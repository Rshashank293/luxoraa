
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateConciergeResponse = async (prompt: string, history: any[] = [], location?: { latitude: number, longitude: number }) => {
  const ai = getAI();
  const tools: any[] = [{ googleSearch: {} }];
  
  if (location) {
    tools.push({ googleMaps: {} });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: "You are Luxoraa, an elite lifestyle concierge. Your tone is sophisticated, knowledgeable, and impeccably polite. You specialize in ultra-luxury travel, fine dining, high-end watches, fashion, and bespoke services. Always provide detailed, expert-level advice. Use Google Search and Google Maps grounding for real-time events, trends, and localized recommendations.",
      tools,
      toolConfig: location ? {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      } : undefined
    },
  });

  const sources = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    for (const chunk of response.candidates[0].groundingMetadata.groundingChunks) {
      if (chunk.web) {
        sources.push({ title: chunk.web.title || "Reference", uri: chunk.web.uri });
      } else if (chunk.maps) {
        sources.push({ title: chunk.maps.title || "Location", uri: chunk.maps.uri });
      }
    }
  }

  return {
    text: response.text || "I apologize, but I am unable to assist with that request at this moment.",
    sources: sources.filter(s => s.uri)
  };
};

export const generateLuxuryImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A high-end, luxury, professional photograph of: ${prompt}. Cinematic lighting, 8k resolution, elegant composition.` }
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateLuxuryVideo = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A cinematic, ultra-luxury video of: ${prompt}. 4k, smooth motion, high-end production value.`,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

// Audio Utilities for Live API
export const encodePCM = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
