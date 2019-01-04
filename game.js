/*
    We are going to implement the module pattern
    to make our code maintanable and easy to modify 
    in the future
    
    UIcontroller: will be responsible for every UI event
    snakeController: will contain all the information and 
                     data structures  for the snake and food
    controller: will be the link between UIcontroller and snakeController
*/

// GLOBAL vars
var screenWidth = window.screen.width - 30;
var screenHeight = window.screen.height - 30;


var UIcontroller = (function(){
    var DOMstrings = {
        gameOverall: '.gameOverall',
        snake:  '.snake',
        svg: 'svgALL',
        food: 'food'
    };
    
    // Can have 1 of 4 options : 
    // 'right', 'left', 'up', 'down'
    var dir = 'right';
    
    
    // Public methods
    return {
        
        getDir: function(){
            return dir;
        },
        
        setDir: function(newDir){
            dir = newDir;
        },
        
        addRectangle: function(width, height, rWidth, rHeight, x, y, id){
            var html;
            
            // TODO
            
            // 1. Change svg code to add a rounded rectangle with
            //    and use the "x" & "y" properties to easily manipulate
            //    the rectangles later on when needed
            
            if (!width || !height || !rWidth || !rHeight || !x || !y){
                console.log('Arguments of addRectangle(...) are not defined properly!');
                return -1;
            }
            
            if(id === 'rect-0'){
                html =  '<svg width="%width%" height="%height%" id="svgALL"><rect x="%x%" y="%y%" width="%rWidth%" id="%id%" height="%rHeight%" style="fill:green;stroke:pink;stroke-width:0;opacity:1" /></svg>';
        
                html = html.replace('%width%', width);
                html = html.replace('%height%', height);
                html = html.replace('%rWidth%', rWidth);
                html = html.replace('%rHeight%', rHeight);
                html = html.replace('%x%', x);
                html = html.replace('%y%', y);
            } else if (id === 'food'){
                html = '<rect x="%x%" y="%y%" width="%rWidth%" id="%id%" height="%rHeight%" style="fill:yellow;stroke:pink;stroke-width:0;opacity:1" />';
                html = html.replace('%rWidth%', rWidth);
                html = html.replace('%rHeight%', rHeight);
                html = html.replace('%x%', x);
                html = html.replace('%y%', y);
            } else {
                html = '<rect x="%x%" y="%y%" width="%rWidth%" id="%id%" height="%rHeight%" style="fill:green;stroke:pink;stroke-width:0;opacity:1" />';
                html = html.replace('%rWidth%', rWidth);
                html = html.replace('%rHeight%', rHeight);
                html = html.replace('%x%', x);
                html = html.replace('%y%', y);
            }
            
            
            // console.log(html);
            if(id === 'food'){
                
                html = html.replace('%id%', id);
                
                document.getElementById(DOMstrings.svg).insertAdjacentHTML('beforeend', html);
            } else if (id === 'rect-0'){
                html = html.replace('%id%', id);
                document.querySelector(DOMstrings.snake).insertAdjacentHTML('beforeend', html);
            } else {
                html = html.replace('%id%', id);
                document.getElementById(DOMstrings.svg).insertAdjacentHTML('beforeend', html);
            }
        },
        
        moveRectangle: function(elementID, dir, step){
            var el, 
                oldValue;
            
            if (dir === 'right'){
                el = document.getElementById(elementID);
                oldValue = parseInt(el.getAttribute('x'));
                el.setAttribute('x',  oldValue + step);
            } else if (dir === 'left'){
                el = document.getElementById(elementID);
                oldValue = parseInt(el.getAttribute('x'));
                el.setAttribute('x',  oldValue - step);
            } else if (dir === 'up'){
                el = document.getElementById(elementID);
                oldValue = parseInt(el.getAttribute('y'));
                el.setAttribute('y',  oldValue - step);
            } else if (dir === 'down'){
                el = document.getElementById(elementID);
                oldValue = parseInt(el.getAttribute('y'));
                el.setAttribute('y',  oldValue + step);
            }
        },
        
        removeFood: function(){
            var element;
            
            element = document.getElementById(DOMstrings.food);
            element.parentNode.removeChild(element);
        }
        
    };
}());

