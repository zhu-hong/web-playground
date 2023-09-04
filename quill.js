// import { createApp } from 'vue'
// // import App from './App.vue'
// import { App } from './App'
// import element from 'element-plus'
// import './theme.scss'

// createApp(App).use(element).mount('#app')

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// 源码中是import直接倒入，这里要用Quill.import引入
const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')

const ATTRIBUTES = ['height', 'width']

class CVideo extends BlockEmbed {
  static create(value) {
    let node = super.create()
    console.log(node)
    //添加
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    return node
  }

  static formats (domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  static sanitize (url) {
    return Link.sanitize(url)
  }

  static value (domNode) {
    // 设置值包含宽高，为了达到自定义效果
    //宽高为空的话，就是按100%算
    return {
      url: domNode.getAttribute('src'),
      controls: domNode.getAttribute('controls'),
      width: domNode.getAttribute('width'),
      height: domNode.getAttribute('height')
    }
  }
}
CVideo.blotName = 'video'
// Video.className = 'ql-video' // 可添加样式，看主要需要
CVideo.tagName = 'video' // 用video标签替换iframe

class CAudio extends BlockEmbed {
  static create(value) {
    let node = super.create()
    //添加
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
    return node
  }

  static sanitize (url) {
    return Link.sanitize(url)
  }

  static value (domNode) {
    return {
      url: domNode.getAttribute('src'),
      controls: domNode.getAttribute('controls'),
    }
  }
}
CAudio.blotName = 'audio'
// audio.className = 'ql-audio' // 可添加样式，看主要需要
CAudio.tagName = 'audio' // 用audio标签替换iframe

Quill.register(CVideo, true);
Quill.register(CAudio, true);

const editor = new Quill('#app', {
  modules: {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
        ["blockquote"], //引用，代码块
        [{ header: 1 }, { header: 2 }, { header: 3 }], // 标题，键值对的形式；1、2表示字体大小
        [{ list: "ordered" }, { list: "bullet" }], //列表
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        [{ size: ["small", false, "large", "huge"] }], // 字体大小
        [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
        [{ font: [] }], //字体
        [{ align: [] }], //对齐方式
        ["clean"], //清除字体样式
        ["image", "video", "audio"], //上传图片、上传视频
      ],
      handlers: {
        // image: (value) => {
        //   console.log(value)
        // },
        video: (value) => {
          editor.insertEmbed(editor.getSelection().index, 'video', {
            url: '/qkEL-Jsz2r4w4lx8.mp4',
            controls: true,
            width: 'auto',
            height: 'auto',
          })
        },
        audio: () => {
          editor.insertEmbed(editor.getSelection().index, 'audio', {
            url: '/张卫健 - 真有你的.mp3',
            controls: true,
          })
        },
      },
    },
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',  // or 'bubble'
});

editor.focus()
