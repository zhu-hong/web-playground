export const useScanCode = (diff = 30) => {
  let codeSplits = []
  let listening = false
  
  const clearCodeSplits = () => codeSplits = []
  
  const parseScanCode = (list) => {
    const { length } = list
  
    if (length <= 1) return ''
  
    let res = ''
  
    for (let i = 0; i < length; i++) {
      const prev = list[i - 1]
      const current = list[i]
  
      if(prev && current.timestamp - prev.timestamp >= diff) return ''
  
      res += current.key
    }
  
    return res
  }
  
  const scanListener = ({ keyCode, key, target }) => {
    const { tagName } = target
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
      clearCodeSplits()
      return
    }
  
    if(keyCode === 13) {
      const code = parseScanCode(codeSplits)
      clearCodeSplits()
      if(code.trim() !== '') {
        scanCodeMitt(code)
      }
    } else {
      codeSplits.push({
        key,
        timestamp: Date.now(),
      })
    }
  }

  const scanCodeMitt = (code) => {
    callbacks.forEach((cb) => cb(code))
  }
  
  const start = () => {
    clearCodeSplits()

    if(listening === true) return
    document.addEventListener('keyup', scanListener)

    listening = true
  
    return stop
  }
  
  const stop = () => {
    if(listening === false) return
    document.removeEventListener('keyup', scanListener)

    clearCodeSplits()
    callbacks = []

    listening = false
  }
  
  let callbacks = []
  
  const onScan = (cb) => callbacks.push(cb)

  return {
    start,
    stop,
    onScan,
  }
}
