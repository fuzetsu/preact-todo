export const safeParse = (json, fallback = {}) => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return fallback
  }
}
