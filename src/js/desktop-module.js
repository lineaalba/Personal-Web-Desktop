
/**
 * A desktop component
 *
 * @author Filippa Jakobsson
 * @version 1.0
 *
 * @class Desktop
 * @extends {window.HTMLElement}
 */

const template = document.createElement('template')
template.innerHTML =
`<div id="desktop">
  <div id="sidebar">
    <div class="toggle-btn">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <ul>
      <li id="memo">
      <a href='#'><img src='./image/memory.png' id="memoimg" alt='memory-game' /></a>
      </li>
      <li id="chat">
      <a href='#'><img src='./image/chat.png' id="chatimg" alt='chat' /></a>
      </li>
      <li id="bmi">
      <a href='#'><img src='./image/bmi.png' id="bmi-img" alt='bmi-calculator' /></a>
      </li>
    </ul>
  </div>

<style>
:host {
  margin:0px;
  padding:0px;
  font-family:sans-serif;
}

#memoimg {
  width:30px;
}

#memoimg:hover {
  width:40px
}

#chatimg {
  width:30px;
}

#chatimg:hover {
  width:40px
}

#bmi-img {
  width:30px;
}

#bmi-img:hover {
  width:40px
}

#sidebar {
  position:fixed;
  width:150px;
  height:100%;
  background:#151719;
  left:0px;
  top:0px;
  transition:350ms;
}

#sidebar.active {
  left:-150px;
}

#sidebar ul li {
  color:rgba(230,230,230,0.9);
  list-style:none;
  padding:12px 7px;
  border-bottom:1px solid rgba(100,100,100,0.3);
  cursor:pointer;
}

#sidebar .toggle-btn {
  position:absolute;
  left:170px;
  top:20px;
  cursor:pointer;
  background-color:white;
}

#sidebar .toggle-btn span {
  display:block;
  width:30px;
  height:3px;
  background:#151719;
  margin:3px 0px;
}`

class Desktop extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.highestZindex = 0
  }

  connectedCallback () {
    this.toggleSidebar()
    this.playMemo()
    this.startChat()
    this.bmiCalcutator()
  }

  toggleSidebar () {
    const toggleBtn = this.shadowRoot.querySelector('.toggle-btn')

    toggleBtn.addEventListener('click', e => {
      e.preventDefault()
      this.shadowRoot.querySelector('#sidebar').classList.toggle('active')
    })
  }

  playMemo () {
    const memoBtn = this.shadowRoot.querySelector('#memo')

    memoBtn.addEventListener('click', async e => {
      e.preventDefault()
      await import('./window-module.js')

      const window = document.createElement('window-module')
      window.setAttribute('class', 'appwindow')
      this.shadowRoot.appendChild(window)

      window.addEventListener('click', e => {
        e.preventDefault()

        this.highestZindex++
        window.style.zIndex = this.highestZindex
      })
    })
  }

  startChat () {
    const chatBtn = this.shadowRoot.querySelector('#chat')

    chatBtn.addEventListener('click', async e => {
      e.preventDefault()
      await import('./chat-window.js')

      const window = document.createElement('chat-window')
      window.setAttribute('class', 'appwindow')
      this.shadowRoot.appendChild(window)

      window.addEventListener('click', e => {
        e.preventDefault()

        this.highestZindex++
        window.style.zIndex = this.highestZindex
      })
    })
  }

  bmiCalcutator () {
    const bmiBtn = this.shadowRoot.querySelector('#bmi')

    bmiBtn.addEventListener('click', async e => {
      e.preventDefault()
      await import('./bmi-window.js')
      const window = document.createElement('bmi-window')
      window.setAttribute('class', 'appwindow')
      this.shadowRoot.appendChild(window)

      window.addEventListener('click', e => {
        e.preventDefault()

        this.highestZindex++
        window.style.zIndex = this.highestZindex
      })
    })
  }
}

// registers the custom element
window.customElements.define('desktop-module', Desktop)
