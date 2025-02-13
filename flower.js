const playerSpeed = 1;
const petalRotateSpeed = 2.5 / 30//2.5 * Math.PI * 2 / 30//0.0023 * 1000 / 30;
const neutralPetalDistance = 70;
const attackPetalDistance = neutralPetalDistance * 1.91;
const defendPetalDistance = neutralPetalDistance * 0.6;
const flowerSpeed = 1/9//.000306//.0025;
const serverTickLength = 1000 / 30;
const flowerInterpolateKeys =       ['headX',    'headY',    'radius',  'hp',  'baseX',  'baseY',   'petalDistance', 'beforeStreakHp', 'shield', 'isPoisoned'];
const flowerInterpolateMagnitudes = [0.072,       0.072,       0.44,     0.22,  0.088,    0.088,     0.2,           0.22,                 0.22,    0.088];
// const flowerPackKeys = ['id', 'baseX', 'baseY', 'hp', 'maxHp', 'headX', 'headY', 'petalRotation', 'petalDistance', 'attacking', 'defending', 'petalRotateSpeed', 'angle', 'pickupRadiusMultiplier'];
const flowerPackKeys = ['id', 'hp', 'headX', 'headY', 'petalRotation', 'angle', 'isPoisoned' /*, ...petal distances*/];

