
let main = {
  selected: null,
  choice: null,
  graphLine: []

}
let animationState = {
  frames: [],
  whichFrame: 0,
  stopped: true
}
let inputState = {
  mass: 50,
  myInput: null,
  time: 20,
  countOver: false
}


function preload() {
  let numFrames = 30; // Total no. of frames
  for (let i = 0; i < numFrames; i++) { //iterate over 0 to 29
    let filename = 'Images/sprites/' + i + '.png'; //i(loop index) is used
    print(`Fetched: ${filename}`);     //to determine the file name
    let frame = loadImage(filename); //loads image with corresponding
    animationState.frames.push(frame);            //filename and is pushed into a 
  }                                  //global array called frames
  dosis = loadFont('fonts/Dosis.ttf'); 

}
function setup() {
  createCanvas(800, 500);
  setupButtons()
  setupToggle()
  setupInput()
  
  frameRate(60);

}

function setupButtons(){
   kno3 = new outlinedButton(65, 350, 'Potassium Nitrate', 150, 20 );
   licl = new outlinedButton(65, 380, 'Lithium Chloride', 150, 20, );
   naoh = new outlinedButton(65, 410, 'Sodium Hydroxide', 150, 20 );
   kcl = new outlinedButton(65, 440, 'Potassium Chloride', 8150, 20, );
}

function setupToggle(){
  main.choice = new toggleSwitch(55, 40, 'Energy Diagram', 'Summation of Heat', true, 340, 40)
  energyDiagram = new graph('Time','Energy (kJ/mol)')
  sumOfHeat = new graph('', 'Increasing Enthalpy')

}

function setupInput(){
   // make an input box
  inputState.myInput = createInput('50');  //Create an input box with default value written as 50
  inputState.myInput.size(100);            //Set the size of the input box to 100 pixels
  inputState.myInput.value(inputState.mass)           //initial value is given by mass, which is 50
  inputState.myInput.position(670, 205);   // position the input at given coordinates
  inputState.myInput.input(typing)         //attach the 'typing' function for input changes
}


function typing(){
  inputState.mass = inputState.myInput.value()               //Get the current value of the input box
  inputState.mass = inputState.mass.replace(/[^0-9]/g, '');  // Restrict to integers
   if (inputState.mass === "") {
    console.log("Input is empty.  Defaulting to 50.");
    inputState.mass = 50; // Default to 50 
  }
  inputState.mass = Number(inputState.mass)                  //convert the input value to a number
  console.log("Mass:", inputState.mass, "Type:", typeof inputState.mass); 
  //print mass value and its type

}
function grid(){
  // Draw grid
  stroke(190);
  strokeWeight(0.5);
  for (let i = -10; i < width; i += 20) {
    line(i, 0, i, height);
  }
  for (let i = -10; i < height; i += 20) {
    line(0, i, width, i);
  }
  
}

function chemicalSelection(){
  // Draw chemical selection panel
  fill(111, 182, 237);
  rect(50, 300, 180, 180, 10);
  fill(255);
  rect(55, 305, 170, 170, 10);

  textSize(20);
  noStroke();
  fill(0);
  textFont(dosis)
  text('Chemicals:', 70, 340);
}

function equationPanel(){
   //draw equation panel
  strokeWeight(6)
  fill(250, 250, 250)
  stroke(4, 50, 65)
  rect(280, 415, 430, 60, 10)
  
  //arrows
  fill(4, 50, 65)
  rect(410, 440, 90, 6, 2)
  triangle(500, 430, 520, 445, 500, 460)
  noStroke()
  textSize(20)
  text( 'H₂O', 445, 435)
}
 
 
    

function handleButtons(){
   // Display buttons
   kno3.show();
  licl.show();
  naoh.show();
  kcl.show();
  //outlines
    strokeWeight(1)
  kno3.outlineCircle();
  licl.outlineCircle();
  naoh.outlineCircle();
  kcl.outlineCircle();
   // Check for button presses and update the selected button
  //passes button, chemical, cation, anion
  if (kno3.isPressed()) {
    startAnimation(kno3, 'KNO₃', 'K⁺', 'NO₃⁻' )
  } else if (licl.isPressed()) {
    startAnimation(licl, 'LiCl', 'Li⁺', 'Cl⁻')
  } else if (naoh.isPressed()) {
    startAnimation(naoh, 'NaOH', 'Na⁺', 'OH⁻')
  } else if (kcl.isPressed()) {
    startAnimation(kcl, 'KCl', 'K⁺', 'Cl⁻')
  }
}

