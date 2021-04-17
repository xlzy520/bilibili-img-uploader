import List from './views/List.vue'
import Uploader from './views/Uploader.vue'
import Request from "./views/Request.vue";

export const routes = [
  { path: '/', component: Uploader },
  { path: '/request', component: Request },
  { path: '/imgList', component: List,},
]
