import Groq from 'groq-sdk';
import config from '../config.js';

let client = null;

// Initialize Groq client with error handling
function initializeGroqClient() {
  if (!config.groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  return new Groq({
    apiKey: config.groqApiKey,
  });
}

/**
 * Generate a response using Groq with the given context
 */
export async function generateResponse(query, context, conversationHistory = []) {
  try {
    // Initialize client if not already done
    if (!client) {
      client = initializeGroqClient();
    }

    const systemPrompt = buildSystemPrompt(context);

    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: query,
      },
    ];

    let response;
    try {
      response = await client.chat.completions.create({
        model: config.groqModel,
        max_tokens: config.maxTokens || 2048,
        messages,
        temperature: 0.2,
        top_p: 0.9,
        stream: false,
      });
    } catch (groqError) {
      console.error('Groq API Error:', {
        message: groqError.message,
        status: groqError.status,
        type: groqError.type,
      });
      
      // Handle specific Groq errors
      if (groqError.status === 401) {
        throw new Error('Invalid GROQ_API_KEY - check your environment variables');
      } else if (groqError.status === 429) {
        throw new Error('Groq API rate limit exceeded - please try again later');
      } else if (groqError.status === 500) {
        throw new Error('Groq API server error - please try again later');
      } else if (groqError.message?.includes('ECONNREFUSED') || groqError.message?.includes('ETIMEDOUT')) {
        throw new Error('Cannot connect to Groq API - check your internet connection');
      }
      
      throw new Error(`Groq API error: ${groqError.message}`);
    }

    if (!response?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Groq API - no content in response');
    }

    let responseText = response.choices[0].message.content;
    
    // Remove thinking tags if present
    responseText = responseText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    return {
      response: responseText,
      usage: {
        input_tokens: response.usage?.input_tokens || 0,
        output_tokens: response.usage?.output_tokens || 0,
      },
      model: config.groqModel,
    };
  } catch (error) {
    console.error('Error generating response:', error);
    // Re-throw with consistent error format
    const err = new Error(error.message || 'Failed to generate response');
    err.status = error.status || 500;
    throw err;
  }
}

/**
 * Build system prompt with context
 */
function buildSystemPrompt(context) {
  return `You are a brief document assistant. Answer in 1-2 sentences ONLY.

RULES:
1. Answer ONLY using document information
2. If not in documents: "I don't have information about this in the provided documents."
3. Maximum 2 sentences
4. NO explanations, thinking, or extra text
5. NO offers to help
6. Include document source

Documents:
${context || 'No documents available.'}`;
}
