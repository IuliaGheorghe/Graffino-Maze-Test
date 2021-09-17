let startBttn = document.querySelector('#start-bttn');
let resetBttn = document.querySelector('#reset-bttn');
let form = document.querySelector('form');
let container = document.getElementById('container')
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let mazeWidth, mazeHeight;
let cellsNumber;
let startPointX, startPointY;
let endPointX, endPointY;
let brickDensity;
let numberOfBricks;

let firstMap = new Array;
let secondMap = new Array;

function setMap(width, height, bricks){
    for(let i = 0; i < height; i++)
    {
        firstMap.push(new Array);
        secondMap.push(new Array);
    }
    
    for(let i = 0; i < height; i++)
        for(let j = 0; j < width; j++)
        {
            firstMap[i].push(false);
            secondMap[i].push(false);

        }
    
        startPointX--;
        startPointY--;
        startPointY = height-startPointY-1;
        endPointX--;
        endPointY--;
        endPointY = height-endPointY-1;


        firstMap[startPointY][startPointX] = 'start';
        secondMap[startPointY][startPointX] = 'start';
        firstMap[endPointY][endPointX] = 'end';
        secondMap[endPointY][endPointX] = 'end';

        for(let i = 0; i < bricks; i++)
        {
            let xRandom = Math.floor(Math.random() * mazeHeight);
            let yRandom = Math.floor(Math.random() * mazeWidth);
    
            while(firstMap[xRandom][yRandom]=== true || firstMap[xRandom][yRandom]==='start' || firstMap[xRandom][yRandom] === 'end')
            {
                xRandom = Math.floor(Math.random() * mazeHeight);
                yRandom = Math.floor(Math.random() * mazeWidth);
        
            }
    
            firstMap[xRandom][yRandom] = true;
            secondMap[xRandom][yRandom] = true;
        }
}

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

            if(map[i][j] === 'start'){
                ctx.beginPath();
                ctx.fillStyle="#a29bfe";
                fillRectangle(i,j)
                
            }

            else if(map[i][j] === 'end'){
                ctx.beginPath();
                ctx.fillStyle="#6c5ce7";
                fillRectangle(i,j)

            }

            else if(map[i][j]){
                ctx.beginPath();
                ctx.fillStyle="rgba(0,0,0,0.6)";
                fillRectangle(i,j)
            }
        }
}

function formTransition(){
    form.classList.add("transition")
}

function showMaze(){
    
    canvas.style.display="block";
    
}

let start = function(){
    formTransition();
    showMaze();
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

let reset = function(){
    location.reload();

}


startBttn.addEventListener('click', start);
resetBttn.addEventListener('click', reset);

window.onload = function(){
    ctx.canvas.width = 0.74 * window.innerWidth;
    ctx.canvas.height = 0.8 * window.innerHeight;
   
}