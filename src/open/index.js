const run = () => {
  document.onkeydown = (e) => {
    if (e.key === 'Control') {
      document.addEventListener('mouseover', handleOver)
      document.addEventListener('click', handleClick)      
    }
  }
  document.onkeyup = (e) => {
    if (e.key === 'Control') {
      preHoverDom && preHoverDom.removeAttribute('style')
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('click', handleClick)
    }
  }
}
run()

let preHoverDom = false

function handleOver(e) {
  if (e.path[0]) {
    preHoverDom && preHoverDom.removeAttribute('style')
    preHoverDom = e.path[0]
    e.path[0].setAttribute('style', 'background: rgba(255,255,255,0.25)')
  }
}

const axios = require('axios')
const instance = axios.create({
  baseURL: `http://localhost:8080/`
})
function handleClick(e) {
  e.preventDefault()
  console.log(e)
  if (e.path[0]) {
    console.dir(e.path[0])
    instance.get(`?path=${e.path[0].className}`).then((data) => { console.log(data) })
  }
}