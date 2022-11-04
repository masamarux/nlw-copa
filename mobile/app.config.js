module.exports = function({ config, mode }) {
  return {
    ...config,
    extra: {
      googleAuthClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    }
  }
}