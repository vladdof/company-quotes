module.exports = {
  publicPath:
    process.env.NODE_ENV === 'render'
    ? '/' : (
      process.env.NODE_ENV === 'production'
        ? '/company-quotes/'
        : '/'
    )
}
