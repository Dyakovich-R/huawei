import { onMounted } from 'vue'

const API_URL = 'https://zenquotes.io/api/random'

export const getQuote = async () => {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.log(error.message)
  }
}
  onMounted(getQuote)
console.log('API_URL', getQuote())