class Flower {
    constructor(id){
        this.id = id;

        // idea: since in florr there's kinda a separate position for the petals and camera and then the player, we need 
        this.x = 0;
        this.y = 0;

        this.baseX = 0;
        this.baseY = 0;

        // headX will be the thing that's actually moving, the normal x and y will interpolate towards it
        this.headX = 0;
        this.headY = 0;
        this.radius = 25;

        this.xv = 0;
        this.yv = 0;

        this.friction = 0.3;

        this.movementType = 'mouse';
        this.angle = 0;
        this.magnitude = 0;

        this.maxHp = 100;
        this.hp = 100;
        this.shield = 0;
        this.isPoisoned = 0; //false
        
        this.name = '';

        this.beforeStreakHp = this.maxHp;// if enemies hit the flower over and over again, we want to be able to render the red in the hp bar. This is the damage stored before the flower gets a "streak" of hits dealt to it
        this.ticksSinceLastDamaged = 1001;// set to 0 when damaged. 

        // kb
        this.input = {up: false, down: false, right: false, left: false};

        this.eyeOffsetX = 0;
        this.eyeOffsetY = 0;

        this.petals = [];

        this.petalRotateSpeed = petalRotateSpeed;
        this.petalRotation = 0;
        this.petalLag = 0;

        this.petalDistance = neutralPetalDistance;

        this.attacking = false;
        this.defending = false;

        // this.renderX = this.x;
        // this.renderY = this.y;

        this.render = {};
        for(let i = 0; i < flowerInterpolateKeys.length; i++){
            this.render[flowerInterpolateKeys[i]] = this[flowerInterpolateKeys[i]];
        }
        this.render.angle = this.angle;
        this.render.fastPetalDistance = this.petalDistance;
        this.render.x = this.render.baseX;
        this.render.y = this.render.baseY;

        this.projectiles = [];
        this.pets = [];
        this.deadProjectiles = [];
        this.deadPets = [];

        // this.level = 0;
        // this.petalSlots = 0;
    }
    init(data){
        for(let key in data){
            if(key === 'petals'){
                // TODO add separate addPetal and removePetal messages
                for(let petalId in data.petals){
                    this.petals[petalId] = new Petal(data.petals[petalId]);
                }
                continue;
            } else if(key === "projectiles"){
                for(let i = 0; i < data.projectiles.length; i++){
                    this.projectiles[i] = new Petal(data.projectiles[i]);
                    this.projectiles[i].isProjectile = true;
                }
            } else if(key === "pets"){
                for(let i = 0; i < data.pets.length; i++){
                    this.pets[i] = new Enemy(data.pets[i]);
                }
            }else{
                this[key] = data[key];
            }
            
        }
    }
    update(data, startInd){
        if(data[startInd + 1/*hp*/] < this.hp){
            this.updateRenderDamage(data.hp);
        }
        // console.log(startInd);
        // console.log(data);
        for(let i = startInd; i < flowerPackKeys.length+startInd; i++){
            if(i === startInd + 5 && this.id === window.selfId){
                continue;// we dont want to change the angle on player by the server becasue then it looks bad (snapping back). Thus, continue.
            }
            this[flowerPackKeys[i-startInd]] = data[i];
        }
        
        // // console.log(this.headX - data.headX);
        // if (data.maxHp){
        //     this.hp = data.hp;
        //     this.render.hp = this.hp;
        //     this.ticksSinceLastDamaged = 99999;
        //     this.beforeStreakHp = this.hp;
        //     this.render.beforeStreakHp = this.hp;
        // }
        // if(data.petalRotateSpeed){
        //     this.petalLag = this.calculatePetalLag();
        // }
        
        // for(let key in data){
        //     if(key === 'petals'){
        //         // console.log(data.petals);
        //         // TODO add separate addPetal and removePetal messages
        //         for(let petalId in data.petals){
        //             this.petals[data.petals[petalId].id].update(data.petals[petalId], this);
        //         }
        //         continue;
        //     } else if(key === "projectiles"){
        //         for(let i = 0; i < data.projectiles.length; i++){
        //             this.projectiles[data.projectiles[i].projectileId].update(data.projectiles[i], this);
        //         }
        //         continue;
        //     } else if(key === "pets"){
        //         for(let i = 0; i < data.pets.length; i++){
        //             this.pets[i].update(data.pets[i], this);
        //         }
        //         continue;
        //     }
        //     this[key] = data[key];
        // }// some sort of lastState system as well?
        // // this.predictMovement();
        // // if(data.petalRotateSpeed){
        // //     console.log(this.petalRotateSpeed);
        // // }
        this.x = this.headX;
        this.y = this.headY;

        // we don't send baseX or baseY. But, we send everything once per tick right after the update.
        // so just performing the same simulation that the server does will be 100% accurate all the time
        this.baseX = interpolate(this.baseX, this.headX, 0.4);
        this.baseY = interpolate(this.baseY, this.headY, 0.4);

        // the same sort of "client rebuilding" with exact data is here
        if(this.attacking === true){
            this.petalDistance = attackPetalDistance;
        } else if(this.defending === true){
            this.petalDistance = defendPetalDistance;
        } else {
            this.petalDistance = neutralPetalDistance;
        }


        for(let i = 0; i < this.petals.length; i++){
            const petalData = data[startInd+flowerPackKeys.length+i];
            //console.log(petalData);
            //get 3rd decimal digit
            let encodedData = Math.floor(petalData * 100)/100;
            let encodedType = Math.round(1000 * (petalData - encodedData));
            //console.log(encodedType);
            if(petalData <= 0){
                // petal is damaged!!
                
                this.petals[i].update({takeDamage: true, hp: -encodedData}, this);
                
                continue;
            } else if(encodedType === 1){
                // special number indicating it's alive
                if(this.petals[i].dead !== false){
                    this.petals[i].update({dead: false}, this);
                }
                continue;
            } else if(encodedType === 3){
                this.petals[i].update({distance: encodedData}, this);
                continue;
            }else if (encodedType === 4){
                if(this.petals[i].dying !== true && this.petals[i].dead !== true){
                    this.petals[i].update({dead: true, reload: encodedData}, this);
                }
                else{
                    this.petals[i].update({reload: encodedData}, this);
                }
                continue;
            }
            
        }

        if(this.projectiles.length !== 0){
            const projectileStartIndex = startInd + flowerPackKeys.length + this.petals.length;
            for(let i = 0; i < this.projectiles.length; i++){
                const projectileData = [data[projectileStartIndex + i * 2], data[projectileStartIndex + i * 2 + 1]];
                if(projectileData[0] === -6.5){
                    this.projectiles[i].update({dead: true}, this);
                } else {
                    this.projectiles[i].update({x: projectileData[0], y: projectileData[1]}, this);
                }
            }
        }

        if(this.pets.length !== 0){
            const petStartIndex = startInd + flowerPackKeys.length + this.petals.length + this.projectiles.length * 2;
            for(let i = 0; i < this.pets.length; i++){
                // const projectileData = [data[petStartIndex + i * 2], data[petStartIndex + i * 2 + 1]];
                const thisPetStartIndex = petStartIndex + i * enemyPackKeys.length;
                this.pets[i].update(data, thisPetStartIndex);
                // if(projectileData[0] === -6.5){
                //     this.projectiles[i].update({dead: true}, this);
                // } else {
                //     this.projectiles[i].update({x: projectileData[0], y: projectileData[1]}, this);
                // }
            }
        }
    }
    updateRenderDamage(){
        this.ticksSinceLastDamaged = 0;
    }
    updatePetsAndProjectiles(){
        for(let i = 0; i < this.deadProjectiles.length; i++){
            if(this.deadProjectiles[i].deadAnimationTimer > 166){
                this.deadProjectiles[i].toRemove = true;
            }
        }
        this.deadProjectiles = this.deadProjectiles.filter(p => p.toRemove !== true);

        for(let i = 0; i < this.deadPets.length; i++){
            if(this.deadPets[i].deadAnimationTimer > 166){
                this.deadPets[i].toRemove = true;
            }
        }
        this.deadPets = this.deadPets.filter(p => p.toRemove !== true);

        // this.petalRotation += this.petalRotateSpeed * dt / 30;
    }
    // simulate(room){
    //     if(this.movementType === 'mouse'){
    //         this.xv += Math.cos(this.angle) * this.magnitude /** dt*/ * flowerSpeed;
    //         this.yv += Math.sin(this.angle) * this.magnitude /** dt*/ * flowerSpeed;
    //     } else {

    //     }

    //     this.xv *= this.friction;
    //     this.yv *= this.friction;

    //     this.headX += this.xv;
    //     this.headY += this.yv;

