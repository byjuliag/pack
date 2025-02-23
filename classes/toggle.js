class toggleSwitch{
  constructor(x,y, label1, label2, state, w, h){
    this.x = x                //x-coordinate
    this.y = y                //y-coordinate
    this.label1 = label1     //acids label
    this.label2 = label2     //bases label
    this.state = state       //switches state
    this.w = w
    this.h = h
  }
  
  show() {
    
    //toggle switch background = blue
    fill(111, 182, 237);                         
    rect(this.x, this.y, 190, 40, 20);
    
    
    //transparent blue slider
    fill(12, 82, 219, 100)
    rect(this.state ? this.x +2 : this.x+87, this.y+2, 100, 35, 100);
    //if true, blue slider is drawn on the left hand side of the switch
          //false: it moves to the right hand side
    
    
    //text
    //changes color depending on the state of the switch
    fill(this.state ? 255:0);    //white or black
    text(this.label1, this.x +20, this.y+25)
    fill(this.state ? 0:255);    //black or white
    text(this.label2, this.x+120, this.y+25)
    
  }
  
  toggle(){
    if(mouseIsPressed &&  //check if within boundaries of acids
       mouseX > this.x &&
       mouseX < this.x + 90  && 
       mouseY > this.y && 
       mouseY < this.y + 40 && 
       this.state == false){ 
             
      print(this.state)                    
      this.state = !this.state 
      
    } else if(mouseIsPressed && //check if within boundaries of bases
              mouseX > this.x + 100 && 
              mouseX < this.x + 190 && 
              mouseY > this.y && 
              mouseY < this.y + 40 && 
              this.state == true             
              ){
      this.state = !this.state  //changes state
     }
  }
}