var snakeController = (function(){
    var Rectangle = function(width, height, x, y, id){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.id = id;
    };
    
    Rectangle.prototype.isFood = function(){
        this.isFood = true;
    };
    
    var food;
    
    var ID = 0;
    
    // Array containing all Rectangle objects
    var rectArray = [];
    
    var createRectangle = function(w, h, x, y){
        rectArray.push(new Rectangle(w, h, x, y, ID));
        ID++;
    };
    
    
    // Public methods
    return {
        createRectangle: createRectangle,
        
        getRect: function(index){
            return rectArray[index];  
        },
        
        alterRect: function(index, rect){
            rectArray[index] = rect;  
        },
        
        getLastRect: function(){
            return rectArray[rectArray.length - 1];  
        },
        
        createFood: function(width, height, x, y, id){
            if (typeof food === 'undefined'){
                food = new Rectangle(width, height, x, y, id);
                food.isFood();
            }  else {
                food.width = width;
                food.height = height;
                food.x = x;
                food.y = y;
                food.id = id;
            }
        },
        
        collisionDetection: function(){
            // Check if the head of the snake hit food
            // return true or false
            var headX, headY, headWidth, headHeight,
                foodX, foodY, foodWidth, foodHeight;
            var condition1, condition2, condition;
            
            headX = rectArray[0].x;
            headY = rectArray[0].y;
            headWidth = rectArray[0].width;
            headHeight = rectArray[0].height;
            foodX = food.x;
            foodY = food.y;
            foodWidth = food.width;
            foodHeight = food.height;
            
            condition1 = (headX < foodX + foodWidth) && (headX + headWidth > foodX);
            condition2 = (headY < foodY + foodHeight) && (headY + headHeight > foodY);
            condition = condition1 && condition2;
            
            if (condition){
                return true;
            } else {
                return false;
            }
        },
        
        addTail: function(dir, w, h, space) {
            var lastRect,
                newRect,
                newX,
                newY;
            
            // 1. Find the last rectangle in rectArray.
            lastRect = rectArray[rectArray.length - 1];
            // 2. Add the next one with ${space} pixels between the last
            if(dir === 'right'){
                newX = lastRect.x - space - lastRect.width;
                newY = lastRect.y;
                newRect = createRectangle(w, h, newX, newY);
                return [newX, newY];
            } else if(dir === 'left') {
                newX = lastRect.x + lastRect.width + space;
                newY = lastRect.y;
                newRect = createRectangle(w, h, newX, newY);
                return [newX, newY];
            } else if(dir === 'up'){
                newX = lastRect.x;
                newY = lastRect.y + lastRect.height + space;
                newRect = createRectangle(w, h, newX, newY);
                return [newX, newY];
            } else if(dir === 'down'){
                newX = lastRect.x;
                newY = lastRect.y - space - lastRect.height;
                newRect = createRectangle(w, h, newX, newY);
                return [newX, newY];
            }
        },
        
        testing: function(){
            console.log(rectArray);
            console.log(food);
        }
    };
}());

var controller = (function(ui, snake){
    
    // How many pixels should the rectangles move each time
    var step = 25,  // pixels
        size = 25,  // pixels
        space = 5;  // Space between head and tail, in pixels
    
    
    
    var setupEventListeners =  function(){
        // If an arrow key is pressed change the direction
        // of the moving head.
        // You cannot change dir into yourself
        // E.x You cannot suddenly go 'left' if you are moving
        // in the 'right' direction
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 39 && ui.getDir() !== 'left'){
                changeDir('right');
            } else if (event.keyCode === 37 && ui.getDir() !== 'right'){
                changeDir('left');
            } else if (event.keyCode === 38 && ui.getDir() !== 'down'){
                changeDir('up');
            } else if (event.keyCode === 40 && ui.getDir() !== 'up'){
                changeDir('down');
            }
        });
    };
    
    var changeDir = function(newDir){
        ui.setDir(newDir);
    };
    
    var refresh = function(){
            /*
                Refresh the page
            */        
            // The snake should keep moving to the assigned direction
            moveRectangle('rect-0', ui.getDir(), step);
            // spawnFood();
            if(snake.collisionDetection()){
                spawnFood();
                addTail();
            }
            refreshTail();
    };
    
    var moveRectangle = function(elementID, dir, step){
        var rect,
            index;
        
        index = elementID.split('-')[1];
        index = parseInt(index);
        
        // 1. ui.moveRectangle
        ui.moveRectangle(elementID, dir, step);
        // 2. Change rect coordinates depending on dir
        rect = snake.getRect(index);
        
        
        
        if(dir === 'right'){
            rect.x += step;
        } else if (dir === 'left'){
            rect.x -= step;
        } else if (dir === 'up'){
            rect.y -= step;
        } else if (dir === 'down'){
            rect.y += step;
        }
        
        snake.alterRect(index, rect);
    };
    
    var spawnFood = function(){
            var x, 
                y;
            
            // Calculate new coordinates
            x = Math.round(Math.random() * screenWidth);
            y = Math.round(Math.random() * screenHeight);
           
            // Change the coordinates in the snakeController Module
            snake.createFood(size, size, x, y, 'food');
            
            // Remove element from UI.
            ui.removeFood();
            
            // Add new food to UI
            ui.addRectangle(screenWidth, screenHeight, size, size, x, y, 'food');
    };
    
    var addTail = function(dir){
        var x, y, id;
        
        // 1. Add rectangle to tail.
        [x, y] = snake.addTail(ui.getDir(), size, size, space);
        // 2. Add to UI.
        id = snake.getLastRect().id;
        ui.addRectangle(666, 666, size, size, x, y, 'rect-' + id.toString());
    };
    
    var refreshTail = function(){
        var len, lastRect, nextRect;
        
        // Loop over the rectArray
        len = snake.getLastRect().id + 1;
        // move the last array to the position of the next array
        for(var i = 1; i < len; i++){
            lastRect = snake.getRect(i);
            nextRect = snake.getRect(i - 1);
            
            lastRect.x = nextRect.x;
            lastRect.y = nextRect.y;
            snake.alterRect(i, lastRect);
            moveRectangle('rect-' + i.toString(), ui.getDir(), step);
        }
    };
    
    // Public methods
    return {
        getStep: function(){
            return step;  
        },
        
        init: function(){
            // Do stuff to begin the game
            
            // 1. Get screen width & height
            
            // Create rectangle (head) and add it to the DOM
            snake.createRectangle(50, 50, 200, 440);
            ui.addRectangle(screenWidth, screenHeight, size, size, 200, 440, 'rect-0');

            snake.createFood(size, size, 500, 500);
            ui.addRectangle(screenWidth, screenHeight, size, size, 500, 500, 'food');

            
            // Event listeners should be called AFTER the rectangles have been created
            setupEventListeners();
            setInterval(refresh, 1000 / 18);
        }  
    };
}(UIcontroller, snakeController));

controller.init();