    //     if(Math.sqrt(this.headX ** 2 + this.headY ** 2) + this.radius > room.radius){
    //         const angle = Math.atan2(this.headY, this.headX);
    //         this.headX = Math.cos(angle) * (room.radius - this.radius);
    //         this.headY = Math.sin(angle) * (room.radius - this.radius);
    //     }
        
    //     this.x = interpolate(this.x, this.headX, .4 * dt/16.66);
    //     this.y = interpolate(this.y, this.headY, .4 * dt/16.66);
    //     // const angle = Math.atan2(this.headY - this.y, this.headX - this.x);
    //     // // const magnitude = Math.min(1, Math.sqrt((this.x - this.headX) ** 2 + (this.y - this.headY) ** 2) / 3);
    //     // const magnitude = Math.sqrt(this.xv ** 2 + this.yv ** 2);

    //     // this.x = this.headX - Math.cos(angle) * magnitude;//+= Math.cos(angle) * magnitude;
    //     // this.y = this.headY - Math.sin(angle) * magnitude;//+= Math.sin(angle) * magnitude;

    //     this.petalRotation += this.petalRotateSpeed;

    //     if(this.attacking === true){
    //         this.petalDistance = attackPetalDistance;
    //     } else if(this.defending === true){
    //         this.petalDistance = defendPetalDistance;
    //     } else {
    //         this.petalDistance = neutralPetalDistance;
    //     }

    //     for(let i = 0; i < this.petals.length; i++){
    //         this.petals[i].simulate(this);
    //     }
    //     for(let i = 0; i < this.deadProjectiles.length; i++){
    //         if(this.deadProjectiles[i].deadAnimationTimer > 166){
    //             this.deadProjectiles[i].toRemove = true;
    //         }
    //     }
    //     this.deadProjectiles = this.deadProjectiles.filter(p => p.toRemove !== true);
    //     for(let i = 0; i < this.deadPets.length; i++){
    //         if(this.deadPets[i].deadAnimationTimer > 166){
    //             this.deadPets[i].toRemove = true;
    //         }
    //     }
    //     this.deadPets = this.deadPets.filter(p => p.toRemove !== true);
    //     // return;
    //     // if(this.movementType === 'mouse'){
    //     //     this.xv += Math.cos(this.angle) * this.magnitude /** dt*/ * flowerSpeed / 2;
    //     //     this.yv += Math.sin(this.angle) * this.magnitude /** dt*/ * flowerSpeed / 2;
    //     //     this.xv *= Math.sqrt(this.friction ** (dt/12));
    //     //     this.yv *= Math.sqrt(this.friction ** (dt/12));
    //     // } else {

    //     // }

    //     // this.headX += this.xv / 10 * dt//* dt/1000;
    //     // this.headY += this.yv / 10 * dt//* dt/1000;

    //     // // this.xv *= this.friction ** (dt/12);
    //     // // this.yv *= this.friction ** (dt/12);

    //     // if(Math.sqrt(this.headX ** 2 + this.headY ** 2) + this.radius > room.radius){
    //     //     const angle = Math.atan2(this.headY, this.headX);
    //     //     this.headX = Math.cos(angle) * (room.radius - this.radius);
    //     //     this.headY = Math.sin(angle) * (room.radius - this.radius);
    //     //     // this.x = this.headX;
    //     //     // this.y = this.headY;
    //     // }

    //     // if(this.movementType === 'mouse'){
    //     //     this.xv += Math.cos(this.angle) * this.magnitude /** dt*/ * flowerSpeed / 2;
    //     //     this.yv += Math.sin(this.angle) * this.magnitude /** dt*/ * flowerSpeed / 2;
    //     //     this.xv *= Math.sqrt(this.friction ** (dt/12));
    //     //     this.yv *= Math.sqrt(this.friction ** (dt/12));
    //     // } else {

    //     // }
        
    //     // // TODO: make this account for movement delta over the frame. How florr does it is if you ram into a rock then magnitude of lead is decreased and if you slow down as well. We can't just base this off of velocity, we need a delta position every frame system
    //     // this.x = interpolate(this.x, this.headX, 0.4 ** (dt/30));
    //     // this.y = interpolate(this.y, this.headY, 0.4 ** (dt/30));

    //     // this.petalRotation += this.petalRotateSpeed * dt;

    //     // for(let i = 0; i < this.petals.length; i++){
    //     //     this.petals[i].simulate(this, dt);
    //     // }
    // }
    calculatePetalLag(){
        return /*1 / (1 - .08)*/1.08695652174 * this.petalRotateSpeed;    
    }
    // predictMovement(){
    //     // if(this.movementType === 'mouse'){
    //     //     this.xv += Math.cos(this.angle) * this.magnitude * dt * flowerSpeed;
    //     //     this.yv += Math.sin(this.angle) * this.magnitude * dt * flowerSpeed;
    //     // } else {

    //     // }

    //     // this.headX += this.xv * dt/1000;
    //     // this.headY += this.yv * dt/1000;

    //     // this.xv *= this.friction ** (dt/8);
    //     // this.yv *= this.friction ** (dt/8);

