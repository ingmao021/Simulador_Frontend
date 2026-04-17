import apiClient from './api'

/**
 * Sends a text generation request to the AI backend.
 *
 * @param {string} userId  - The user identifier
 * @param {string} prompt  - The text prompt to send
 * @param {number} tokens  - Estimated token count for the request
 * @returns {Promise<object>} The generated response data
 */
export async function generateText(userId, prompt, tokens) {
  const response = await apiClient.post('/api/ai/generate', {
    userId,
    prompt,
    maxTokens: tokens,
  })
  return response.data
}
