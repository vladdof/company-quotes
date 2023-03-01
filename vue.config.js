module.exports = {
  publicPath:
    process.env.VUE_APP_ENV === 'render'
    ? '/' : (
      process.env.VUE_APP_ENV === 'production'
        ? '/company-quotes/'
        : '/'
    )
}