    //     // if(Math.sqrt(this.headX ** 2 + this.headY ** 2) + this.radius > room.radius){
    //     //     const angle = Math.atan2(this.y, this.x);
    //     //     this.headX = Math.cos(angle) * (room.radius - this.radius);
    //     //     this.headY = Math.sin(angle) * (room.radius - this.radius);
    //     // }

    //     // this.x = interpolate(this.headX, this.x, 0.5 ** (dt / 8));
    //     // this.y = interpolate(this.headY, this.y, 0.5 ** (dt / 8));
    //     // const interpRatio = (time - this.lastState.time) / serverTickLength;
    //     // const interpRatio = /*Math.min(2,*/(this.latestUpdateTime-this.lastState.time)/serverTickLength/*)*/;
    //     // // console.log(interpRatio);

    //     // for(let i = 0; i < this.interpolateKeys.length; i++){
    //     //     const key = this.interpolateKeys[i];
    //     //     // this.x = interpolate(this.lastState.x, this.x, interpRatio)
    //     //     this.render[key] = interpolate(this.lastState[key], this[key], interpRatio);
    //     // }
    // }
    // updateRenderPos(){
    //     // this.render.x = interpolate(this.render.x, this.render.headX - Math.cos(this.angle) * (this.magnitude/220) * this.render.radius/2, 0.75);
    //     // this.render.y = interpolate(this.render.headY - Math.sin(this.angle) * (this.magnitude/220) * this.render.radius/2);
    //     // this.updateInterpolate();
    //     this.renderX = this.x//interpolate(this.renderX, this.render.headX, 0.04);
    //     this.renderY = this.y//interpolate(this.renderY, this.render.headY, 0.04);
    //     this.render.x = this.renderX//interpolate(this.renderX, this.x, 0.06);
    //     this.render.y = this.renderY//interpolate(this.renderY, this.y, 0.06);

    //     for(let i = 0; i < this.petals.length; i++){
    //         this.petals[i].updateRenderPos(this);
    //     }
    // }
    updateInterpolate(){
        if(window.isEditor && this.extraRange !== undefined && this.petalDistance > neutralPetalDistance){
            var lastPetalDistance = this.petalDistance;
            this.petalDistance /= this.extraRange;
        }
        for(let i = 0; i < flowerInterpolateKeys.length; i++){
            this.render[flowerInterpolateKeys[i]] = interpolate(this.render[flowerInterpolateKeys[i]], this[flowerInterpolateKeys[i]], flowerInterpolateMagnitudes[i] * dt/16.66);//this[flowerInterpolateKeys[i]];
        }
        this.render.angle = interpolateDirection(this.render.angle, this.angle, 0.2 * dt/16.66);
        this.render.fastPetalDistance = interpolate(this.render.fastPetalDistance, this.petalDistance, 0.4 * dt/16.66);
                
        // this.render.headX = this.render.x;
        // this.render.headY = this.render.y;
        // this.updateRenderPos();

        for(let i = 0; i < this.petals.length; i++){
            this.petals[i].updateInterpolate(this);
        }

        for(let i = 0; i < this.projectiles.length; i++){
            if(this.projectiles[i].updateInterpolate !== undefined){
                this.projectiles[i].updateInterpolate(this);
            } else {
                // console.log('PROJECTILE BUG FOUND', this.projectiles[i]);
                this.projectiles[i] = new Petal(this.projectiles[i]);
            }
        }

        this.render.x = this.render.baseX;
        this.render.y = this.render.baseY;

        if(window.isEditor && this.extraRange !== undefined && this.petalDistance > neutralPetalDistance){
            this.petalDistance = lastPetalDistance;
        }
    }
    drawProjectiles(){
        if(this.projectiles.length === 0){
            return;
        }
        for(let i = 0; i < this.projectiles.length; i++){
            if(toRender({x: this.projectiles[i].render.x, y: this.projectiles[i].render.y, radius: this.projectiles[i].radius}, window.camera) === true){
                this.projectiles[i].draw();
            }
            this.projectiles[i].updateTimer();
        }
    }
    drawPets(){
        for(let i = 0; i < this.pets.length; i++){
            if(this.pets[i]?.render?.x === undefined){
                continue;
            }
            if(toRender({x: this.pets[i].render.x, y: this.pets[i].render.y, radius: this.pets[i].render.radius * 4}, window.camera) === true){
                this.pets[i].draw();
            }
        }

        for(let i = 0; i < this.deadPets.length; i++){
            if(this.deadPets[i]?.render?.x === undefined){
                continue;
            }
            if(toRender({x: this.deadPets[i].render.x, y: this.deadPets[i].render.y, radius: this.deadPets[i].render.radius * 4}, window.camera) === true){
                this.deadPets[i].draw();
            }
        }

    }
    draw(){
        if(this.id !== window.selfId){
            this.updateInterpolate();
        }
        // this.updateRenderPos();
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.headX, this.headY, 30, 0, Math.PI*2);
        // ctx.fill();
        // ctx.closePath();

        // // rendering hp
        // ctx.fillStyle = '#333333';
        // ctx.beginPath();
        // ctx.roundRect(this.render.headX - this.radius*1.6, this.render.headY + this.radius*1.775, this.radius*3.2, this.radius*0.39, this.radius*0.25);
        // ctx.fill();
        // ctx.closePath();

