import { createEditor, createToolbar, Boot, DomEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { h } from 'snabbdom'

const resume = {                    // JS 语法
  type: 'audio',
  link: '/张卫健 - 真有你的.mp3',
  children: [{ text: '' }],  // void 元素必须有一个 children ，其中只有一个空字符串，重要！！！
}

function withAudio(editor) {                        // JS 语法
  const { isInline, isVoid } = editor
  const newEditor = editor

  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'audio') return true // 针对 type: attachment ，设置为 inline
    return isInline(elem)
  }

  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'audio') return true // 针对 type: attachment ，设置为 void
    return isVoid(elem)
  }

  return newEditor // 返回 newEditor ，重要！！！
}
Boot.registerPlugin(withAudio)

function renderAudio(elem) {                                                // JS 语法
  // 获取“附件”的数据，参考上文 myResume 数据结构
  const { link } = elem

  // 附件 icon 图标 vnode
  const audioElem = h(
    // HTML tag
    'audio',
    // HTML 属性
    {
      props: { src: link, controls: true }, // HTML 属性，驼峰式写法
    }
    // img 没有子节点，所以第三个参数不用写
  )

  return audioElem
}
const renderElemConf = {
  type: 'audio', // 新元素 type ，重要！！！
  renderElem: renderAudio,
}
Boot.registerRenderElem(renderElemConf)

function attachmentToHtml(elem) {                             // JS 语法

  // 获取附件元素的数据
  const { link } = elem

  // 生成 HTML 代码
  const html = `<audio
    src=${link}
    controls
    data-w-e-type="audio"
    data-w-e-is-void
    data-w-e-is-inline
    data-link="${link}"
  ></audio>`

  return html
}
const elemToHtmlConf = {
  type: 'audio', // 新元素的 type ，重要！！！
  elemToHtml: attachmentToHtml,
}
Boot.registerElemToHtml(elemToHtmlConf)

function parseAttachmentHtml(domElem) {                                                     // JS 语法
  // 从 DOM element 中获取“附件”的信息
  const link = domElem.getAttribute('data-link') || ''

  // 生成“附件”元素（按照此前约定的数据结构）
  const myResume = {
    type: 'audio',
    link,
    children: [{ text: '' }], // void node 必须有 children ，其中有一个空字符串，重要！！！
  }

  return myResume
}
const parseHtmlConf = {
  selector: 'audio[data-w-e-type="audio"]', // CSS 选择器，匹配特定的 HTML 标签
  parseElemHtml: parseAttachmentHtml,
}
Boot.registerParseElemHtml(parseHtmlConf)

class AudioMenu {
  constructor() {
    this.title = '插入音频'
    this.iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.413-.588T4 20V4q0-.825.588-1.413T6 2h7.175q.4 0 .763.15t.637.425l4.85 4.85q.275.275.425.638t.15.762V20q0 .825-.588 1.413T18 22H6Zm7-14q0 .425.288.713T14 9h4l-5-5v4Zm-2.25 11q.95 0 1.6-.65t.65-1.6V13h2q.425 0 .713-.288T16 12q0-.425-.288-.713T15 11h-2q-.425 0-.713.288T12 12v2.875q-.275-.2-.588-.288t-.662-.087q-.95 0-1.6.65t-.65 1.6q0 .95.65 1.6t1.6.65Z"/></svg>'
    this.tag = 'button'
  }
  getValue() {
    return false
  }
  isActive() {
    return false
  }
  isDisabled() {
    return false
  }
  exec() {
    document.querySelector('upload').click()
  }
}
const AudioMenuConf = {
  key: 'AudioMenu',
  factory() {
    return new AudioMenu()
  }
}
Boot.registerMenu(AudioMenuConf)

const editorConfig = {
  placeholder: 'Type here...',
  onChange(editor) {
    const html = editor.getHtml()
    console.log('editor content', html)
  },
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        const url = URL.createObjectURL(file)
        insertFn(url, 'img', url)
      }
    },
    uploadVideo: {
      async customUpload(file, insertFn) {
        const url = URL.createObjectURL(file)
        insertFn(url, 'video', url)
      }
    },
  },
}

const editor = createEditor({
  selector: '#app',
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'default', // or 'simple'
})

const toolbarConfig = {
  insertKeys: {
    index: 24,
    keys: ['AudioMenu'], // show menu in toolbar
  }
}

const toolbar = createToolbar({
  editor,
  selector: '#toolbar',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})

editor.insertNode(resume)

window.editor = editor

editor.setHtml(`<p><audio
src=/张卫健 - 真有你的.mp3
controls
data-w-e-type="audio"
data-w-e-is-void
data-w-e-is-inline
data-link="/张卫健 - 真有你的.mp3"
></audio></p>`)