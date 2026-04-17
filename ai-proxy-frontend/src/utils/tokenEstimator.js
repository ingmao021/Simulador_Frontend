/**
 * Estimates the number of tokens a text will consume.
 * Uses a simple heuristic: ~4 characters per token (similar to GPT tokenization).
 *
 * @param {string} text - The input text to estimate tokens for
 * @returns {number} Estimated token count (minimum 1 if text is non-empty)
 */
export function estimateTokens(text) {
  if (!text || text.trim().length === 0) {
    return 0
  }
  return Math.ceil(text.length / 4)
}