        // ctx.fillStyle = '#73de36'
        // ctx.beginPath();
        // if(this.hp < this.maxHp / 10){
        //     ctx.globalAlpha = this.hp * .95 / (this.maxHp / 10) + 0.05;
        // }
        // ctx.roundRect(this.render.headX - this.radius*1.6+1.75, this.render.headY + this.radius*1.775+1.75, (this.radius*3.2-this.radius*0.25-3.5)*this.hp/this.maxHp+this.radius*0.25, Math.max(0,this.radius*0.39-3.5), this.radius*0.25);
        // // ctx.roundRect(this.render.headX - this.radius*1.5+1.5, this.render.headY + this.radius*1.7+1.5, (this.radius*3-3)*this.hp/this.maxHp, Math.max(0,this.radius*0.35-3), this.radius*0.25, (this.radius*3-3));
        // ctx.fill();
        // ctx.closePath();
        // ctx.globalAlpha = 1;

        this.updatePetsAndProjectiles();

        for(let i = 0; i < this.deadProjectiles.length; i++){
            if(toRender({x: this.deadProjectiles[i].render.x, y: this.deadProjectiles[i].render.y, radius: this.deadProjectiles[i].radius}, window.camera) === true){
                this.deadProjectiles[i].draw();
            }
            this.deadProjectiles[i].updateTimer();
        }

        

        this.ticksSinceLastDamaged += dt;
        if(this.ticksSinceLastDamaged > 666){
            this.beforeStreakHp = this.hp;
        }
        
        renderHpBar({
            x: this.render.headX,
            y: this.render.headY - this.render.radius / 3,
            radius: this.render.radius,
            hp: this.render.hp,
            maxHp: this.maxHp,
            shield: this.render.shield,
            beforeStreakHp: this.render.beforeStreakHp,
            flowerName: this.name,
            flowerUsername: this.username
        },this);

        // ctx.lastFlowerTransform = ctx.getTransform();
        if(this.petalAlpha !== undefined){
            ctx.globalAlpha = this.petalAlpha;
        }

        if (this.id == window.selfId){
            petalReloadData = {};
            petalHpData = {};
        }
        for(let i = 0; i < this.petals.length; i++){
            let petal = this.petals[i];
            if(toRender({x: petal.render.x, y: petal.render.y, radius: petal.radius}, window.camera) === true){
                petal.draw();
            }
            if (this.id == window.selfId){
                let containerId = petal.petalContainerId;
                if (!petalReloadData[containerId]){
                    if (petal.dead){
                        petalReloadData[containerId] = {
                            reload: petal.render.reload/petal.maxReload
                        }
                    }
                }
                else{
                    if (petalReloadData[containerId].reload < petal.render.reload/petal.maxReload && petal.dead){
                        petalReloadData[containerId].reload = petal.render.reload/petal.maxReload;
                    }
                }

                if (!petalHpData[containerId]){
                    if (!petal.dead){
                        petalHpData[containerId] = {
                            hp: petal.render.hp/petal.maxHp,
                            count: 1
                        }
                    }
                }
                else{
                    //average
                    if(!petal.dead){
                        petalHpData[containerId].hp = (petalHpData[containerId].count * petalHpData[containerId].hp + petal.render.hp/petal.maxHp)/(petalHpData[containerId].count+1);
                        petalHpData[containerId].count++;
                    }
                    
                    
                }
            }
            petal.updateTimer();
        }
        ctx.globalAlpha = 1;
        // ctx.restore();
        // ctx.setTransform(ctx.lastPlayerTransform);
        // delete ctx.lastFlowerTransform;

		//borderRadius: (radius/25)**1.2*25*0.25,
        // const barDimensions = {
        //     w: (radius/25)**1.2*25*3.2+.33,
        //     h: (radius/25)**1.2*25*0.39+.33,
        //     borderRadius: (radius/25)**1.2*25*0.25,
        //     innerPadding: (radius/25)**1.05*1.8-.1
        // }
        // ctx.globalAlpha = fadeAlphaMult;
        // hp = Math.max(hp, 0);
        // beforeStreakHp = Math.max(beforeStreakHp, 0);
        // ctx.fillStyle = /*isEnemy ? '#131315' : */'#333333';
        // ctx.beginPath();
        // ctx.roundRect(x - barDimensions.w/2, y + radius*1.775, barDimensions.w, barDimensions.h, barDimensions.borderRadius);
        // ---

        // this.x = this.x//interpolate(this.x, this.x, .2);
        // this.y = this.y//interpolate(this.y, this.y, .2);
        // this.renderAngle = this.angle;
        // this.hp = this.hp;

        // this.x = this.headX - Math.cos(this.angle) * (this.magnitude/220) * this.radius/2;
        // this.y = this.headY - Math.sin(this.angle) * (this.magnitude/220) * this.radius/2;

        // this.render.x = interpolate(this.render.x, this.renderX, 0.22);
        // this.render.y = interpolate(this.render.y, this.renderY, 0.22);