function handleMain(Hsoln, mr){
  //checks whether selected is not empty
  let temp;
   if (main.selected != null) {
      // Fill the circle for the selected button
    main.selected.filled(); 
    //class method that fills the circle 
     //passes the following parameters to showEQ
    showEQ(
        main.selected.equation.chemical,  
        main.selected.equation.cation,
        main.selected.equation.anion  );
        temp = finalTemp(Hsoln, mr)  
   }  countdown(temp)
}
 

function infosheet(Hsoln, mr){
  //infosheet display
  fill(0)
  noStroke()
  let font_x = 620
  //constant values
  textFont('Verdana', 15)
  text('Known:', font_x, 200)
  text('Mass: ', font_x, 220)
  text('mass H₂O: 1000g ', font_x, 280)
  text('Tinitial(H₂O) = 20.0∘C  ', font_x, 300)
  text('c(H₂O)=4.18 J/g∘C:', font_x, 320)
  
  //values that vary per chemical
  text(`Molar Mass: ${mr}`, font_x, 240)//displays the value for
  text(`ΔHₛₒₗₙ: ${Hsoln} `, font_x, 260)//molar mass &molar heat of soln.
  //Displaying countdown
  fill(255, 182, 193)
  textSize(30)
  text(`${inputState.time} ℃`, 500, 350) 

}


function graphHandling(Hsoln, lattice, hydration){
  //Graphs
  //energy
  //toggle switch
  textFont(dosis, 20)
  main.choice.show()
  main.choice.toggle()
  //draw graphLine
  stroke(0)
  strokeWeight(3)
  line(85, 100, 85, 270)
  line(85, 270, 320, 270)
  //displays text depending on choice.state
  if (main.choice.state == true){ //change graph shown 
    energyDiagram.show()
    energyDiagram.graph(Hsoln)
    
  } else{
    sumOfHeat.show()
    if (Hsoln != null){ 
      sumOfHeat.graph2(Hsoln, 
      main.selected.equation.chemical, 
      main.selected.equation.cation, 
      main.selected.equation.anion, lattice, hydration) //pass to graph2 function
    }
  }
}
function draw() {
  background(255); 
  
  grid()
  chemicalSelection()
  equationPanel()
  handleButtons()

  strokeWeight(0)

  rotate(QUARTER_PI / 10)
  animation() 
  resetMatrix()
  
  //properties array
  chemicals = [
   [kno3, 34.9, 101.10, -685.0, +34.9 ], 
   [licl, -37.1, 42.34, -859, -792 ], 
   [kcl, 17.2, 74.55, 719, -684 ],
   [naoh, -44.51, 40, -887, -932]
   
  ]
  let Hsoln
  let mr
  let temp
  let hydration
  let lattice
  
   for (i = 0; i<chemicals.length; i++){//loop through chemicals array
    if (main.selected == chemicals[i][0]){//if selected matches a chemical name
      Hsoln = chemicals[i][1] //fetch the molar heat of solution
      mr = chemicals[i][2] //fetch molar mass
      lattice = chemicals[i][3] //fetch lattice enthalpy
      hydration = chemicals[i][4] //fetch hydration enthalpy
    }
  } 
  
  //countdown
  handleMain(Hsoln, mr)
  countOver = false 
  
  //graphs
  graphHandling(Hsoln, lattice, hydration)  
  //infosheet
  infosheet(Hsoln, mr)         
   
}

function finalTemp(Hsoln, mr){
  //calculation for final temp
  let volumeWater = 1000    //volume of water in grams
  let Cp = 4.18             //specific heat capacity
  let joules
  let i_temp = 20           //intial temp 
  
  //uses mass from input box
  joules = inputState.mass * (1/mr) * (Hsoln/1) * (1000/1)
  temp = joules/(Cp* volumeWater + inputState.mass)
  temp = i_temp - temp     //initial - calculated temp
  temp = Math.round(temp)  //round the final temp to nearest integer
  fill(255)

  return temp              //return the final temperature
}
function startAnimation(button, chemical, cation, anion){
  if (main.selected != button){//checks if previous button is the selected one 
    main.selected = button   //sets selected to the newly pressed button
    animationState.whichFrame = 0     //resets to 0
    animationState.stopped = false    //false so animation can restart
    main.selected.equation = {chemical, cation, anion};
    //assigns the corresponding equation
  }
 return main.selected
  
}

