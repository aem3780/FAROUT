
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let gameFrame = 0;
let memory = document.createElement('div');
var continueAnimating=true;

var background = new Image();
background.src = "./assets/bg-still.png";

const alphas = [0.6, 0.7, 0.8, 0.9, 1];

const cellSize = [54, 50, 46, 42, 38];

function alphaRandom() {
    var rand = alphas[Math.floor(Math.random() * images.length)];
    var alphaValue = rand;
    return alphaValue;
}

function cellSizeRandom() {
    var rand = cellSize[Math.floor(Math.random() * cellSize.length)];
    var cellSizeValue = rand;
    return cellSizeValue;
}

const images = ['./assets/SpriteStrips/awkwardsprite.png', './assets/SpriteStrips/beautifulsprite.png', './assets/SpriteStrips/crazysprite.png', './assets/SpriteStrips/joyfulsprite.png', './assets/SpriteStrips/proudsprite.png', './assets/SpriteStrips/sillysprite.png', './assets/SpriteStrips/spookysprite.png', './assets/SpriteStrips/tastysprite.png'];
function imgRandom() {
        var rand = images[Math.floor(Math.random() * images.length)];
        var cellImg = document.createElement('img');
        cellImg.src = rand;
        return cellImg;
}

class State {
    constructor(display, actors) {
        this.display = display;
        this.actors = actors;
    }

    update(time) {
        /**
         * provide an update ID to let actors update other actors only once
         * used with collision detection
         */
        const updateId = Math.floor(Math.random() * 1000000);
        const actors = [];
        for (let actor of this.actors) {
            actors.push(actor.update(this, time, updateId));
        }
        return new State(this.display, actors);
    }
}



class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    dotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    get direction() {
        return Math.atan2(this.x, this.y);
    }
}



class Canvas {
    constructor(parent = document.body, width = windowWidth, height = windowHeight) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        //this.canvas.style.color = "black";
        parent.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    sync(state) {
        this.clearDisplay();
        this.drawActors(state.actors);
        gameFrame++;
    }

    clearDisplay() {

        this.ctx.drawImage(background,0,0, windowWidth, windowHeight);
    }

    drawActors(actors) {
        for (let actor of actors) {
            if (actor.type === 'circle') {
                this.drawCircle(actor);
            }
        }
    }
    

    drawCircle(actor) {
        this.ctx.save();
        this.ctx.globalAlpha = actor.alpha;
        this.ctx.arc(actor.position.x, actor.position.y, actor.radius, 0, Math.PI * 2);
        this.ctx.drawImage(actor.image, actor.frame * 100, 0, 100, 100, actor.position.x-actor.radius, actor.position.y-actor.radius, actor.cellSize, actor.cellSize);
        this.ctx.restore();
        
    }
}

function displayMemory(){
    memory.innerHTML = `
<div id="memory>
<div class="background">
    <video autoplay loop muted class="background">
        <source src="./assets/smaller-bg_compressed.mp4"/>
    </video>
</div>
<div class="centered-container">
    <div class="cell">
        <video width="400" height="400" autoplay loop muted>
            <source id="celltype" src="./assets/beautiful.webm" alt="cell animation"/>
        </video>
    </div>
    <div class="content-block"> 
        <div>
        <img class="ui-back" src="./assets/back.png" class="closebtn" onclick="closeMemory()">
        </div>
        <div class="title-text">
            <h3> A <span id="memorytype">beautiful</span> memory </h3>
        </div>
        <div class="submission-text">
            <h2 id="memorytext"> When I visited the Smoky Mountains in the fall  </h2>
        </div>
        <div class="submission-data"><h4 id="submissiontext"> SUBMITTED ON 02/04/23 10:34am </h4></div>
        <div class="image" style="background: url(assets/image.jpg); background-size: cover;"> </div> 
    </div>
</div>
</div>
`;
document.body.appendChild(memory);

}


  
  /* Close */
  function closeMemory() {
    //continueAnimating = true;
    document.body.removeChild(memory);
    window.location.reload();
  }

  

