export class ScreenDebugger {
  constructor({payload, position = null}) {
    // Basics
    this.position = position;
    this.payload = payload;

    this.div = null

    // Initial
    this.init();
  }

  init() {
    this.div = document.createElement('div');

    // Set some attributes
    this.div.style.padding = '2px 6px 2px 6px'
    this.div.style.color = 'white'
    this.div.style.fontWeight = 'bold'
    this.div.style.position = 'absolute'
    this.div.style.textAlign = 'center';
    this.div.style.fontFamily = 'Arial'
    this.div.style.fontSize = '10px'
    this.div.style.backgroundColor = 'rgba(255,0,0,.4)';

    // Main attributes
    this.div.innerText = this.payload
    if(this.position) {
      this.div.style.left = this.position.x + 'px'
      this.div.style.top = this.position.y + 'px'
    }

    if(!this.position) {
      this.div.style.left = window.screenLogger.position.x + 'px'
      this.div.style.top = window.screenLogger.position.y + 'px'
      window.screenLogger.position.y = window.screenLogger.position.y + 25;
    }

    // Append the div to the body
    document.body.prepend(this.div);
  }


  update({payload, position}) {
    this.div.innerText = payload
    if(position) {
      this.div.style.left = position.x + 'px'
      this.div.style.top = position.y + 'px'
    }
  }
}