        // this.updateRenderPos();

        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.render.x, this.render.y, 30, 0, Math.PI*2);
        // ctx.fill();
        // ctx.closePath();
        
        if(toRender({x: this.render.headX, y: this.render.headY, radius: this.render.radius}, window.camera) === true){
            this.drawFlower(this.render.headX, this.render.headY, this.radius);
        }

        //LIGHTNING
        if (this.lightnings){
            if (this.lightnings.length > 0){
                this.lightnings = this.lightnings.filter((e) => time < (e.time+600)) //600ms time
                ctx.strokeStyle = "#97f0ea";
                ctx.lineWidth = 3;
                for(let i of this.lightnings){
                    ctx.globalAlpha = (1-(time-i.time)/700);
                    ctx.beginPath();
                    for(let j = 0; j < i.renderData.length; j++){
                        ctx.lineTo(i.renderData[j].x, i.renderData[j].y);
                    }
                    ctx.stroke();
                    ctx.closePath();
                }
            }     
        }
        

        // const hashDistance = 500;
		// ctx.globalAlpha = 0.5;
        // if(this.hashData !== undefined){
        //     // console.log(this.hashData);
        //     for(let x = this.hashData.top.x; x <= this.hashData.bottom.x; x++){
        //         for(let y = this.hashData.top.y; y <= this.hashData.bottom.y; y++){
        //             ctx.fillStyle = 'red';
        //             ctx.beginPath();
        //             ctx.arc(x*hashDistance-4000,y*hashDistance-4000,8,0,Math.PI * 2);
        //             ctx.fill();
        //             ctx.closePath();
        //             ctx.globalAlpha = 0.2;
        //             ctx.fillRect(x*hashDistance-4000,y*hashDistance-4000,hashDistance,hashDistance);
        //             ctx.globalAlpha = 0.5;
        //         }
        //     }
        // }
		// ctx.globalAlpha = 1;
    }
    drawFlower(x, y, radius){
        if (this.dev){
            ctx.fillStyle = blendColor('#ffe763', '#FF0000', Math.max(0, 1 - this.ticksSinceLastDamaged / 166));
            ctx.strokeStyle = blendColor('#cebb50', '#FF0000', Math.max(0, 1 - this.ticksSinceLastDamaged / 166));
            ctx.fillStyle = blendColor(ctx.fillStyle, '#ce76da', Math.max(0, this.render.isPoisoned));
            ctx.strokeStyle = blendColor(ctx.strokeStyle, '#ab63b3', Math.max(0, this.render.isPoisoned));

            // we shouldn't do interpolation like this btw because it doesnt match natural behavior. TODO make linear interpolation sys between last recieved state and this one
            // this.x = interpolate(this.x, this.x, 0.1);
            // this.y = interpolate(this.y, this.y, 0.1);

            // this.renderAngle = interpolateDirection(this.renderAngle, this.angle, 1/3);
            // this.hp = interpolate(this.hp, this.hp, 0.1);

            // HEAD - use HEADX instead of X
            ctx.lineWidth = radius / 8;

            ctx.beginPath();
            ctx.lineTo(x + radius * 1.03, y + radius * -0.02);
            ctx.quadraticCurveTo(x + radius * 0.78, y + radius * 1.06, x + radius * 0.27, y + radius * 1.14)
            ctx.quadraticCurveTo(x + radius * -0.8, y + radius * 0.75, x + radius * -0.94, y + radius * 0.36)
            ctx.quadraticCurveTo(x + radius * -1.18, y + radius * -0.29, x + radius * -0.83, y + radius * -0.95)
            ctx.quadraticCurveTo(x + radius * -0.45, y + radius * -1.3, x + radius * -0.06, y + radius * -1.06)
            ctx.quadraticCurveTo(x + radius * 0.85, y + radius * -1.04, x + radius * 1.03, y + radius * -0.02)
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // eyes
            ctx.fillStyle = '#212219';
            ctx.beginPath();
            ctx.ellipse(x + radius / 2.5 + radius * 0.05, y + radius * 5 / 13.5, radius * 3 / 23.5 * 1.1, radius * 5.85 / 23.5 * 1.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.ellipse(x - radius / 2.5, y - radius * 5 / 23.5 + radius * -0.15, radius * 3 / 23.5 * 1.1, radius * 5.85 / 23.5 * 1.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            //ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

            // mouth
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = radius / 15;
            ctx.lineCap = 'round';

            let expressionOffset;// 0 to 1
            if (this.render.fastPetalDistance > neutralPetalDistance) {
                // we're attacking
                // petalDistance = 1 at this.petalDistance = petalDistance * 1.91;
                // petalDistance = 0 at this.petalDistance = petalDistance;
                expressionOffset = (this.render.fastPetalDistance - neutralPetalDistance) / 0.91 / neutralPetalDistance;
            } else {
                // we're defending; divide by 0.4
                // petalDistance = 1 at this.petalDistance = petalDistance * 0.6;
                // petalDistance = 0 at this.petalDistance = petalDistance
                expressionOffset = (neutralPetalDistance - this.render.fastPetalDistance) / 0.4 / neutralPetalDistance;
            }

            if (this.render.isPoisoned) {
                //"defending"
                expressionOffset = this.render.isPoisoned;

            }

            ctx.beginPath();
            ctx.moveTo(x - radius * 0.3 + radius / 4, y + radius * 0.025 + radius * 9.5 / 23.5);
            ctx.quadraticCurveTo(x - radius * 0.4, y - radius * 0.1 + 1.07 * radius * (5.5 + 9.5 * (1 - expressionOffset)) / 23.5 * 61.1 / 70, x - radius * 0.275 - radius / 4, y - radius * 0.25 + radius * 9.5 / 23.5);
            ctx.stroke();

            // eyes: we have a path oval and then white circle and we ctx.clip

            ctx.save();
            // oval clipping path
            ctx.beginPath();
            ctx.ellipse(x + radius / 2.5 + radius * 0.05, y + radius * 5 / 13.5, radius * 2.5 / 23.5 * 1.1, radius * 5 / 23.5 * 1.1, 0, 0, Math.PI * 2);
            ctx.clip();
            // ctx.closePath();

            // circle
            const eyeOffset = {
                x: Math.cos(this.render.angle) * radius * 2 / 23,
                y: Math.sin(this.render.angle) * radius * 3.5 / 23
            }
            ctx.fillStyle = '#eeeeee';
            ctx.beginPath();
            ctx.ellipse(x + radius / 2.5 + eyeOffset.x + radius * 0.05, y + radius * 5 / 13.5 + eyeOffset.y, radius * 2.92 / 23.5 * 1.1, radius * 2.92 / 23.5 * 1.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();

            ctx.save();
            // oval clipping path
            ctx.beginPath();
            ctx.ellipse(x - radius / 2.5, y - radius * 5 / 23.5 + radius * -0.15, + radius * 2.5 / 23.5 * 1.1, radius * 5 / 23.5 * 1.1, 0, 0, Math.PI * 2);
            ctx.clip();

            ctx.fillStyle = '#eeeeee';
            ctx.beginPath();
            ctx.ellipse(x - radius / 2.5 + eyeOffset.x, y - radius * 5 / 23.5 + -eyeOffset.y + radius * -0.15, radius * 3 / 23.5 * 1.1, radius * 3 / 23.5 * 1.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }
        else{
            ctx.fillStyle = blendColor('#ffe763', '#FF0000', Math.max(0, 1 - this.ticksSinceLastDamaged / 166));
            ctx.strokeStyle = blendColor('#cebb50', '#FF0000', Math.max(0, 1 - this.ticksSinceLastDamaged / 166));
            ctx.fillStyle = blendColor(ctx.fillStyle, '#ce76da', Math.max(0, this.render.isPoisoned));
            ctx.strokeStyle = blendColor(ctx.strokeStyle, '#ab63b3', Math.max(0, this.render.isPoisoned));
            // we shouldn't do interpolation like this btw because it doesnt match natural behavior. TODO make linear interpolation sys between last recieved state and this one
            // this.x = interpolate(this.x, this.x, 0.1);
            // this.y = interpolate(this.y, this.y, 0.1);

            // this.renderAngle = interpolateDirection(this.renderAngle, this.angle, 1/3);
            // this.hp = interpolate(this.hp, this.hp, 0.1);

            // HEAD - use HEADX instead of X
            ctx.lineWidth = radius/8;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // eyes
            ctx.fillStyle = '#212219';
            ctx.beginPath();
            ctx.ellipse(x - radius/3.5, y - radius*5/23.5, radius*3/23.5, radius*5.85/23.5, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.ellipse(x + radius/3.5, y - radius*5/23.5, radius*3/23.5, radius*5.85/23.5, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            //ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

            // mouth
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = radius/15;
            ctx.lineCap = 'round';

            let expressionOffset;// 0 to 1
            if(this.render.fastPetalDistance > neutralPetalDistance){
                // we're attacking
                // petalDistance = 1 at this.petalDistance = petalDistance * 1.91;
                // petalDistance = 0 at this.petalDistance = petalDistance;
                expressionOffset = (this.render.fastPetalDistance - neutralPetalDistance) / 0.91 / neutralPetalDistance;
            } else {
                // we're defending; divide by 0.4
                // petalDistance = 1 at this.petalDistance = petalDistance * 0.6;
                // petalDistance = 0 at this.petalDistance = petalDistance
                expressionOffset = (neutralPetalDistance - this.render.fastPetalDistance) / 0.4 / neutralPetalDistance;
            }

            if(this.render.isPoisoned > 0.001){
                //"defending"
                expressionOffset = Math.max(this.render.isPoisoned, expressionOffset);

            }
            
            ctx.beginPath();
            ctx.moveTo(x + radius/4, y + radius*9.5/23.5);
            ctx.quadraticCurveTo(x, y + 1.07*radius*(5.5+9.5*(1-expressionOffset))/23.5*61.1/70, x - radius/4, y + radius*9.5/23.5);
            ctx.stroke();

            // eyes: we have a path oval and then white circle and we ctx.clip
            
            ctx.save();
            // oval clipping path
            ctx.beginPath();
            ctx.ellipse(x + radius/3.5, y - radius*5/23.5, radius*2.5/23.5, radius*5/23.5, 0, 0, Math.PI*2);
            ctx.clip();
            // ctx.closePath();

            // circle
            const eyeOffset = {
                x: Math.cos(this.render.angle)*radius*2/23,
                y: Math.sin(this.render.angle)*radius*3.5/23
            }
            ctx.fillStyle = '#eeeeee';
            ctx.beginPath();
            ctx.ellipse(x + radius/3.5 + eyeOffset.x, y - radius*5/23.5 + eyeOffset.y, radius*2.92/23.5, radius*2.92/23.5, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();

            ctx.restore();

            ctx.save();
            // oval clipping path
            ctx.beginPath();
            ctx.ellipse(x - radius/3.5, y - radius*5/23.5, radius*2.5/23.5, radius*5/23.5, 0, 0, Math.PI*2);
            ctx.clip();

            ctx.fillStyle = '#eeeeee';
            ctx.beginPath();
            ctx.ellipse(x - radius/3.5 + eyeOffset.x, y - radius*5/23.5 + eyeOffset.y, radius*3/23.5, radius*3/23.5, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            
            ctx.restore();

            // triangle that makes the player look angry
            const offset = (this.render.petalDistance - 7 - neutralPetalDistance*1.8)/35 * radius/25;
            ctx.fillStyle = blendColor('#ffe763', '#FF0000', Math.max(0, 1 - this.ticksSinceLastDamaged / 166));
            ctx.fillStyle = blendColor(ctx.fillStyle, '#ce76da', Math.max(0, this.render.isPoisoned));
            ctx.beginPath();
            ctx.moveTo(x - radius/3.5*2, y - radius*14/23.5 + offset);
            ctx.lineTo(x + radius/3.5*2, y - radius*14/23.5 + offset);
            ctx.lineTo(x, y - radius*5/23.5 + offset);
            ctx.fill();
            ctx.closePath();
        }
    }
    static drawDeadFlower(x, y, radius){
        ctx.fillStyle = '#ffe763';
        ctx.strokeStyle = '#cebb50';

       
        ctx.lineWidth = radius/8;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // dead eyes
        ctx.fillStyle = '#212219';
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = radius/8;
        ctx.lineCap = 'round';
        
        let eyecenter = {x: x - radius/3.5, y:y - radius*5/23.5};
        
        ctx.beginPath();
        ctx.moveTo(eyecenter.x + radius*4/23.5, eyecenter.y + radius*4/23.5);
        ctx.lineTo(eyecenter.x - radius*4/23.5, eyecenter.y - radius*4/23.5);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(eyecenter.x + radius*4/23.5, eyecenter.y - radius*4/23.5);
        ctx.lineTo(eyecenter.x - radius*4/23.5, eyecenter.y + radius*4/23.5);
        ctx.stroke();
        ctx.closePath();

        eyecenter = {x: x + radius/3.5, y:y - radius*5/23.5};
        
        ctx.beginPath();
        ctx.moveTo(eyecenter.x + radius*4/23.5, eyecenter.y + radius*4/23.5);
        ctx.lineTo(eyecenter.x - radius*4/23.5, eyecenter.y - radius*4/23.5);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(eyecenter.x + radius*4/23.5, eyecenter.y - radius*4/23.5);
        ctx.lineTo(eyecenter.x - radius*4/23.5, eyecenter.y + radius*4/23.5);
        ctx.stroke();
        ctx.closePath();

        
        //ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

        // mouth
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = radius/15;
        ctx.lineCap = 'round';

        let expressionOffset = 1;// 0 to 1
        
        
        ctx.beginPath();
        ctx.moveTo(x + radius/4, y + radius*9.5/23.5);
        ctx.quadraticCurveTo(x, y + 1.07*radius*(5.5+9.5*(1-expressionOffset))/23.5*61.1/70, x - radius/4, y + radius*9.5/23.5);
        ctx.stroke();

        
        

        
    }
    pack(){
        return {
            // angle: this.angle,
            movementType: this.movementType,
            // magnitude: this.magnitude,
            input: this.input
        }
    }
}

function interpolate(start, end, time){
    time = Math.max(0, Math.min(1, time));
    return start * (1 - time) + end * time;
}

function shortAngleDist(a0,a1) {
    const max = Math.PI*2;
    const da = (a1 - a0) % max;
    return 2*da % max - da;
}

function interpolateDirection(a0,a1,t) {
    return a0 + shortAngleDist(a0,a1)*t;
}

function toRender(obj1, cam={x: 0, y: 0}){
    if(obj1.x === 'pass' || cam.disableCulling === true)return true;
    if(obj1.x - obj1.radius > cam.x + canvas.w/2/renderFov || obj1.x + obj1.radius < cam.x - canvas.w/2/renderFov) return false;
    if(obj1.y - obj1.radius > cam.y + canvas.h/2/renderFov || obj1.y + obj1.radius < cam.y - canvas.h/2/renderFov) return false;
    return true;
}