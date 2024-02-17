// import { createApp } from 'vue'
// import App from './App.vue'
// import element from 'element-plus'
// import './theme.scss'

// createApp(App).use(element).mount('#app')
import JsBarcode from 'jsbarcode'

import qrcodegen from './qrcodegen'

const encodeSvg = (svg) => {
  return svg.replace('<svg', (~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}

const genSvgQrPath = (modules) => {
  const ops = []
  modules.forEach((row, y) => {
    let start = null
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start} ${y}h${x - start}v1H${start}z`
        )
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x},${y} h1v1H${x}z`)
        } else {
          // Otherwise finish the current line.
          ops.push(`M${start},${y} h${x + 1 - start}v1H${start}z`)
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

const svg = document.createElement('svg')
try {
  JsBarcode(svg, 'DD20240207005', {
    format: 'CODE128',
    height: 48,
    margin: 0,
    fontSize: 16,
    font: '',
  })
  svg.setAttribute('height', '48')
  const height = parseInt(svg.getAttribute('height'))
  svg.setAttribute('width', (48 / height * parseInt(svg.getAttribute('width'))).toString())
  svg.setAttribute('x', '180')
  svg.setAttribute('y', '124')
  svg.removeAttribute('version')
  svg.removeAttribute('style')
  const rect = svg.querySelector('rect')
  rect.removeAttribute('style')
  rect.setAttribute('fill', '#ffffff')
  const g = svg.querySelector('g')
  g.removeAttribute('style')
  g.setAttribute('fill', '#000000')
  const text = svg.querySelector('text')
  text.removeAttribute('style')
  text.setAttribute('font-size', 20)
  document.querySelectorAll('svg')[0].innerHTML += svg.outerHTML.replace('viewbox', 'viewBox')
} catch (error) {
  alert(error)
}

const modules = qrcodegen.QrCode.encodeText('42897276-A-00001-20240204', qrcodegen.QrCode.Ecc.HIGH).getModules()

document.querySelectorAll('svg')[2].innerHTML += `<svg xmlns='http://www.w3.org/2000/svg' width="38" height="38" x="6" y="17" viewBox='0 0 ${modules.length} ${modules.length}'>
<path fill='#ffffff' d='M0,0 h${modules.length}v${modules.length}H0z' />
<path fill='#000000' d='${genSvgQrPath(modules)}' />
</svg>`
