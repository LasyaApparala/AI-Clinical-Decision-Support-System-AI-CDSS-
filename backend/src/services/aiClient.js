import axios from 'axios'
const base = process.env.AI_SERVICE_BASE
export async function processQuery(payload) {
  const { data } = await axios.post(`${base}/process`, payload, { timeout: 120000 })
  return data
}
