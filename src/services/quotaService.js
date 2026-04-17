import apiClient from './api'

/**
 * Fetches the current quota status for a given user.
 *
 * @param {string} userId - The user identifier
 * @returns {Promise<object>} Quota status (tokensUsed, tokensRemaining, resetDate, plan, etc.)
 */
export async function getStatus(userId) {
  const response = await apiClient.get('/api/quota/status', {
    params: { userId },
  })
  return response.data
}

/**
 * Fetches the usage history for a given user.
 *
 * @param {string} userId - The user identifier
 * @returns {Promise<Array>} Array of usage records [{ date, tokensUsed }]
 */
export async function getHistory(userId) {
  const response = await apiClient.get('/api/quota/history', {
    params: { userId },
  })
  return response.data
}

/**
 * Upgrades the user's plan.
 *
 * @param {string} userId  - The user identifier
 * @param {string} newPlan - Target plan: "FREE" | "PRO" | "ENTERPRISE"
 * @returns {Promise<object>} Updated plan information
 */
export async function upgradePlan(userId, newPlan) {
  const response = await apiClient.post('/api/quota/upgrade', {
    userId,
    newPlan,
  })
  return response.data
}
