class buttons{
  constructor(x,y,label, w, h){
    this.x = x
    this.y = y
    this.label = label
    this.w = w
    this.h = h
    this.pressed = false
  }
  
  show(){
    noFill()
    rect(this.x, this.y, 70, 30)
    fill(0)
    text(this.label, this.x, this.y+25)
  }

  
  isPressed(){
    return(
      mouseIsPressed &&
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }
}

// Export the class 
if (typeof module !== "undefined") {
  module.exports = buttons;
}