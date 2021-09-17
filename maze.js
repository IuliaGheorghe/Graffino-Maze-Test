let startBttn = document.querySelector('#start-bttn');
let solveBttn = document.querySelector('#solve-bttn');
let resetBttn = document.querySelector('#reset-bttn');
let form = document.querySelector('form');
let container = document.getElementById('container')
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let mazeWidth, mazeHeight; // 3 3
let cellsNumber; // 3 * 3 = 9 cells
let startPointX, startPointY; // 1 3
let endPointX, endPointY; // 3 1
let brickDensity; // 25 (%)
let numberOfBricks; // 2

let firstMap = new Array; // will keep evidence of cell types
let secondMap = new Array;// will help in BFS to know if cell is visited, invalid, brick or end point

function setMap(width, height, bricks){

    // set rows for maze

    /* for example inputs:

        [
            [],
            [],
            []
        ]

    */

    for(let i = 0; i < height; i++)
    {
        firstMap.push(new Array);
        secondMap.push(new Array);
    }

    //set cells (only cells, no bricks, no start or end points)

    /*  for example inputs:

        [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ]

    */
    
    for(let i = 0; i < height; i++)
        for(let j = 0; j < width; j++)
        {
            firstMap[i].push(false);
            secondMap[i].push(false);

        }


    // subtracted 1 from coordinates points because arrays start form 0 and we select cell number (which starts from 1) in form 
    // for Y coordinates we would like to choose from bottom to top; the for loop searches form top to bottom, that's why we subtract coordinate from height 
    
        startPointX--;
        startPointY--;
        startPointY = height-startPointY-1;
        endPointX--;
        endPointY--;
        endPointY = height-endPointY-1;

    // set start and end point in maps

        firstMap[startPointY][startPointX] = 'start';
        secondMap[startPointY][startPointX] = 'start';
        firstMap[endPointY][endPointX] = 'end';
        secondMap[endPointY][endPointX] = 'end';

    // added random bricks

        for(let i = 0; i < bricks; i++)
        {
            let xRandom = Math.floor(Math.random() * mazeHeight);
            let yRandom = Math.floor(Math.random() * mazeWidth);

            // made sure brick won't cover another brick, the starting or the ending point
    
            while(firstMap[xRandom][yRandom]=== true || firstMap[xRandom][yRandom]==='start' || firstMap[xRandom][yRandom] === 'end')
            {
                xRandom = Math.floor(Math.random() * mazeHeight);
                yRandom = Math.floor(Math.random() * mazeWidth);
        
            }
    
            firstMap[xRandom][yRandom] = true;
            secondMap[xRandom][yRandom] = true;
        }
}


// made sure to draw cells in a responsive way (to adapt resolution)

function fillRectangle(i,j){
    ctx.fillRect(
        j*ctx.canvas.width/firstMap[i].length, 
        i*ctx.canvas.height/firstMap.length, 
        ctx.canvas.width/firstMap[i].length, 
        ctx.canvas.height/firstMap.length
    )
}

function drawMap(map){
    for(let i = 0; i<map.length; i++)
        for(let j = 0; j<map[i].length; j++){

            // filled start cell with light purple
            if(map[i][j] === 'start'){
                ctx.beginPath();
                ctx.fillStyle="#a29bfe";
                fillRectangle(i,j)
                
            }

            // filled start cell with darker purple
            else if(map[i][j] === 'end'){
                ctx.beginPath();
                ctx.fillStyle="#6c5ce7";
                fillRectangle(i,j)

            }

            // filled bricks with black (0.6 opacity)

            else if(map[i][j]){
                ctx.beginPath();
                ctx.fillStyle="rgba(0,0,0,0.6)";
                fillRectangle(i,j)
            }
        }
}


function formTransition(){
    // moves form from center to left
    form.classList.add("transition")
}

function showMaze(){

    canvas.style.display="block";
    
}

let start = function(){

    formTransition();
    startBttn.style.display = 'none';
    solveBttn.style.display = 'block';
    resetBttn.style.display = 'block';
    showMaze();

    // collect data from inputs

    mazeWidth = document.getElementById('maze-width').value;
    mazeHeight = document.getElementById('maze-height').value;
    cellsNumber = mazeWidth * mazeWidth;
    startPointX = document.getElementById('start-x').value;
    startPointY = document.getElementById('start-y').value;
    endPointX = document.getElementById('end-x').value;
    endPointY = document.getElementById('end-y').value;
    brickDensity = document.getElementById('brick-density').value;
    numberOfBricks = Math.round(brickDensity*cellsNumber/100);

    setMap(mazeWidth,mazeHeight, numberOfBricks);
    console.log(firstMap);
    drawMap(firstMap);

}