function countdown(temp){
    if (frameCount % 30 == 0 && inputState.time > temp && !countOver ) { 
      inputState.time --;    //decrease time if time is greater than final temp. calculated
    } else if(frameCount % 30 == 0 && inputState.time < temp && !countOver ){
      inputState.time ++ ;  //increase time if time is smaller than final temp.calculated
    }
  //stop counting down when the time matches the target temperature
    if (inputState.time == temp) {
      inputState.time = temp
      countOver = true //mark the countdown as complete
    }
}


function animation(){
  let x= 430
  let y = 180
  if (animationState.frames.length > 0) { //checks if frames is not empty
    imageMode(CENTER);
    if (!animationState.stopped) {
      animationState.whichFrame++; // Move to the next frame
      // Stop at the last frame and keep it
      if (animationState.whichFrame == animationState.frames.length) {
        animationState.whichFrame = animationState.frames.length - 1; // stays at the last frame
        animationState.stopped = true; // Set 'stopped' to true
      }
    } 
    image(animationState.frames[animationState.whichFrame], x, y, 800, 550);
    //display the current frame at x,y coordinate
  } else {
    // Show error message if no frames are loaded
    textSize(24);
    fill(255, 0, 0);
    text('Error: No frames loaded.', width / 2, height / 2);
  }
}

function showEQ(chemical, cation, anion){
  fill(0)
  textFont('Courier New', 30)
  text(`${chemical}         ${cation} + ${anion}`, 320, 455)
}

class toggleSwitch{
  constructor(x,y, label1, label2, state){
    this.x = x                //x-coordinate
    this.y = y                //y-coordinate
    this.label1 = label1     //acids label
    this.label2 = label2     //bases label
    this.state = state       //switches state between true or false(Acids/Bases)
    this.pressed = false     //determines whether the switch has been clicked.
    this.w = 340
    this.h = 40
  }
  
  show() {
    
    //toggle switch background = blue
    fill(111, 182, 237);                         
    rect(this.x, this.y, this.w, this.h , 20);
    
    
    //transparent blue slider
    fill(12, 82, 219, 100)
    rect(this.state ? this.x +2 : this.x+170, this.y+2, 165, 35, 100);
    //if true, blue slider is drawn on the left hand side of the switch
          //false: it moves to the right hand side
    
    
    //text
    //changes color depending on the state of the switch
    fill(this.state ? 255:0);    //white or black
    text(this.label1, this.x +20, this.y+25)
    fill(this.state ? 0:255);    //black or white
    text(this.label2, this.x+180, this.y+25)
    
  }
  
  toggle() {
  if (
    mouseIsPressed && 
    mouseX > this.x && 
    mouseX < this.x + 155 && 
    mouseY > this.y && 
    mouseY < this.y + this.h && 
    this.state == false && 
    this.pressed == false
  ) {  
    this.pressed = true;
    print(this.state);
    print('Energy Diagram');           
    this.state = !this.state; 
  } else if (
    mouseIsPressed && 
    mouseX > this.x + 155 && 
    mouseX < this.x + this.w && 
    mouseY > this.y && 
    mouseY < this.y + this.h && 
    this.state == true && 
    this.pressed == false
  ) {
    print('Summation of heat');
    this.pressed = true;
    this.state = !this.state;
  }
  
  // Reset the `pressed` state when the mouse is released
  if (!mouseIsPressed) {
    this.pressed = false;
  }
 }
}
   
