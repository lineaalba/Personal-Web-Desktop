import './memory-game.js'
import zindexcounter from './zindexcounter.js'

/**
 * A window component
 *
 * @author Filippa Jakobsson
 * @version 1.0
 *
 * @class Window
 * @extends {window.HTMLElement}
 */
const template = document.createElement('template')
template.innerHTML =
`<div class="windowcontainer">
<div class="window">
    <div class="windowheader">
    <a href='#'><img src='./image/memory.png' id="memoimg" alt='memory-game' /></a>
    Memory
    </div>
<hr>
    <div class="close">+</div>
    <memory-game></memory-game>
</div>
</div>


<style>
:host {
}

#memoimg {
  width:18px;
}

.window {
  width:300px;
  height:300px;
  background:#151719;
  text-align:left;
  padding:20px;
  position:absolute;
  cursor:grab;
  border:1px solid #d3d3d3;
  border-radius:5px;
}

.windowheader {
  padding:2px;
  cursor:grab;
  background-color:#4CAF50;
  width:320px;
  position:absolute;
  top:5px;
  left:8px;
  font-size:14px;
  color:white;
  border-radius:2px;
}

.close {
  position:absolute;
  top:0;
  right:14px;
  font-size:30px;
  transform:rotate(45deg);
  cursor:pointer;
  color:white;
}

.close:hover {
  color:#ddd;
}`

class Window extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.window = this.shadowRoot.querySelector('.window')

    this.windowHeader = this.shadowRoot.querySelector('.window' + 'header')

    this.isDown = false
    this.offset = [0, 0]
    this.mousePosition = {}
  }

  connectedCallback () {
    this.closeWindow()
    this.dragWindow()
    this.clickWindow()
  }

  // Add focus on clicked window by increasing z-index by 1
  clickWindow () {
    this.window.addEventListener('click', e => {
      if (!zindexcounter.counter) {
        zindexcounter.counter = 1
        this.window.style.zIndex = zindexcounter.counter
      } else {
        zindexcounter.counter++
        this.window.style.zIndex = zindexcounter.counter
      }
    })
  }

  closeWindow () {
    const x = this.shadowRoot.querySelector('.close')

    x.addEventListener('click', e => {
      e.preventDefault()
      this.window.innerHTML = ''
      this.window.style.display = 'none'
    })
  }

  // Create draggable windows
  dragWindow () {
    this.window.addEventListener('mousedown', e => {
      this.isDown = true
      this.windowHeader.style.cursor = 'grabbing'
      this.window.style.cursor = 'grabbing'

      this.offset = [
        this.window.offsetLeft - e.clientX,
        this.window.offsetTop - e.clientY
      ]
    }, true)

    this.window.addEventListener('mouseup', e => {
      this.isDown = false
      this.windowHeader.style.cursor = 'grab'
      this.window.style.cursor = 'grab'
    }, true)

    this.window.addEventListener('mousemove', e => {
      e.preventDefault()
      if (this.isDown) {
        this.mousePosition = {
          x: e.clientX,
          y: e.clientY
        }

        this.window.style.left = (this.mousePosition.x + this.offset[0]) + 'px'
        this.window.style.top = (this.mousePosition.y + this.offset[1]) + 'px'
      }
    }, true)
  }
}

// registers the custom element
window.customElements.define('window-module', Window)