let solve = function(){
    // finds path and colors good cells in green or shows error message and fills non-brick cells in red
    colorPath();
}

let reset = function(){
    location.reload();
    startBttn.style.display = 'block';
    solveBttn.style.display = 'none';
    resetBttn.style.display = 'none';
}



startBttn.addEventListener('click', start);
solveBttn.addEventListener('click', solve);
resetBttn.addEventListener('click', reset);

window.onload = function(){
    ctx.canvas.width = 0.74 * window.innerWidth;
    ctx.canvas.height = 0.8 * window.innerHeight;
   
}

// BFS Algorithm

var findShortestPath = function(startCoordinates, grid) {

    // gets starting point coordinates
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];
    let breakFunc = 0;
  
    var location = {
      distanceFromTop: distanceFromTop,
      distanceFromLeft: distanceFromLeft,
      path: [],
      status: 'start'
    };
  
    // adds starting point to queue
    var queue = [location];

    while (queue.length > 0) {
      var currentLocation = queue.shift();

      // checks top neigbour (north direction)
  
      var newLocation = exploreInDirection(currentLocation, 'North', grid);

      // if reached end returns path to know what cells to fill with green
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } 
      // if didn't reach end, checks if cell can be visited (is not brick or out of grid)
      else if (newLocation.status === 'Valid') {
        queue.push(newLocation);

      }

    // checks right neigbour (east direction)
  
      var newLocation = exploreInDirection(currentLocation, 'East', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);

      }

    // checks bottom neigbour (south direction)
  
      var newLocation = exploreInDirection(currentLocation, 'South', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

    // checks left neigbour (west direction)

      var newLocation = exploreInDirection(currentLocation, 'West', grid);
      if (newLocation.status === 'Goal') {
        return newLocation.path;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);

      }

      // if too much time passed and browser is stuck we alert user that we couldn't find a path and fill cells in red (if we'd wait more browser would crash)

      breakFunc++;
      if(breakFunc === 75000) {
          alert("Couldn't find a solution until now. Time exceeded!")
          return false;
      }

    }
    return false;
  };
  

  // checks if we found a brick, the end point, a valid cell or we exceeded dimensions

  var locationStatus = function(location, grid) {
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;
  
    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= mazeWidth ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= mazeHeight) {
  
      return 'Invalid';
    } else if (grid[dft][dfl] === 'end') {
      return 'Goal';
    } else if (grid[dft][dfl] === true) {
      return 'Blocked';
    } else {
      return 'Valid';
    }
  };

  
  // sets coordinates for cell;
  // if cell is valid (check previous function) we set cell as Visited

  var exploreInDirection = function(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);
  
    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;
  
    if (direction === 'North') {
      dft -= 1;
    } else if (direction === 'East') {
      dfl += 1;
    } else if (direction === 'South') {
      dft += 1;
    } else if (direction === 'West') {
      dfl -= 1;
    }
  
    var newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, grid);
  
    if (newLocation.status === 'Valid') {
      grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }
  
    return newLocation;
  };

  // if we couldn't find a solution we call this function to fill non-brick cells in red

  function colorRed(map){
    for(let i = 0; i<map.length; i++)
        for(let j = 0; j<map[i].length; j++)
            if(map[i][j] === false){
                ctx.beginPath();
                ctx.fillStyle="#ff4757";
                fillRectangle(i,j)
            }     
}

// if we found solution we call this function to fill path cells in green

function colorGreen(map, solution){
    solution.splice(-1)
    console.log(solution)
    let currentX = startPointY;
    let currentY = startPointX;
    console.log(currentX, currentY)

    for(let i = 0; i<solution.length; i++){
        if(solution[i]==='North')
            currentX--  
        else if(solution[i]==='West')
            currentY--
         else if(solution[i]==='East')
            currentY++
        else if(solution[i]==='South')
            currentX++

        console.log(currentX, currentY)

        ctx.beginPath();
        ctx.fillStyle="#2ed573";
        fillRectangle(currentX,currentY)
    }

}

function colorPath(){
    let solution = findShortestPath([startPointY,startPointX], secondMap);

    if(!solution)
        colorRed(firstMap)
    else
        colorGreen(firstMap, solution)
}