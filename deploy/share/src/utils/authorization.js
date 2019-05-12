
export const authorization = (userId, token) => {
    if (userId && token) {
      return `${userId}_${token}`
    }
    return null
}