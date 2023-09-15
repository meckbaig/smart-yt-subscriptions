module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" 
  ? "/smart-yt-subscriptions/" 
  : "/",
})