class Cell {
    constructor(config) {
        Object.assign(this,
            {
                id: Math.floor(Math.random() * 1000000),
                type: 'circle',
                position: new Vector(100, 100),
                velocity: new Vector(-1, 1),
                radius: 25,
                cellSize: 50,
                alpha: 1,
                image: null,
                animateSpeed: Math.floor(Math.random() * (16 - 8) + 8),
                frame: 0,
                collisions: []
            },
            config
        );

        //attach click event listener to the canvas
        this.canvas = document.querySelector('canvas');
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const distance = Math.sqrt((x - this.position.x) ** 2 + (y - this.position.y) ** 2);
            if (distance <= this.radius) {
                //continueAnimating = !continueAnimating;
                displayMemory();
            }
            continueAnimating = true;

            
        });
    }

    Refresh() {
        window.parent.location = window.parent.location.href;
    }

    update(state, time, updateId) {
        if (!continueAnimating) {
            return this;
          }

        if(gameFrame % this.animateSpeed === 0){
            this.frame >= 8 ? this.frame = 0 : this.frame++;
            
        } 

        const upperLimit = new Vector(state.display.canvas.width +40, state.display.canvas.height + 40);
        const lowerLimit = new Vector(-40, -40);
        let newX = this.position.x + this.velocity.x;
        let newY = this.position.y + this.velocity.y;

        /**
         * this is the most stable solution to avoid overlap
         * but it is slightly inaccurate
         */
        for (let actor of state.actors) {
            if (this === actor || this.collisions.includes(actor.id + updateId)) {
                continue;
            }

            /**
             * check if actors collide in the next frame and update now if they do
             * innaccurate, but it is the easiest solution to the sticky collision bug
             */
            const distance = new Vector(newX, newY).subtract(actor.position.add(actor.velocity)).magnitude;

            if (distance <= this.radius + actor.radius) {
                const v1 = collisionVector(this, actor);
                const v2 = collisionVector(actor, this);
                this.velocity = v1;
                actor.velocity = v2;
                this.collisions.push(actor.id + updateId);
                actor.collisions.push(this.id + updateId);
            }
        }

        // check if hitting left or right of container
        if (newX >= upperLimit.x || newX <= lowerLimit.x) {
            this.velocity = new Vector(-this.velocity.x, this.velocity.y);
            newX = Math.max(Math.min(this.position.x + this.velocity.x, upperLimit.x), lowerLimit.x);
        }

        // check if hitting top or bottom of container
        if (newY >= upperLimit.y || newY <= lowerLimit.y) {
            this.velocity = new Vector(this.velocity.x, -this.velocity.y);
            newY = Math.max(Math.min(this.position.y + this.velocity.y, upperLimit.y), lowerLimit.y);
        }

        return new Cell({
            ...this,
            position: new Vector(newX, newY),
        });
    }

    get area() {
        return Math.PI * this.radius ** 2;
    }

    get sphereArea() {
        return 4 * Math.PI * this.radius ** 2;
    }
}



// see elastic collision: https://en.wikipedia.org/wiki/Elastic_collision
const collisionVector = (particle1, particle2) => {
    // add mass to the system
    const massRatio = ((2 * particle2.sphereArea) / (particle1.sphereArea + particle2.sphereArea));
    const multiplyValue = (particle1.velocity.subtract(particle2.velocity).dotProduct(particle1.position.subtract(particle2.position))/ particle1.position.subtract(particle2.position).magnitude ** 2);
    return particle1.velocity.subtract(particle1.position.subtract(particle2.position).multiply(multiplyValue).multiply(massRatio));
};


const runAnimation = animation => {
    let lastTime = null;
    const frame = time => {
        if (lastTime !== null) {
            const timeStep = Math.min(100, time - lastTime) / 1000;

            // return false from animation to stop
            if (animation(timeStep) === false) {
                return;
            }
        }
        lastTime = time;

        if(continueAnimating) {
            requestAnimationFrame(frame);
        }

    };
    requestAnimationFrame(frame);
};




const random = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
    
};

const randomCell = () => {
    return Math.floor(Math.random() * 8);
};


const collidingCells = ({ width = windowWidth, height = windowHeight, parent = document.body, count = 20 } = {}) => {



    const display = new Canvas(parent, width, height);
    const cells = [];
    for (let i = 0; i < count; i++) {
        cells.push(new Cell({
            cellSize: cellSizeRandom(),
            radius: cellSizeRandom()/2,
            alpha: alphaRandom(),
            image: imgRandom(),
            position: new Vector(random(width-10, 10), random(height - 10, 10)),
            velocity: new Vector(random(.3, -.3), random(.3, -.3)),
        }));


    }

    let state = new State(display, cells);
    if(!continueAnimating){return;}
    runAnimation(time => {
        state = state.update(time);
        display.sync(state);
    });


};


collidingCells();

