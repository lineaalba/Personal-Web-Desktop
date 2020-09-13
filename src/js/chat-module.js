/**
 * A chat component
 *
 * @author Filippa Jakobsson
 * @version 1.0
 *
 * @class Chat
 * @extends {window.HTMLElement}
 */

const template = document.createElement('template')
template.innerHTML =
`<div id="chat">
    <div id="choose">
      <br>
      <h3>Select a username</h3>
      <input class="username" type="text" placeholder="Username"/><br>
      <button class="next">Next</button>
    </div>

    <template class="chat-template">
      <form class="form-container">
        <textarea class="messages"></textarea>
<hr>
        <span id="smile">😊</span>
        <span id="love">😍</span>
        <span id="like">👍</span>
        <span id="laugh">😂</span>
        <span id="happy">😃</span>
        <span id="angry">😡</span>
        <span id="sad">😔</span>
        <span id="party">🥳</span>
        <span id="heart">❤️</span>
        <span id="hug">🤗</span>
        <span id="cool">😎</span>
<hr>
        <textarea class="input" name="msg" required placeholder="Type your message here..."></textarea>
        <br>
        <button class="send">Send</button>
      </form>
    </template>
</div>

<style>
:host {
  text-align:center;
  }

.username {
  padding:2px 2px;
  border-radius:2px;
}

.username:focus {
  background-color:#ddd;
  outline-color:#4CAF50;
  outline-style:solid 2px;
}

.messages {
  height:130px;
  width:295px;
  text-align:left;
  border-radius:2px;
}

.form-container {
  position:absolute;
}

.input {
  width:280px;
  padding:10px;
  border-radius:10px;
  background:#f1f1f1;
  resize:none;
  height:40px;
}

.input:focus {
  background-color:#ddd;
  outline:none;
}

.send {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:60px;
  margin-top:5px;
  margin-bottom:5px;
  opacity:0.8;
}

.send:hover {
  opacity:1;
}

.next {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:60px;
  margin-top:8px;
  opacity:0.8;
}

.next:hover {
  opacity:1;
}

#yesbtn {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:60px;
  margin-top:8px;
  opacity:0.8;
  margin:1px;
}

#yesbtn:hover {
  opacity:1;
}

#nobtn {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:60px;
  margin-top:8px;
  opacity:0.8;
  margin:1px;
}

#nobtn:hover {
  opacity:1;
}`

class Chat extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.startChat()
  }

  disconnectedCallback () {
    this.socket.close()
  }

  startChat () {
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'charcords')
    this.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    this.nickname = JSON.parse(window.localStorage.getItem('nickname')) || []
    this.channel = 'channel-1'

    if (this.nickname.length === 0) {
      this.nextBtn = this.shadowRoot.querySelector('.next')

      this.username = this.shadowRoot.querySelector('.username')
      this.username.focus()

      this.username.addEventListener('keyup', e => {
        e.preventDefault()

        if (e.keyCode === 13) {
          this.nextBtn.click()
        }
      })

      this.nextBtn.addEventListener('click', e => {
        e.preventDefault()

        if (this.username.value.length === 0) {
          this.username.placeholder = 'Too short username!'
          return
        }

        this.choose = this.shadowRoot.querySelector('#choose')
        this.choose.innerHTML = ''
        this.storeName()

        const template = this.shadowRoot.querySelector('.chat-template')
        const templateContent = template.content
        this.shadowRoot.appendChild(templateContent.cloneNode(true))

        this.message()
        this.emojis()
      })
    } else if (this.nickname.length >= 1) {
      this.choose = this.shadowRoot.querySelector('#choose')
      this.choose.innerHTML = ''
      const h3 = document.createElement('h3')
      h3.innerText = '\n' + 'Continue as ' + '"' + this.nickname[0] + '"?'
      const yesBtn = document.createElement('button')
      yesBtn.id = 'yesbtn'
      yesBtn.textContent = 'Yes'
      const noBtn = document.createElement('button')
      noBtn.id = 'nobtn'
      noBtn.textContent = 'No'

      this.choose.appendChild(h3)
      this.choose.appendChild(yesBtn)
      this.choose.appendChild(noBtn)

      yesBtn.addEventListener('click', e => {
        e.preventDefault()

        this.choose.innerHTML = ''
        const template = this.shadowRoot.querySelector('.chat-template')
        const templateContent = template.content
        this.shadowRoot.appendChild(templateContent.cloneNode(true))

        this.message()
        this.emojis()
      })

      noBtn.addEventListener('click', e => {
        e.preventDefault()

        this.shadowRoot.querySelector('#chat').innerHTML = ''
        window.localStorage.removeItem('nickname')

        this.startChat()
      })
    }
  }

  // Store username in localStorage
  storeName () {
    const name = this.username.value
    this.nickname.push(name)
    window.localStorage.setItem('nickname', JSON.stringify(this.nickname))
  }

  message () {
    const send = this.shadowRoot.querySelector('.send')
    this.input = this.shadowRoot.querySelector('.input')
    this.input.focus()

    this.input.addEventListener('click', e => {
      e.preventDefault()

      this.input.focus()
    })

    send.addEventListener('click', e => {
      e.preventDefault()

      if (this.input.value.length === 0) {
        return
      }

      const data = {
        type: 'message',
        data: this.input.value,
        username: this.nickname[0],
        channel: this.channel,
        key: this.key
      }

      this.socket.send(JSON.stringify(data))

      this.input.value = ''
    })

    this.input.addEventListener('keyup', e => {
      e.preventDefault()

      if (e.keyCode === 13) {
        send.click()
      }
    })

    const messageBox = this.shadowRoot.querySelector('.messages')

    this.socket.addEventListener('message', e => {
      e.preventDefault()

      const response = JSON.parse(e.data)

      if (response.username === 'The Server') {
        return
      }

      const ul = document.createElement('ul')
      ul.innerText = response.username + ': ' + response.data

      messageBox.textContent += ul.innerText + '\n'
      messageBox.scrollTop = messageBox.scrollHeight
    })
  }

  emojis () {
    const smile = this.shadowRoot.querySelector('#smile')
    const love = this.shadowRoot.querySelector('#love')
    const like = this.shadowRoot.querySelector('#like')
    const laugh = this.shadowRoot.querySelector('#laugh')
    const happy = this.shadowRoot.querySelector('#happy')
    const angry = this.shadowRoot.querySelector('#angry')
    const sad = this.shadowRoot.querySelector('#sad')
    const party = this.shadowRoot.querySelector('#party')
    const heart = this.shadowRoot.querySelector('#heart')
    const hug = this.shadowRoot.querySelector('#hug')
    const cool = this.shadowRoot.querySelector('#cool')

    smile.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += smile.innerText
    })

    love.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += love.innerText
    })

    like.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += like.innerText
    })

    laugh.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += laugh.innerText
    })

    happy.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += happy.innerText
    })

    angry.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += angry.innerText
    })

    sad.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += sad.innerText
    })

    party.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += party.innerText
    })

    heart.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += heart.innerText
    })

    hug.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += hug.innerText
    })

    cool.addEventListener('click', e => {
      e.preventDefault()
      this.input.value += cool.innerText
    })
  }
}

// registers the custom element
window.customElements.define('chat-module', Chat)
