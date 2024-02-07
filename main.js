// import { createApp } from 'vue'
// import App from './App.vue'
// import element from 'element-plus'
// import './theme.scss'

// createApp(App).use(element).mount('#app')

import { useScanCode } from './useScanCode'

const { start, onScan } = useScanCode(1000)

start()

onScan(console.log)
