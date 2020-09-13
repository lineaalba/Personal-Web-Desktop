/**
 * A memory game component
 *
 * @author Filippa Jakobsson
 * @version 1.0
 *
 * @class Memory
 * @extends {window.HTMLElement}
 */

const template = document.createElement('template')
template.innerHTML =
`<div id="memo">
  <div id='memorycontainer'>
    <template>
      <a href='#'><img src='./image/0.png' id="img" alt='A memory brick' /></a>
    </template>
  </div>
</div>

<style>
:host {
text-align:center;
}

#img {
  width:70px;
}

.removed {
  visibility:hidden;
}

#saveBtn {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:60px;
  margin-top:8px;
  opacity:0.8;
}

#saveBtn:hover {
  opacity:1;
}

#scores {
  color:white;
  text-align:left;
  margin-left:auto;
  margin-right:auto;
}

#startgamebtn {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:60px;
  margin-top:8px;
  opacity:0.8;
}

#startgamebtn:hover {
  opacity:1;
}`

class Memory extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.startGame()
  }

  startGame () {
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.memo = this.shadowRoot.querySelector('#memo')
    this.container = this.shadowRoot.querySelector('#memorycontainer')
    this.template = this.shadowRoot.querySelectorAll('#memorycontainer template')[0].content.firstElementChild

    this.tiles = []
    this.turn1 = this.turn1
    this.turn2 = this.turn2
    this.lastTile = this.lastTile
    this.pairs = 0
    this.tries = 0

    this.createBricks()
  }

  createBricks () {
    this.tiles = this.getPictureArray()
    this.tiles.forEach((tile, index) => {
      const a = document.importNode(this.template, true)

      this.container.appendChild(a)

      a.addEventListener('click', e => {
        e.preventDefault()
        const img = e.target.nodeName === 'IMG' ? e.target : e.target.firstElementChild
        this.turnBrick(tile, index, img)
      })

      if (index === 3) {
        this.container.appendChild(document.createElement('br'))
      } else if (index === 7) {
        this.container.appendChild(document.createElement('br'))
      } else if (index === 11) {
        this.container.appendChild(document.createElement('br'))
      }
    })
  }

  turnBrick (tile, index, img) {
    if (this.turn2) { return }

    img.src = 'image/' + tile + '.png'

    if (!this.turn1) {
      // first brick is clicked

      this.turn1 = img
      this.lastTile = tile
    } else {
      // second brick is clicked
      if (img === this.turn1) { return }

      this.tries += 1

      this.turn2 = img

      if (tile === this.lastTile) {
        // Found a pair

        this.pairs += 1

        if (this.pairs === 16 / 2) {
          this.displayScore()
        }

        window.setTimeout(() => {
          this.turn1.parentNode.classList.add('removed')
          this.turn2.parentNode.classList.add('removed')

          this.turn1 = null
          this.turn2 = null
        }, 300)
      } else {
        window.setTimeout(() => {
          this.turn1.src = 'image/0.png'
          this.turn2.src = 'image/0.png'

          this.turn1 = null
          this.turn2 = null
        }, 500)
      }
    }
  }

  /**
   * @returns {array} - an array with
   */

  getPictureArray () {
    const arr = []

    for (let i = 1; i <= (16 / 2); i++) {
      arr.push(i)
      arr.push(i)
    }

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
    return arr
  }

  displayScore () {
    this.container.innerHTML = ''
    this.h3 = document.createElement('h3')
    this.h3.textContent = 'You won on ' + this.tries + ' number of tries! Save score?'
    this.container.appendChild(this.h3)

    this.input = document.createElement('input')
    this.input.setAttribute('type', 'text')
    this.input.placeholder = 'Type your name here'

    this.container.appendChild(this.input)
    const space = document.createElement('br')
    this.container.appendChild(space)

    this.button = document.createElement('button')
    this.button.textContent = 'Save'
    this.button.id = 'saveBtn'
    this.container.appendChild(this.button)
    this.input.focus()

    this.input.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        e.preventDefault()
        this.button.click()
      }
    })

    this.button.addEventListener('click', e => {
      e.preventDefault()
      if (this.input.value.length >= 1) {
        this.button.setAttribute('disabled', '')
        this.storeScores()
      } else {
        this.input.placeholder = 'Too short name!'
      }
    })
  }

  // Save name and scores in localStorage

  storeScores () {
    const score = {
      name: this.input.value,
      highscore: this.tries
    }

    this.tries = window.localStorage.getItem('tries')

    const highScores = JSON.parse(window.localStorage.getItem('highScores')) || []

    highScores.push(score)
    highScores.sort((a, b) => a.highscore - b.highscore)
    highScores.splice(5)

    window.localStorage.setItem('highScores', JSON.stringify(highScores))

    const h3 = document.createElement('h3')
    h3.textContent = 'Highscores top 5:'
    this.container.appendChild(h3)
    const table = document.createElement('table')
    table.id = 'scores'
    for (let i = 0; i < highScores.length; i++) {
      this.h3.textContent = ''
      this.input.style.display = 'none'
      this.button.style.display = 'none'
      table.innerHTML += '<tr><td>' + [i + 1] + '. </td><td>' + highScores[i].name + ': </td><td>' + highScores[i].highscore + ' tries</td></tr>'
      this.container.appendChild(table)
    }
    this.startGameBtn()
  }

  startGameBtn () {
    const startGameBtn = document.createElement('button')
    startGameBtn.id = 'startgamebtn'
    startGameBtn.textContent = 'New game'
    const space = document.createElement('br')
    this.container.appendChild(space)
    this.container.appendChild(startGameBtn)

    startGameBtn.addEventListener('click', e => {
      e.preventDefault()
      this.container.innerHTML = ''
      this.memo.innerHTML = ''
      this.startGame()
    })
  }
}

// registers the custom element
window.customElements.define('memory-game', Memory)
