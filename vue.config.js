const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host: "localhost",//配置本项目运行主机
    port: 8081,//配置本项目运行端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080', //接⼝域名
        changeOrigin: true,       //是否跨域
        ws: true,            //是否代理 websockets
        // secure: true,          //是否https接⼝
        pathRewrite: {         //路径重置
          '^/api': ''
        }
      }
    }
  }
})