class graph{
  constructor(x_label, y_label,){
    this.x_label = x_label
    this.y_label = y_label
    this.startX = 90
    this.startY = 270

  }
  show(){
    fill(0)
    translate(100, 120); // Center of rotation
    rotate(QUARTER_PI * -2) //rotates text
    noStroke()
    text(this.y_label,-130, -20)
    resetMatrix()
    text(this.x_label,  170, 290)
  }
  graph(hsoln){
    fill(255, 182, 193)
    stroke(0); 
    // Reset graph when a new animation starts
    if (!animationState.stopped) {
        //sets x to starting coordinate
        this.startX = 90;  
        //sets y to fixed value depending on value of hsoln
        this.startY = hsoln > 0 ? 270 : 100;
        //clears the array
        main.graphLine = [];
    }
    // check if hsoln is not null based on selected button
    //Starts the animation for the energy diagram graph
    if (hsoln != null  ) { 
        let endY = map(hsoln, 60, -60, 100, 270); 
        //map hsoln into a value between the graph [100, 270]
        if (this.startX < 130) {  //draw horizontal line
            this.startX += 2;  
            this.startY = hsoln > 0 ? 250 : 130; //value for this.startY depends if hsoln is 
                                                //-ve or +ve
   
        } else if (this.startX >= 130 && this.startX < 270) {
            //draws the diagonal line
            this.startX += 2;
            if(abs(this.startY - endY) > 2){
              //calculates the diff. b/w startY and endY
              //this.startY changes coordinates until difference is lower than or equal to 2
              //finds the absolute value so that it will work whether startY is below/above endY
              this.startY += hsoln > 0 ? -2 : 2; //move up/down depending on value of Hsoln
            }

        } else if (this.startX >= 270  &&this.startX < 300 ){
            this.startX += 2;//draw horizontal line
        }
        main.graphLine.push([this.startX, this.startY])
        circle(this.startX, this.startY, 10); //draws circle with this.startX and this.startY as x,y-coordinate
    }
        
    //draw line
    noFill()
    beginShape()  //begin drawing a custom shape
    //loop through each point in the graphLine array
        for(i = 0; i < main.graphLine.length; i++){
          //add a vertex point to the shape at the coordinates
          //specified 
          vertex(main.graphLine[i][0], main.graphLine[i][1])
          //graphLine[i][0] is the x-coordinate
          //graphLine[i][1] is the y-coordinate
        }
    endShape()  //end the shape
    
    beginShape()
        for(i = 0; i < main.graphLine.length; i++){
          vertex(280,  main.graphLine[i][1]) 
          //fixed x-coordinate
          //draws the y-coordinates in the graphLine array
        }
    endShape()
    
    strokeWeight(1)
    textSize(15)
    //draws value of hsoln alongside graph
    if(animationState.whichFrame > 25){
      text(`${hsoln} kj/mol 
released`, 290, 210)
    }
    
    
    if (animationState.whichFrame == animationState.frames.length - 1) {
        animationState.stopped = true;  //when whichFrame reaches its last frame,
      //stopped is true, both pack and graph animation stop working
    }    
    
  }
    
  graph2(hsoln, chemical, cation, anion, lattice, hydration){
    stroke(0)
    textSize(10)
    this.startY = hsoln > 0 ?  230 : 200
    line(90, this.startY, 175, this.startY)
    line(175, this.startY, 175, 120)
    line(165, 120, 260, 120)
    triangle(170, 135, 175, 130, 180, 135)
    
    noStroke()
    textFont('Oswald', 12)
    text(`${chemical}(s) + H₂O(l)`, 88, this.startY - 5 )
    text(`${cation}(g) + ${anion}(g)`, 175, 115)
    
    stroke(0)
    this.startY = map(hsoln, 60, -60, 100, 270);
    line(250, 120, 250, this.startY)
    line( 250, this.startY, 330, this.startY)
    triangle(245, this.startY - 15, 250, this.startY - 10, 255, this.startY -15)
    
    
    noStroke()
    text(`${cation}(aq) + ${anion}(aq)`, 255, this.startY - 5 )
    text(`Lattice 
Enthalpy
${lattice}`, 90, 150)
    text(`Hydration 
Enthalpy
${hydration}`, 280, 180)
  }
}

class outlinedButton extends buttons{
  outlineCircle() {
    noFill();
    stroke(0);
    circle(this.x + 7, this.y + 10, 15);
  }
  filled() {
    fill(111, 182, 237);
    noStroke();
    circle(this.x + 7, this.y + 10, 8);
  }
}
