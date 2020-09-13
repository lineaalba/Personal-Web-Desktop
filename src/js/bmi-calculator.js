/**
 * A bmi calculator component
 *
 * @author Filippa Jakobsson
 * @version 1.0
 *
 * @class Bmi
 * @extends {window.HTMLElement}
 */
const template = document.createElement('template')
template.innerHTML =
`<div class="container">
    <form>
      <br>
      <input class="weightInput" type="text" placeholder="Weight kg"/>
    
      <input class="heightInput" type="text" placeholder="Height m"/>
      <br><br>
      <button class="calculate">Calculate</button>
    </form>
  </div>

  <template class="bmi-table">
  <table>
    <tr>
      <th>BMI</th>
      <th>  Nutritional status</th>
    </tr>
    <tr>
      <td><18.5</td>
      <td> = Underweight</td>
    </tr>
    <tr>
      <td>18.5-24.9</td>
      <td> = Normal weight</td>
    </tr>
    <tr>
      <td>25.0-29.9</td>
      <td> = Pre-obesity</td>
    </tr>
    <tr>
      <td>30.0-34.9</td>
      <td> = Obesity class I</td>
    </tr>
    <tr>
      <td>35.0-39.9</td>
      <td> = Obesity class II</td>
    </tr>
    <tr>
      <td>>40</td>
      <td> = Obesity class III</td>
    </tr>
  </table>
</template>
</div>

<style>
:host {
  text-align:center;
}

.calculate {
  background-color:#4CAF50;
  color:white;
  padding:2px 2px;
  border-radius:2px;
  cursor:pointer;
  width:70px;
  margin-top:5px;
  margin-bottom:5px;
  opacity:0.8;
}

.weightInput {
  width:220px;
  padding:2px 2px;
  border-radius:2px;
}

.weightInput:focus {
  background-color:#ddd;
  outline-color:#4CAF50;
  outline-style:solid 2px;
}

.heightInput:focus {
  background-color:#ddd;
  outline-color:#4CAF50;
  outline-style:solid 2px;
}

.heightInput {
  width:220px;
  padding:2px 2px;
  border-radius:2px;
}

.calculate:hover {
  opacity:1;
}

.table {
  color:white;
  text-align:left;
  margin-left:auto;
  margin-right:auto;
}`

class Bmi extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })

    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.weight = this.shadowRoot.querySelector('.weightInput')
    this.weight.focus()

    this.height = this.shadowRoot.querySelector('.heightInput')
  }

  connectedCallback () {
    this.calculate()
  }

  calculate () {
    const calcBtn = this.shadowRoot.querySelector('.calculate')

    calcBtn.addEventListener('click', e => {
      e.preventDefault()

      const bmi = this.weight.value / (this.height.value * this.height.value)

      const container = this.shadowRoot.querySelector('.container')
      container.innerHTML = ''

      const h3 = document.createElement('h3')
      h3.innerText = '\n Your BMI is ' + bmi.toFixed(2) + '\n'
      container.appendChild(h3)
      const template = this.shadowRoot.querySelector('.bmi-table')
      const templateContent = template.content
      this.shadowRoot.appendChild(templateContent.cloneNode(true))

      const table = this.shadowRoot.querySelectorAll('table')[0]
      table.setAttribute('class', 'table')
    })
  }
}

// registers the custom element
window.customElements.define('bmi-calculator', Bmi)
