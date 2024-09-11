const isValidURL = (url) => {
    try {
      const obj = new URL(url)
      return obj.protocol === "https:" || obj.protocol === "http:"

    } catch (error) {
        return false
    }
}


module.exports = isValidURL