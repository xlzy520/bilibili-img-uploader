
import { createApp } from 'vue'
import ElementPlus, { ElMessage } from 'element-plus';
import { MessageType } from 'element-plus/packages/message/src/types'
// @ts-ignore
import defaultConfig from './config.js'
// @ts-ignore
import { routes } from './routes.js'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

import 'element-plus/lib/theme-chalk/index.css';

import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$message = (text: string, type: MessageType = 'success' ) => {
  // @ts-ignore
  ElMessage({
        'showClose': true, // 是否显示关闭按钮
        'message': text, // 消息内容
        type, // 消息类型
        'duration': 1000 // 显示时间
    })
};
app.config.globalProperties.$uploadUrl = defaultConfig.uploadUrl;
app.use(ElementPlus)

app.use(router)

app.mount('#app')
