
const petalRotationNaturalRotate = {
    "Leaf": 1/1000,
    "Rock": 1/1000,
    "Ruby": 1/1000,
    "Sapphire": 1/1000,
    "Emerald": 1/1000,
    "Rice": 1/1000,
    "Yucca": 1/1000,
    "Pincer": 1/1000,
    "Yin Yang": 1/500,
    "Corn": 1/2000,
    "Bone": 1/1000,
    "Token": 1/1000,
    "Wing": 1/100,
    "Honey": 1/1000,
    "Neutron Star": 1/200,
    "Magnet": 1/1000,
    "Stick": 1/1000,
    "Salt": 1/1000,
    "Powder": 1/100,
    "Square": 1/1000,
    "Pentagon": 1/1000,
    "Orange": 1/1000,
    "Mandible": 1/1000,
    "Third Eye": 1/1000,
    "Bubble": 1/1000,
    "Starfish": 1/1000,
    "Claw": 1/1000,
    "Lightning": 1/1000,
    "Fangs": 1/1000,
    "Jelly": 1/1000,
    "Pearl": 1/1000,
    "Sponge": 1/1000,
    "Shell": 1/1000,
    "Coral": 1/1000,
    "Trident": 1/500,
    "Card": 1/1000,
    "Waterlogged Compass": 0.05
}
const petalRotationStickToParent = ["Missile", "Dandelion", "Web", "Fire Missile"] //These petals are rotated to match to their rotation around parent flower

//"Basic", "Light", "Stinger", "Sand", "Leaf", "Rock", "Faster", "Iris",
//"Rice", "Heavy", "Yucca", "Pincer", "Yin Yang", "Rose", "Dahlia",
//"Corn", "Bone", "Wing", "Missile", "Oranges", "Honey", "Peas", "Grapes",
//"Cactus", "Dandelion", "Egg", "Web", "Pollen", "Magnet", "Stick", "Salt",
//"Powder", "Square"

const petalPackKeys = [];
// petals are so weak that they shouldn't have mass. Not planning on adding a heaviest petal or anything. They will just rotate around and, if dead, will continue rotating around but just wont do damage
class Petal {
    constructor(init){
        if(petalRenderMap[init.type] === undefined && editorPetalShapesMap[init.type] !== undefined){
			return new Petal({...init, type: "Custom", customType: init.type});
		}
        for(let key in init){
            this[key] = init[key];
        }

        this.render = {};
        this.render.distance = this.distance;
        this.render.angle = this.angle;
        this.selfAngle = this.angle;
        this.render.x = this.x;
        this.render.y = this.y;
        this.render.reload = this.reload;
        this.render.hp = this.hp;

        this.dying = false;
        this.deadAnimationTimer = 9999;


        if(init.dead === true){
            this.firstDeadFlag = true;
        }

        this.ticksSinceLastDamaged = 9999;

        this.insidePetalContainer = false;

        this.isProjectile = false;

        if(window.isEditor) this.time = 0;

        // if(init.isSwappedPetal === true){
        //     console.log('xd');
        //     this.hp = -1;
        //     this.dead = true;
        //     this.dying = false;
        //     this.deadAnimationTimer = 9999;
        //     delete this.deadPosition;
        //     this.ticksSinceLastDamaged = 9999;
        // }
    }
    update(data, parent){
        // if((data.hp !== undefined && data.hp < this.hp) || data.dead === true){
        //     this.updateRenderDamage(data.hp);
        // }
        if(data.takeDamage === true && this.shotFlag !== true){
            this.updateRenderDamage();
            this.render.hp = data.hp;
        }
        for(let key in data){
            this[key] = data[key];
        }

        if(data.dead === true){
            this.render.reload = this.maxReload;
            if(this.firstDeadFlag !== undefined){
                delete this.firstDeadFlag;
                return;
            }
            
            if(this.shotFlag === true){
                delete this.shotFlag;
                this.dead = true;
                this.dying = false;
                this.deadAnimationTimer = 9999;
                delete this.deadPosition;
                this.ticksSinceLastDamaged = 9999;
                return;
            }
            // reason we don't find the shortest angle dist is because we wanna compare numbers straightforwardly
            // also if its negative then parent.petalRotateSpeed will also be negative which is fine
            this.dead = false;
            this.dying = true;
            this.deadAnimationTimer = 0;
            this.deadPosition = {x: this.x, y: this.y}; // making petals stay where they were when they die
            // this.deadAnimationTimer = -(this.angle-this.render.angle)/parent.petalRotateSpeed// * 1000 / 30;
            // this.dead = false;
            // this.dying = true;
            // this.deadAnimationTimer = 0;
        }
        else if (data.dead === false){
            this.dead = false;
            this.dying = false;
            this.deadAnimationTimer = 9999;
            this.selfAngle = this.render.angle;
        }
    }
    updateRenderDamage(hp){
        this.ticksSinceLastDamaged = 0;
        this.lastTicksSinceLastDamaged = 0;
    }
    updateInterpolate(parent){
        if(this.miniPetalChildId !== undefined){
            const f = parent;
            let found = false;
            for(let i = 0; i < parent.petals.length; i++){
                if(parent.petals[i].miniPetalParentId === this.miniPetalChildId){
                    parent = parent.petals[i];
                    found = true;
                    break;
                }
            }
            if(found === false) return;
            // if(found === false) {console.error('flowerPetalParent not found!', this.miniPetalChildId);return;}
            parent.baseX = parent.x; parent.baseY = parent.y; parent.petalLag = f.petalLag; parent.render.baseX = parent.render.x; parent.render.baseY = parent.render.y; 
            parent.petalRotation = -f.petalRotation;
        }
        if(this.isProjectile === true || (this?.stats?.code !== undefined && this.hasNormalPetalSimulate === undefined)){
            if(window.isEditor && this.deadPosition !== undefined) return;
            this.render.x = interpolate(this.render.x, this.x, 0.08 * dt/16.66);
            this.render.y = interpolate(this.render.y, this.y, 0.08 * dt/16.66);
            this.selfAngle = interpolateDirection(this.selfAngle, this.render.selfAngle, 0.08 * dt/16.66);
            return;
        }

        // stuff that isn't sent in the updatepack
        this.angle = parent.petalRotation + this.angleOffset//this.id / parent.petals.length * Math.PI * 2;

        let offsetAngle = this.offset.angle;
        if (this.stickParentRotation){
            offsetAngle += this.angle;
        }
        
        this.x = parent.baseX + Math.cos(this.angle) * (this.distance) + Math.cos(offsetAngle) * this.offset.distance;
        this.y = parent.baseY + Math.sin(this.angle) * (this.distance) + Math.sin(offsetAngle) * this.offset.distance;

        if(this.slowInterpolateDistance === true){
            this.render.distance = interpolate(this.render.distance, this.distance, Math.max(0.01, this.render.distance / this.distance / 10) * dt/16.66);
        } else {
            this.render.distance = interpolate(this.render.distance, this.distance, .64 * dt/16.66)
        }

        this.render.angle = interpolateDirection(this.render.angle - parent.petalLag, this.angle, 0.08 * dt/16.66) + parent.petalLag;

        if(this.dead === false && this.deadPosition !== undefined){
            delete this.deadPosition;
        }
        if(this.deadPosition !== undefined){
            this.render.x = interpolate(this.render.x, this.deadPosition.x, 0.13 * dt/16.66);
            this.render.y = interpolate(this.render.y, this.deadPosition.y, 0.13 * dt/16.66);
        } else {
            this.render.x = interpolate(this.render.x, parent.render.baseX + Math.cos(this.render.angle) * (this.render.distance) + Math.cos(offsetAngle) * this.offset.distance, 0.26 * dt/16.66);
            this.render.y = interpolate(this.render.y, parent.render.baseY + Math.sin(this.render.angle) * (this.render.distance) + Math.sin(offsetAngle) * this.offset.distance, 0.26 * dt/16.66);
        }
        this.render.reload = interpolate(this.render.reload, this.reload, 0.13 * dt/16.66);
        this.render.hp = interpolate(this.render.hp, this.hp, 0.13 * dt/16.66);

        if (petalRotationNaturalRotate[this.type]){
            this.selfAngle += petalRotationNaturalRotate[this.type] * dt;
        }
        if (petalRotationStickToParent.includes(this.type)){
            this.selfAngle = Math.atan2(this.render.y - parent.render.y, this.render.x - parent.render.x)
        }
        if (this.type === 'Custom'){
            this.selfAngle = Math.atan2(this.render.y - parent.render.y, this.render.x - parent.render.x);
        }
        if (this.type === "Compass" || this.type === "Dark Compass") {
            if (!this.lastCheckedTime){
                this.lastCheckedTime = 0;
            }
            if (time > this.lastCheckedTime + 2000){
                this.selfAngle = Math.random() * Math.PI * 2;
                this.lastCheckedTime = time;
            }
        }


    }
    // simulate(parent){
    //     // ANGLE
    //     this.angle = parent.petalRotation + this.angleOffset//this.id / parent.petals.length * Math.PI * 2;

    //     // // DISTANCE
    //     // // florr petals seem to behave like springs
    //     // // hookes law => just apply a force proportional to the distance
    //     // this.dv += (parent.petalDistance - this.distance) * dt / 1000 / 2;
    //     // this.dv *= 0.9 ** dt;

    //     // this.dv += (parent.petalDistance - this.distance) / 4.85;
    //     let petalDistance = parent.petalDistance;
    //     if(parent.attacking === true){
    //         if(this.attackDistanceMult !== undefined){
    //             petalDistance *= this.attackDistanceMult
    //         }
    //     } else if(parent.defending === true){
    //         if(this.defendDistanceMult !== undefined){
    //             petalDistance *= this.defendDistanceMult;
    //         }
    //     } else {
    //         if(this.neutralDistanceMult !== undefined){
    //             petalDistance *= this.neutralDistanceMult;
    //         }
    //     }

    //     this.dv += (petalDistance/*parent.petalDistance*/ - this.distance) / 4.85; 

    //     this.distance += this.dv;
        
    //     // this.dv += (parent.petalDistance - this.distance) * dt / 1000 / 2;
    //     // this.distance = parent.petalDistance;
    //     // this.dv *= 0.9 ** dt;

    //     // this.x = parent.x + Math.cos(this.angle + this.offset.angle) * (this.distance + this.offset.distance);
    //     // this.y = parent.y + Math.sin(this.angle + this.offset.angle) * (this.distance + this.offset.distance);

    //     this.x = parent.x + Math.cos(this.angle) * (this.distance) + Math.cos(this.offset.angle) * this.offset.distance;
    //     this.y = parent.y + Math.sin(this.angle) * (this.distance) + Math.sin(this.offset.angle) * this.offset.distance;

    //     this.dv *= 0.68;

    //     // this.render.x = this.renderX;
    //     // this.render.y = this.renderY;
    //     // consolp.log(parent.render.x, this.render.angle, this.render.distance, this.renderX)
    // }
    // petals dont transmit any data! its just intercepted by the parent
    // pack() {
    //     return;
    // }
    draw(){
        this.lastTicksSinceLastDamaged = this.ticksSinceLastDamaged;
        this.ticksSinceLastDamaged+=dt;

        if(this.dead === true){
            if(this.dying === true){
                this.deadAnimationTimer+=dt;
                if(this.deadAnimationTimer > 166){
                    this.deadAnimationTimer = 0;
                    this.dead = true;
                    this.dying = false;
                    delete this.deadPosition;
                }
            }
            return;
        }

        ctx.translate(this.render.x, this.render.y);
        if(this.dying === true){
            // if(this.deadAnimationTimer >= 0 && this.deadAnimationTimer <= 1){
            //     this.updateRenderDamage(this.hp);
            // }
            var scalar = 1 + Math.cbrt(Math.log10(Math.max(1,this.deadAnimationTimer/16.6))) * 0.6;
            ctx.globalAlpha = Math.max(0, 1 - this.deadAnimationTimer / 166);
            if(this.type === "Custom"){
                window.alphaMult = ctx.globalAlpha;
            }
            ctx.scale(scalar, scalar);
        } else if(this.scaleMult !== undefined){// else if because petals will never be dying while in their container
            ctx.scale(this.scaleMult, this.scaleMult);
        }

        ctx.rotate(this.selfAngle);

        if(petalRenderMap[this.type])petalRenderMap[this.type](this);
        else console.log(this.type);
        
        ctx.rotate(-this.selfAngle);

        if(this.dying === true){
            ctx.scale(1 / scalar, 1 / scalar);
            ctx.globalAlpha = 1;
            if(this.deadAnimationTimer > 166){
                this.deadAnimationTimer = 0;
                this.dead = true;
                this.dying = false;
                delete this.deadPosition;
            }
        } else if(this.scaleMult !== undefined){
            ctx.scale(1 / this.scaleMult, 1 / this.scaleMult);
        }
        ctx.translate(-this.render.x, -this.render.y);

        if(window.alphaMult !== undefined){
            delete window.alphaMult;
        }
    }
    updateTimer(){
        if (this.dying === true){
            this.deadAnimationTimer+=dt;
        }
    }
}

function blendAmount(p){
	return Math.max(0, 1 - p.ticksSinceLastDamaged / 166.5);
}
function checkForFirstFrame(p){
	return (p.lastTicksSinceLastDamaged < 13 && !damageFlash)
} 
const petalRenderMap = {
    Basic: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ffffff', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfcfcf', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Rubber: (p) => {
        ctx.lineWidth = p.radius * 0.22;

        ctx.fillStyle = blendColor('#efefef', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#c1c1c1', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.beginPath();
        ctx.moveTo(p.radius * -0.25, p.radius * -1.05);
        ctx.quadraticCurveTo(p.radius * 0.5, p.radius * -0.71, p.radius * 1.05, p.radius * -0.25);
        ctx.quadraticCurveTo(p.radius * 0.71, p.radius * 0.5, p.radius * 0.25, p.radius * 1.05);
        ctx.quadraticCurveTo(p.radius * -0.5, p.radius * 0.71, p.radius * -1.05, p.radius * 0.25);
        ctx.quadraticCurveTo(p.radius * -0.71, p.radius * -0.5, p.radius * -0.25, p.radius * -1.05);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Husk: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = blendColor('#000000', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();
    },
    Coral: (p) => {
        ctx.strokeStyle = blendColor('#b04646', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.strokeStyle = "#FFFFFF";
        }

        ctx.lineWidth = p.radius * 0.35;

        ctx.beginPath();
        ctx.moveTo(0, p.radius * 1.17);
        ctx.quadraticCurveTo(0, p.radius * 0.85, p.radius * 0.6, p.radius * 0.35);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(p.radius * 0, p.radius * 1.17);
        ctx.quadraticCurveTo(p.radius * 0.15, p.radius * 0.26, p.radius * -0.69, p.radius * -0.2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(p.radius * 0, p.radius * 1.17);
        ctx.quadraticCurveTo(p.radius * -0.05, p.radius * -0.3, p.radius * 0.56, p.radius * -0.75);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(p.radius * 0, p.radius * 1.17);
        ctx.quadraticCurveTo(p.radius * 0.1, p.radius * -0.3, p.radius * -0.08, p.radius * -1.13);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = blendColor('#f76767', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.strokeStyle = "#FFFFFF";
        }

        ctx.lineWidth = p.radius * 0.2;

        ctx.beginPath();
        ctx.moveTo(0, p.radius * 1.17);
        ctx.quadraticCurveTo(0, p.radius * 0.85, p.radius * 0.6, p.radius * 0.35);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(p.radius * 0, p.radius * 1.17);
        ctx.quadraticCurveTo(p.radius * 0.15, p.radius * 0.26, p.radius * -0.69, p.radius * -0.2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(p.radius * 0, p.radius * 1.17);
        ctx.quadraticCurveTo(p.radius * -0.05, p.radius * -0.3, p.radius * 0.56, p.radius * -0.75);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(p.radius * 0, p.radius * 1.17);
        ctx.quadraticCurveTo(p.radius * 0.1, p.radius * -0.3, p.radius * -0.08, p.radius * -1.13);
        ctx.stroke();
        ctx.closePath();
    },
    Bubble: (p) => {
		ctx.lineWidth = p.radius / 5;

		ctx.fillStyle = blendColor('#ffffff', "#FF0000", Math.max(0, blendAmount(p)));
		ctx.strokeStyle = blendColor('#ffffff', "#FF0000", Math.max(0, blendAmount(p)));
		if (checkForFirstFrame(p)) {
			ctx.fillStyle = "#ffffff"; //"#FFFFFF";
			ctx.strokeStyle = "#ffffff" //'#cecece';//blendColor("#FFFFFF", "#000000", 0.19);
		}
		ctx.globalAlpha *= 0.6;
		ctx.beginPath();
		ctx.arc(0, 0, p.radius * 9 / 10, 0, Math.PI * 2);
		ctx.stroke();
		ctx.closePath();
		ctx.globalAlpha *= 0.6;
		ctx.beginPath();
		ctx.arc(0, 0, p.radius * 8 / 10, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(-p.radius * 0.45, 0, p.radius * 1 / 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		
		ctx.globalAlpha *= 2.777777777;
    },
    Air: (p) => {
        //Air is not rendered
    },
    Starfish: (p) => {
        ctx.lineWidth = p.radius * 0.14;

        ctx.strokeStyle = blendColor('#a9403e', '#FF0000', blendAmount(p));
        ctx.fillStyle = blendColor('#d14f4d', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.84, p.radius * 0.65);
        ctx.quadraticCurveTo(p.radius * -0.99, p.radius * 0.52, p.radius * -0.87, p.radius * 0.37)
        ctx.quadraticCurveTo(p.radius * 0.23, p.radius * -1.25, p.radius * 0.57, p.radius * -0.99)
        ctx.quadraticCurveTo(p.radius * 0.98, p.radius * -0.78, p.radius * -0.07, p.radius * 0.93)
        ctx.quadraticCurveTo(p.radius * -0.18, p.radius * 1.03, p.radius * -0.31, p.radius * 0.98)
        
        ctx.lineTo(p.radius * -0.84, p.radius * 0.65);

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = blendColor('#d4766c', '#FF0000', blendAmount(p))
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
        }

        ctx.beginPath();
        ctx.arc(p.radius * -0.18, p.radius * 0.21, p.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.09, p.radius * -0.23, p.radius * 0.165, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.31, p.radius * -0.57, p.radius * 0.11, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        

    },
    Compass: (p) => {

        ctx.lineWidth = 2.4;

        
        ctx.beginPath();
        ctx.fillStyle = blendColor('#3498db', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#bfbfbf', '#FF0000', blendAmount(p));
        let redCompass = blendColor('#e74c3c', '#FF0000', blendAmount(p))
        let whiteCompass = blendColor('#ecf0f1', '#FF0000', blendAmount(p))
        let centerDot = ctx.strokeStyle;

        //glow
        //shadow
        if(p.glow >= 0){
            ctx.save();

            let glowColor = Colors.rarities[p.glow].color
            let extraRadius = 0;
            if(p.glow >= 8){
                //omega+
                extraRadius += 0.5
            }
            if(p.glow >= 11){
                //supreme+
                extraRadius += 0.5
            }
            if(p.glow == 11){
                //make slightly brighter
                glowColor = "#db68f7"
            }
            ctx.fillStyle = glowColor
            ctx.globalAlpha = 0.7;

            ctx.arc(0, 0, p.radius * (2 + extraRadius + 0.3* Math.cos(Date.now() / 500)), 0, Math.PI*2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.restore();

            redCompass = blendColor(glowColor, '#FF0000', blendAmount(p));
            centerDot = blendColor(Colors.rarities[p.glow].border, '#FF0000', blendAmount(p));

        }
        
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
            redCompass = "#FFFFFF";
            whiteCompass = "#FFFFFF";
        }

        
        

        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
        ctx.fillStyle = redCompass;
        ctx.beginPath();
        ctx.lineTo(0, -p.radius * 0.4);
        ctx.lineTo(p.radius, 0);
        ctx.lineTo(0, p.radius * 0.4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = whiteCompass;
        ctx.beginPath();
        ctx.lineTo(0, -p.radius * 0.4);
        ctx.lineTo(-p.radius, 0);
        ctx.lineTo(0, p.radius * 0.4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = centerDot;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius/4, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        
    },
    "Waterlogged Compass": (p) => {
        ctx.lineWidth = 2.4;

        
        ctx.beginPath();
        ctx.fillStyle = blendColor('#70a7cf', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#bfbfbf', '#FF0000', blendAmount(p));
        let redCompass = blendColor('#3c3fe7', '#FF0000', blendAmount(p))
        let whiteCompass = blendColor('#ecf0f1', '#FF0000', blendAmount(p))
        let centerDot = ctx.strokeStyle;
        
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
            redCompass = "#FFFFFF";
            whiteCompass = "#FFFFFF";
        }

        
        

        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
        ctx.fillStyle = redCompass;
        ctx.beginPath();
        ctx.lineTo(0, -p.radius * 0.4);
        ctx.lineTo(p.radius, 0);
        ctx.lineTo(0, p.radius * 0.4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = whiteCompass;
        ctx.beginPath();
        ctx.lineTo(0, -p.radius * 0.4);
        ctx.lineTo(-p.radius, 0);
        ctx.lineTo(0, p.radius * 0.4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = centerDot;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius/4, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

    },
    "Dark Compass": (p) => {

        ctx.lineWidth = 2.4;

        
        ctx.beginPath();
        ctx.fillStyle = blendColor('#db3434', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#bfbfbf', '#FF0000', blendAmount(p));
        let redCompass = blendColor('#3c9de7', '#FF0000', blendAmount(p))
        let whiteCompass = blendColor('#ecf0f1', '#FF0000', blendAmount(p))
        let centerDot = ctx.strokeStyle;

        //glow
        //shadow
        if(p.glow >= 0){
            ctx.save();

            let glowColor = Colors.rarities[p.glow].color
            let extraRadius = 0;
            if(p.glow >= 8){
                //omega+
                extraRadius += 0.5
            }
            if(p.glow >= 11){
                //supreme+
                extraRadius += 0.5
            }
            if(p.glow == 11){
                //make slightly brighter
                glowColor = "#db68f7"
            }
            ctx.fillStyle = glowColor
            ctx.globalAlpha = 0.7;

            ctx.arc(0, 0, p.radius * (2 + extraRadius + 0.3* Math.cos(Date.now() / 500)), 0, Math.PI*2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.restore();

            redCompass = blendColor(glowColor, '#FF0000', blendAmount(p));
            centerDot = blendColor(Colors.rarities[p.glow].border, '#FF0000', blendAmount(p));

        }
        
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
            redCompass = "#FFFFFF";
            whiteCompass = "#FFFFFF";
        }

        
        

        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
        ctx.fillStyle = redCompass;
        ctx.beginPath();
        ctx.lineTo(0, -p.radius * 0.4);
        ctx.lineTo(p.radius, 0);
        ctx.lineTo(0, p.radius * 0.4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = whiteCompass;
        ctx.beginPath();
        ctx.lineTo(0, -p.radius * 0.4);
        ctx.lineTo(-p.radius, 0);
        ctx.lineTo(0, p.radius * 0.4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = centerDot;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius/4, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        
    },
    Claw: (p) => {
        ctx.strokeStyle = blendColor('#3e1f1b', '#FF0000', blendAmount(p));
        ctx.fillStyle = blendColor('#4d2621', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }

        ctx.lineWidth = p.radius * 0.3;
        ctx.beginPath();
        ctx.lineTo(p.radius * -1.045, p.radius * 0.175)
        ctx.quadraticCurveTo(p.radius * -0.9, p.radius * -0.14, p.radius * -0.985, p.radius * -0.41);
        ctx.quadraticCurveTo(p.radius * 0.68, p.radius * -1.14, p.radius * 1.27, p.radius * 0.55);
        ctx.lineTo(p.radius * 0.59, p.radius * 0.05);
        ctx.lineTo(p.radius * 0.8, p.radius * 0.8);
        ctx.quadraticCurveTo(p.radius * -0.2, p.radius * -0.2, p.radius * -1.045, p.radius * 0.175)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    "Lightning": (p) => {
        ctx.strokeStyle = blendColor('#21c4b9', '#FF0000', blendAmount(p));
        ctx.fillStyle = blendColor('#29f2e5', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#ffffff"; 
            ctx.strokeStyle = "#ffffff";
        }

        ctx.lineWidth = p.radius * 0.2;
        ctx.beginPath();
        for(let i = 0; i<10; i++){
            let ang = i * Math.PI/5;
            ctx.lineTo(Math.cos(ang) * p.radius * 0.7, Math.sin(ang) * p.radius * 0.7)
            ctx.lineTo(Math.cos(ang + Math.PI/10) * p.radius * 1.4, Math.sin(ang + Math.PI/10) * p.radius * 1.4)
            
        }
        ctx.lineTo(p.radius * 0.7, 0)
        ctx.fill();
        ctx.stroke();
    },
    "Fangs": (p) => {
        ctx.strokeStyle = blendColor('#7e0d0d', '#FF0000', blendAmount(p));
        ctx.fillStyle = blendColor('#9c1010', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#ffffff"; 
            ctx.strokeStyle = "#ffffff";
        }
        

        ctx.lineWidth = p.radius * 0.22;

        ctx.beginPath();
        ctx.moveTo(-p.radius * 0.52, -p.radius * 0.815)
        ctx.lineTo(-p.radius * 0.51, -p.radius * 0.11);
        ctx.quadraticCurveTo(-p.radius * 0.53, p.radius * 0.35, -p.radius * 0.18, p.radius * 0.46)
        ctx.lineTo(p.radius * 0.515, p.radius * 0.785)
        ctx.lineTo(p.radius * 0.51, p.radius * 0.1)
        ctx.quadraticCurveTo(p.radius * 0.56, p.radius * -0.37, p.radius * 0.11, p.radius * -0.525)
        ctx.lineTo(-p.radius * 0.52, -p.radius * 0.815)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    "Jelly": (p) => {
        ctx.strokeStyle = blendColor('#bbb9e4', '#FF0000', blendAmount(p));
        ctx.fillStyle = blendColor('#bbb9e4', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#ffffff"; 
            ctx.strokeStyle = "#ffffff";
        }

        ctx.globalAlpha *= 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;

        ctx.lineWidth = p.radius * 0.25;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        ctx.globalAlpha *= 0.7;
        ctx.beginPath();
        ctx.arc(p.radius * 0.16, p.radius * 0.5, p.radius * 0.33, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.66, p.radius * 0.25, p.radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.46, p.radius * -0.29, p.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.21, p.radius * -0.21, p.radius * 0.165, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(0, p.radius * -0.82, p.radius * 0.164, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 1/0.7;
    },
    Pearl: (p) => {
        ctx.lineWidth = p.radius / 5;
        ctx.fillStyle = blendColor('#fffcd1', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfcca9', '#FF0000', blendAmount(p));
        let color3 = blendColor('#ffffff', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
            color3 = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = color3;
        ctx.beginPath();
        ctx.arc(p.radius*0.3, -p.radius*0.3, p.radius*0.3, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        
    },
    Sponge: (p) => {
        ctx.fillStyle = blendColor('#efc99a', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#c2a37d', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.lineWidth = p.radius*0.2;
        ctx.beginPath();
        ctx.moveTo(p.radius * 0.7, 0);
        for (let i = Math.PI * 1/7; i < Math.PI * 2; i += Math.PI * 2 / 7) {
          ctx.quadraticCurveTo(Math.cos(i) * p.radius * 1.2, Math.sin(i) * p.radius * 1.2, Math.cos(i + Math.PI * 1 / 7) * p.radius * 0.7, Math.sin(i + Math.PI * 1 / 7) * p.radius * 0.7);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Shell: (p) => {
        ctx.strokeStyle = blendColor('#ccb36d', '#FF0000', blendAmount(p));
        ctx.fillStyle = blendColor('#fcdd86', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#ffffff"; 
            ctx.strokeStyle = "#ffffff";
        }

        ctx.lineWidth = p.radius * 0.2;

        ctx.beginPath();
        ctx.lineTo(p.radius * -0.73, p.radius * -0.375);
        ctx.lineTo(p.radius * 0.39, p.radius * -1.15)
        ctx.arcTo(p.radius * 3.3, p.radius * 0.21, p.radius * 0.14, p.radius * 1.19, p.radius * 1.24)
        ctx.lineTo(p.radius * 0.14, p.radius * 1.19);
        ctx.lineTo(p.radius * 0.14, p.radius * 1.19);
        ctx.lineTo(p.radius * -0.78, p.radius * 0.24);
        ctx.quadraticCurveTo(p.radius * -0.94, p.radius * -0.06, p.radius * -0.73, p.radius * -0.375)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        ctx.lineWidth = p.radius * 0.16
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.45, p.radius * -0.24);
        ctx.lineTo(p.radius * 0.44, p.radius * -0.585);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.37, p.radius * -0.115);
        ctx.lineTo(p.radius * 0.62, p.radius * -0.19);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.39, p.radius * 0.05);
        ctx.lineTo(p.radius * 0.57, p.radius * 0.31);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.47, p.radius * 0.16);
        ctx.lineTo(p.radius * 0.31, p.radius * 0.656);
        ctx.stroke();
        ctx.closePath();
    },
    "Third Eye": (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#000000', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
        }
        
        ctx.beginPath();
        ctx.lineTo(0, -p.radius);
        ctx.quadraticCurveTo(p.radius, 0, 0, p.radius);
        ctx.quadraticCurveTo(-p.radius, 0, 0, -p.radius);
        ctx.fill();
        ctx.fillStyle = blendColor('#FFFFFF', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius*0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    },
    
    Mandible: (p) => {
        
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#811009', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#660d07', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.beginPath();
        ctx.moveTo(p.radius * -0.82, p.radius * -1.03);
        ctx.quadraticCurveTo(p.radius * 0.21, p.radius * -0.7, p.radius * 0.44, p.radius * -0.3);
        ctx.quadraticCurveTo(p.radius * 0.78, p.radius * 0.2, p.radius * 0.74, p.radius * 0.76);
        ctx.lineTo(p.radius * 0.47, p.radius * 0.97);
        ctx.lineTo(p.radius * -0.03, p.radius * 1.01);
        ctx.quadraticCurveTo(p.radius * 0.68, p.radius * 0.25, p.radius * 0.06, p.radius * -0.12);
        ctx.lineTo(p.radius * -0.32, p.radius * -0.11);
        ctx.quadraticCurveTo(p.radius * 0.12, p.radius * -0.31, p.radius * -0.06, p.radius * -0.5);
        ctx.quadraticCurveTo(p.radius * -0.19, p.radius * -0.66, p.radius * -0.66, p.radius * -0.42);
        ctx.quadraticCurveTo(p.radius * -0.13, p.radius * -0.73, p.radius * -0.82, p.radius * -1.03);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Light: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ffffff', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfcfcf', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Heavy: (p) => {
        ctx.lineWidth = p.radius / 5;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#333333', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#292929', '#FF0000', blendAmount(p));
        let color3 = blendColor('#cccccc', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
            color3 = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = color3;
        ctx.beginPath();
        ctx.arc(p.radius*0.35, -p.radius*0.35, p.radius*0.3, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        
    },
    Rice: (p) => {
        ctx.beginPath();
        let innerColor = blendColor('#ffffff', '#FF0000', blendAmount(p));
        let outerColor = blendColor('#cfcfcf', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            innerColor = "#FFFFFF";
            outerColor = "#FFFFFF";
        }
        
        ctx.strokeStyle = outerColor;
        ctx.lineWidth = p.radius;
        ctx.beginPath();
        ctx.moveTo(-p.radius, 0);
        ctx.quadraticCurveTo(0, -p.radius * 0.4, p.radius, 0);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = innerColor;
        ctx.lineWidth = p.radius / 2;
        ctx.beginPath();
        ctx.moveTo(-p.radius, 0);
        ctx.quadraticCurveTo(0, -p.radius * 0.4, p.radius, 0);
        ctx.stroke();
        ctx.closePath();


    },
    Iris: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ce76db', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#a760b1', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Faster: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#feffc9', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cecfa3', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Stinger: (p) => {
        ctx.fillStyle = blendColor('#333333', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#292929', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.lineWidth = 2.75;
        ctx.lineJoin = 'round';

        if(p.rarity >= 9){
            // fstinger+
            ctx.rotate(p.offset.angle);
        } else if(p.rarity >= 6){
            // pinger
            ctx.rotate(Math.PI+p.offset.angle);
        } else if(p.rarity === 5){
            // tringer
            ctx.rotate(p.angle);
        }
        
        // ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.moveTo(p.radius, 0);
        ctx.lineTo(Math.cos(2 / 3 * Math.PI) * p.radius, Math.sin(2 / 3 * Math.PI) * p.radius)// 120 deg
        ctx.lineTo(Math.cos(4 / 3 * Math.PI) * p.radius, Math.sin(4 / 3 * Math.PI) * p.radius)// 240 deg
        ctx.lineTo(p.radius, 0)// back to 0 deg
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // ctx.rotate(-p.angle);

        if(p.rarity >= 9){
            // fstinger+
            ctx.rotate(-p.offset.angle);
        } else if(p.rarity >= 6){
            // pinger
            ctx.rotate(-Math.PI-p.offset.angle);
        } else if(p.rarity === 5){
            // tringer
            ctx.rotate(-p.angle);
        }
    },
    Sand: (p) => {
        ctx.rotate(p.offset.angle);
        ctx.lineWidth = 3;//60;//3
        ctx.fillStyle = blendColor('#e0c85c', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#b5a24b', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }

        ctx.lineCap = 'round';
        
        ctx.beginPath();
        // ctx.rotate(p.offset.angle);
        ctx.moveTo(p.radius, 0);
        for(let i = 0; i < Math.PI * 2; i+=Math.PI / 3){
            ctx.lineTo(Math.cos(i + Math.PI / 5) * p.radius, Math.sin(i + Math.PI / 5) * p.radius);
        }
        // ctx.rotate(-p.offset.angle);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-p.offset.angle);
    },
    Missile: (p) => {
        // ctx.fillStyle = blendColor('#333333', '#FF0000', blendAmount(p));
        // ctx.strokeStyle = blendColor('#292929', '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        //     ctx.strokeStyle = "#FFFFFF";
        // }
        // ctx.lineWidth = p.radius/4;
        // ctx.beginPath();
        // ctx.moveTo(p.radius*1.3, 0);
        // ctx.lineTo(Math.cos(2 / 3 * Math.PI) * p.radius*1.8, Math.sin(2 / 3 * Math.PI) * p.radius*0.7)// 120 deg
        // ctx.lineTo(Math.cos(4 / 3 * Math.PI) * p.radius*1.8, Math.sin(4 / 3 * Math.PI) * p.radius*0.7)// 240 deg
        // ctx.lineTo(p.radius*1.3, 0)// back to 0 deg
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();
        let bodyColor = blendColor("#333333", "#FF0000", blendAmount(p));
		if (checkForFirstFrame(p)) {
			bodyColor = "#FFFFFF";
		}

		ctx.lineJoin = 'round';

        ctx.rotate(Math.PI / 2);
		// TODO: actually finish this render
		ctx.beginPath();
		ctx.fillStyle = bodyColor;
		ctx.strokeStyle = bodyColor;
		ctx.lineWidth = p.radius / 1.5;

		ctx.moveTo(0, -p.radius * Math.sqrt(3));
		ctx.lineTo(p.radius * Math.sqrt(3) * .48, p.radius / 2 * Math.sqrt(3));
		ctx.lineTo(-p.radius * Math.sqrt(3) * .48, p.radius / 2 * Math.sqrt(3));
		ctx.lineTo(0, -p.radius * Math.sqrt(3));
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
        ctx.rotate(-Math.PI / 2)
    },
    "Fire Missile": (p) => {
        // ctx.fillStyle = blendColor('#333333', '#FF0000', blendAmount(p));
        // ctx.strokeStyle = blendColor('#292929', '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        //     ctx.strokeStyle = "#FFFFFF";
        // }
        // ctx.lineWidth = p.radius/4;
        // ctx.beginPath();
        // ctx.moveTo(p.radius*1.3, 0);
        // ctx.lineTo(Math.cos(2 / 3 * Math.PI) * p.radius*1.8, Math.sin(2 / 3 * Math.PI) * p.radius*0.7)// 120 deg
        // ctx.lineTo(Math.cos(4 / 3 * Math.PI) * p.radius*1.8, Math.sin(4 / 3 * Math.PI) * p.radius*0.7)// 240 deg
        // ctx.lineTo(p.radius*1.3, 0)// back to 0 deg
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();
        let bodyColor = blendColor("#882200", "#FF0000", blendAmount(p));
		if (checkForFirstFrame(p)) {
			bodyColor = "#FFFFFF";
		}

		ctx.lineJoin = 'round';

        ctx.rotate(Math.PI / 2);
		// TODO: actually finish this render
		ctx.beginPath();
		ctx.fillStyle = bodyColor;
		ctx.strokeStyle = bodyColor;
		ctx.lineWidth = p.radius / 1.5;

		ctx.moveTo(0, -p.radius * Math.sqrt(3));
		ctx.lineTo(p.radius * Math.sqrt(3) * .48, p.radius / 2 * Math.sqrt(3));
		ctx.lineTo(-p.radius * Math.sqrt(3) * .48, p.radius / 2 * Math.sqrt(3));
		ctx.lineTo(0, -p.radius * Math.sqrt(3));
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
        ctx.rotate(-Math.PI / 2)
    },
    "Bud": (p) => {
        ctx.lineWidth = 3;

        ctx.fillStyle = blendColor('#c02dd6', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#9c24ad', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        for(let i = 5; i--; i>0){
            ctx.beginPath();
            ctx.arc(p.radius * Math.sin(i * 6.28318/5), p.radius * Math.cos(i * 6.28318/5), p.radius*0.8, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();    
        }

        
        ctx.fillStyle = blendColor('#ebac00', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#b38302', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
    },
    
    MissileProjectile: (p) => {
        petalRenderMap.Missile(p);
    },
    "Fire MissileProjectile": (p) => {
        petalRenderMap["Fire Missile"](p);
    },
    BudProjectile: (p) => {
        petalRenderMap.Bud(p);
    },
    
    PeasProjectile: (p) => {
        petalRenderMap.Peas(p);
    },
    GrapesProjectile: (p) => {
        petalRenderMap.Grapes(p);
    },
    PollenProjectile: (p) => {
        petalRenderMap.Pollen(p);
    },
    /*
    PearlProjectile: (p) => {
        petalRenderMap.Pearl(p);
    },
    */
    HoneyProjectile: (p) => {
        petalRenderMap.Honey(p);
    },
    NeutronStarProjectile: (p) => {
        petalRenderMap["Neutron Star"](p);
    },
    
    DandelionProjectile: (p) => {
        petalRenderMap.Dandelion(p);
    },
    RoseProjectile: (p) => {
        petalRenderMap.Rose(p);
    },
    DahliaProjectile: (p) => {
        petalRenderMap.Dahlia(p);
    },
    WebProjectile: (p) => {
        petalRenderMap.Web(p);
    },
    ShellProjectile: (p) => {
        petalRenderMap.Shell(p);
    },
    WebProjectileWeb: (p) => {
        const lastGA = ctx.globalAlpha;
        ctx.globalAlpha *= 0.2;
        ctx.strokeStyle = "white";
        ctx.lineWidth = p.radius / 12;

        // ctx.save();

        // ctx.beginPath();

        // let path = new Path2D();
        // path.rect(-10000, -10000, 20000, 20000);
        // for(let i = 11; i--; i>0){
        //     // ctx.beginPath();
        //     path.moveTo(0, 0)
        //     path.lineTo(p.radius * Math.cos(i / 11 * Math.PI * 2), p.radius * Math.sin(i / 11 * Math.PI * 2))
            
        //     // ctx.stroke();
        //     // ctx.closePath();
		// 	// p.arc(0, 0, e.render.radius, 0, Math.PI * 2);
        // }
        // ctx.clip(path, "evenodd");
        // ctx.clip();
        // ctx.closePath();
        
        ctx.beginPath();
		ctx.moveTo(p.radius*0.95, 0);
		for(let i = 0; i <= Math.PI * 2; i += Math.PI / 5.5){
			ctx.quadraticCurveTo(Math.cos(i - Math.PI / 11) * (p.radius * .75), Math.sin(i - Math.PI / 11) * (p.radius * .75), Math.cos(i) * p.radius * 0.95, Math.sin(i) * p.radius * 0.95);
		}
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
		ctx.moveTo(p.radius*0.75, 0);
		for(let i = 0; i <= Math.PI * 2; i += Math.PI / 5.5){
			ctx.quadraticCurveTo(Math.cos(i - Math.PI / 11) * (p.radius * .55), Math.sin(i - Math.PI / 11) * (p.radius * .55), Math.cos(i) * p.radius * 0.75, Math.sin(i) * p.radius * 0.75);
		}
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
		ctx.moveTo(p.radius*0.55, 0);
		for(let i = 0; i <= Math.PI * 2; i += Math.PI / 5.5){
			ctx.quadraticCurveTo(Math.cos(i - Math.PI / 11) * (p.radius * .35), Math.sin(i - Math.PI / 11) * (p.radius * .35), Math.cos(i) * p.radius * 0.55, Math.sin(i) * p.radius * 0.55);
		}
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
		ctx.moveTo(p.radius*0.35, 0);
		for(let i = 0; i <= Math.PI * 2; i += Math.PI / 5.5){
			ctx.quadraticCurveTo(Math.cos(i - Math.PI / 11) * (p.radius * .15), Math.sin(i - Math.PI / 11) * (p.radius * .15), Math.cos(i) * p.radius * 0.35, Math.sin(i) * p.radius * 0.35);
		}
        ctx.stroke();
        ctx.closePath();

        // ctx.restore();

        for(let i = 11; i--; i>0){
            ctx.beginPath();
            ctx.moveTo(0, 0)
            ctx.lineTo(p.radius * Math.cos(i / 11 * Math.PI * 2), p.radius * Math.sin(i / 11 * Math.PI * 2))
            
            ctx.stroke();
            ctx.closePath();
        }

        ctx.globalAlpha = lastGA;
    },
    Ruby: (p) => {
        /*
        ctx.beginPath();
		ctx.fillStyle = blendColor("#e03f3f", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#a12222", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
		for(let i = 0; i < 5; i++){
			ctx.lineTo(Math.cos(i * 1.256) * p.radius, Math.sin(i * 1.256) * p.radius);
        }
		ctx.fill();
        ctx.lineTo(Math.cos(5 * 1.256) * p.radius, Math.sin(5 * 1.256) * p.radius);
        ctx.stroke();
        ctx.closePath();
		// ctx.beginPath();
		// ctx.fillStyle = blendColor("#777777", '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        // }
		// for(let i = 0; i < 5; i++){
		// 	ctx.lineTo(Math.cos(i * 1.256) * p.radius* 0.65, Math.sin(i * 1.256) * p.radius * 0.65);
		// }
		// ctx.fill();
        // ctx.closePath();
        */
        ctx.beginPath();
        ctx.fillStyle = blendColor("#e03f3f", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#a12222", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if (checkForFirstFrame(p)) {
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
        ctx.rotate(Math.PI / 4)
        for (let i = 0; i <= 3; i++) {
            ctx.lineTo(Math.cos(i * Math.PI * 2 / 3) * p.radius, Math.sin(i * Math.PI * 2 / 3) * p.radius);
        }
        ctx.rotate(-Math.PI / 4)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = blendColor(blendColor("#e03f3f", '#ffffff', 0.3), '#FF0000', blendAmount(p));
        if (checkForFirstFrame(p)) {
            ctx.fillStyle = "#FFFFFF";
        }
        ctx.rotate(Math.PI / 4)
        for (let i = 0; i <= 3; i++) {
            ctx.lineTo(Math.cos(i * Math.PI * 2 / 3) * p.radius * 0.4, Math.sin(i * Math.PI * 2 / 3) * p.radius * 0.4);
        }
        ctx.rotate(-Math.PI / 4)
        ctx.fill();
        ctx.closePath();    
    },
    Sapphire: (p) => {
        /*
        ctx.beginPath();
		ctx.fillStyle = blendColor("#39bfd4", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#2290a1", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
		for(let i = 0; i < 5; i++){
			ctx.lineTo(Math.cos(i * 1.256) * p.radius, Math.sin(i * 1.256) * p.radius);
        }
		ctx.fill();
        ctx.lineTo(Math.cos(5 * 1.256) * p.radius, Math.sin(5 * 1.256) * p.radius);
        ctx.stroke();
        ctx.closePath();
        */
		// ctx.beginPath();
		// ctx.fillStyle = blendColor("#777777", '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        // }
		// for(let i = 0; i < 5; i++){
		// 	ctx.lineTo(Math.cos(i * 1.256) * p.radius* 0.65, Math.sin(i * 1.256) * p.radius * 0.65);
		// }
		// ctx.fill();
        // ctx.closePath();
        
        ctx.beginPath();
        ctx.fillStyle = blendColor("#12a9e7", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#0896d9", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if (checkForFirstFrame(p)) {
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
        ctx.rotate(Math.PI / 4)
        for (let i = 0; i <= 6; i++) {
            ctx.lineTo(Math.cos(i * Math.PI * 2 / 6) * p.radius, Math.sin(i * Math.PI * 2 / 6) * p.radius);
        }
        ctx.rotate(-Math.PI / 4)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = blendColor(blendColor("#12a9e7", '#ffffff', 0.3), '#FF0000', blendAmount(p));
        if (checkForFirstFrame(p)) {
            ctx.fillStyle = "#FFFFFF";
        }
        ctx.rotate(Math.PI / 4)
        for (let i = 0; i <= 6; i++) {
            ctx.lineTo(Math.cos(i * Math.PI * 2 / 6) * p.radius * 0.6, Math.sin(i * Math.PI * 2 / 6) * p.radius * 0.6);
        }
        ctx.rotate(-Math.PI / 4)
        ctx.fill();
        ctx.closePath();

    },
    Emerald: (p) => {
        ctx.beginPath();
        ctx.fillStyle = blendColor("#12e727", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#08c912", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if (checkForFirstFrame(p)) {
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
        ctx.rotate(Math.PI / 4)
        for (let i = 0; i <= 4; i++) {
            ctx.lineTo(Math.cos(i * Math.PI * 2 / 4) * p.radius, Math.sin(i * Math.PI * 2 / 4) * p.radius);
        }
        ctx.rotate(-Math.PI / 4)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = blendColor(blendColor("#12e727", '#ffffff', 0.3), '#FF0000', blendAmount(p));
        if (checkForFirstFrame(p)) {
            ctx.fillStyle = "#FFFFFF";
        }
        ctx.rotate(Math.PI / 4)
        for (let i = 0; i <= 4; i++) {
            ctx.lineTo(Math.cos(i * Math.PI * 2 / 4) * p.radius * 0.6, Math.sin(i * Math.PI * 2 / 4) * p.radius * 0.6);
        }
        ctx.rotate(-Math.PI / 4)
        ctx.fill();
        ctx.closePath();

    },
    
    Rock: (p) => {
        if(p.rarity === 7){
            if(p.image === undefined || p.image.onload === undefined){
                p.image = new Image();
                p.image.src = 'https://memes.co.in/memes/update/uploads/2021/12/InShot_20211209_222013681-1024x1024.jpg';
                p.image.onload = () => {
                    p.imageLoaded = true;
                }
            }
            
            if(p.imageLoaded === true){
                ctx.drawImage(p.image, -p.radius, - p.radius, p.radius * 2, p.radius * 2);
            }
            
            return;
        }
        ctx.beginPath();
		ctx.fillStyle = blendColor("#777777", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#606060", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
		for(let i = 0; i < 5; i++){
			ctx.lineTo(Math.cos(i * 1.256) * p.radius, Math.sin(i * 1.256) * p.radius);
        }
		ctx.fill();
        ctx.lineTo(Math.cos(5 * 1.256) * p.radius, Math.sin(5 * 1.256) * p.radius);
        ctx.stroke();
        ctx.closePath();
		// ctx.beginPath();
		// ctx.fillStyle = blendColor("#777777", '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        // }
		// for(let i = 0; i < 5; i++){
		// 	ctx.lineTo(Math.cos(i * 1.256) * p.radius* 0.65, Math.sin(i * 1.256) * p.radius * 0.65);
		// }
		// ctx.fill();
        // ctx.closePath();
    },
    Ikea: (p) => {
        if(p.image === undefined || p.image.onload === undefined){
            p.image = new Image();
            p.image.src = 'https://archello.com/thumbs/images/2014/02/03/IKEA-Tampines.1506072620.5502.jpg?fit=crop&w=414&h=518';
            p.image.onload = () => {
                p.imageLoaded = true;
            }
        }
        
        if(p.imageLoaded === true){
            ctx.drawImage(p.image, -p.radius * 2, - p.radius * 2, p.radius * 4, p.radius * 4);
        }
    },
    IkeaChair: (p) => {
        if(p.image === undefined || p.image.onload === undefined){
            p.image = new Image();
            p.image.src = 'https://www.ikea.com/us/en/images/products/lisabo-chair-ash__0786549_pe763015_s5.jpg';
            p.image.onload = () => {
                p.imageLoaded = true;
            }
        }
        
        if(p.imageLoaded === true){
            ctx.drawImage(p.image, -p.radius * 1.8, - p.radius * 1.8, p.radius * 3.6, p.radius * 3.6);
        }
    },
    Thomas: (p) => {
        if(p.image === undefined || p.image.onload === undefined){
            p.image = new Image();
            p.image.src = 'https://i.pinimg.com/originals/96/21/65/96216524958973ceffb8b7a2f29c9110.png';
            p.image.onload = () => {
                p.imageLoaded = true;
            }
        }
        
        if(p.imageLoaded === true){
            ctx.drawImage(p.image, -p.radius * 2, - p.radius * 2, p.radius * 4, p.radius * 4);
        }
    },
    ThomasProjectile: (p) => {
        if(window.state !== "game") return;
        if(p.image === undefined || p.image.onload === undefined){
            p.image = new Image();
            p.image.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cac178bd-54d7-48ce-807a-c46f1a058300/dbdwqrf-dd9b7ed2-7f9f-4630-acaf-6afe5d1574c7.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2NhYzE3OGJkLTU0ZDctNDhjZS04MDdhLWM0NmYxYTA1ODMwMFwvZGJkd3FyZi1kZDliN2VkMi03ZjlmLTQ2MzAtYWNhZi02YWZlNWQxNTc0YzcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dv3Wy-zThJiXQnv_L1gKa1UBskTmd6ltcWNnC9rISlI';
            p.image.onload = () => {
                p.imageLoaded = true;
            }
            var audio1 = new Audio("/gfx/thomas.mp3");
            audio1.play();
            setTimeout(()=>{p.dropped = true}, 2700)
        }
        
        if(p.imageLoaded === true && p.dropped === true){
            let rot = 0.7 * Math.cos(Date.now()/90);
            let scal = 0.5 * Math.cos(Date.now()/45);
            ctx.rotate(rot);
            ctx.drawImage(p.image, -p.radius * (1.5 + scal), - p.radius *  (1.5 + scal), p.radius *  2 * (1.5 + scal), p.radius *  2 * (1.5 + scal));
            ctx.rotate(-rot);
        }
    },
    Soil: (p) => {
        ctx.beginPath();
		ctx.fillStyle = blendColor("#695118", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#554213", '#FF0000', blendAmount(p));
        ctx.lineWidth = 6;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
        //1.28, -0.25then 0.88, 0.7 then -0.04, 1.15 then -0.97, 0.71 then -1.23, -0.35 then -0.56, -1.23 then 0.6, -1.12
        ctx.moveTo(p.radius * 1.28, p.radius * -0.25),
        ctx.lineTo(p.radius * 0.88, p.radius * 0.7),
        ctx.lineTo(p.radius * -0.04, p.radius * 1.15),
        ctx.lineTo(p.radius * -0.97, p.radius * 0.71),
        ctx.lineTo(p.radius * -1.23, p.radius * -0.35),
        ctx.lineTo(p.radius * -0.56, p.radius * -1.23),
        ctx.lineTo(p.radius * 0.6, p.radius * -1.12),
        
        ctx.fill();
        ctx.lineTo(p.radius * 1.28, p.radius * -0.25),
        ctx.stroke();
        ctx.closePath();
		// ctx.beginPath();
		// ctx.fillStyle = blendColor("#777777", '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        // }
		// for(let i = 0; i < 5; i++){
		// 	ctx.lineTo(Math.cos(i * 1.256) * p.radius* 0.65, Math.sin(i * 1.256) * p.radius * 0.65);
		// }
		// ctx.fill();
        // ctx.closePath();
    },
    Salt: (p) => {
        ctx.beginPath();
		ctx.fillStyle = blendColor("#ffffff", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#cfcfcf", '#FF0000', blendAmount(p));
        ctx.lineWidth = 3;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
        //1.28, -0.25then 0.88, 0.7 then -0.04, 1.15 then -0.97, 0.71 then -1.23, -0.35 then -0.56, -1.23 then 0.6, -1.12
        ctx.moveTo(p.radius * 1.28, p.radius * -0.25),
        ctx.lineTo(p.radius * 0.88, p.radius * 0.7),
        ctx.lineTo(p.radius * -0.04, p.radius * 1.15),
        ctx.lineTo(p.radius * -0.97, p.radius * 0.71),
        ctx.lineTo(p.radius * -1.23, p.radius * -0.35),
        ctx.lineTo(p.radius * -0.56, p.radius * -1.23),
        ctx.lineTo(p.radius * 0.6, p.radius * -1.12),
        
        ctx.fill();
        ctx.lineTo(p.radius * 1.28, p.radius * -0.25),
        ctx.stroke();
        ctx.closePath();
		// ctx.beginPath();
		// ctx.fillStyle = blendColor("#777777", '#FF0000', blendAmount(p));
        // if(checkForFirstFrame(p)){
        //     ctx.fillStyle = "#FFFFFF";
        // }
		// for(let i = 0; i < 5; i++){
		// 	ctx.lineTo(Math.cos(i * 1.256) * p.radius* 0.65, Math.sin(i * 1.256) * p.radius * 0.65);
		// }
		// ctx.fill();
        // ctx.closePath();
    },
    Powder: (p) => {
        ctx.fillStyle = blendColor("#ffffff", "#FF0000", blendAmount(p))
        ctx.beginPath();
        ctx.arc(p.radius * 0.63, p.radius * -0.63, p.radius * 0.46, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.63, p.radius * 0, p.radius * 0.43, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.45, p.radius * 0.26, p.radius * 0.43, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.34, p.radius * 0.79, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.1, p.radius * 0.4, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.62, p.radius * 0.2, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.71, p.radius * -0.09, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.55, p.radius * -0.74, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.16, p.radius * -0.57, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0, p.radius * -0.5, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(0, 0, p.radius*0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();        
    },
    Leaf: (p) => {
        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#39b54a', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#2e933c', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        // ctx.beginPath();
        // // ctx.rotate(p.offset.angle);
        // ctx.moveTo(p.radius, 0);
        // for(let i = 1; i < 6; i++){
        //     ctx.lineTo(Math.cos(i) * p.radius, Math.sin(i) * p.radius);
        // }
        // ctx.lineTo(p.radius, 0);
        // // ctx.rotate(-p.offset.angle);
        // ctx.fill();
        // ctx.stroke();

        ctx.rotate(Math.PI / 4 - 0.2);
        ctx.beginPath();
        // -.2, -.6 center of leaf

        ctx.moveTo(0, 1.854*p.radius/divCoef);
        
        //bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        ctx.quadraticCurveTo(-2.88*p.radius/divCoef*.87, 0.31*p.radius/divCoef, 0, -2.325*p.radius/divCoef);
        ctx.moveTo(0, 1.854*p.radius/divCoef);
        ctx.quadraticCurveTo(2.88*p.radius/divCoef*.87, 0.31*p.radius/divCoef, 0, -2.325*p.radius/divCoef);

        // tail
        ctx.moveTo(0, 1.948*p.radius/divCoef);
        ctx.lineTo(0, 2.536*p.radius/divCoef);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();

        // curve in the middle
        ctx.moveTo(0, (1.948-1)*p.radius/divCoef);
        ctx.quadraticCurveTo(-0.18*p.radius/divCoef, -0.1885*p.radius/divCoef, 0, (-2.325+1.05)*p.radius/divCoef);

        ctx.stroke();
        ctx.closePath();
        ctx.rotate(-Math.PI / 4 + 0.2);

        // 1: -1.18 -1.065
        // still getting bezier right lol
        // weird stuff
        // 2: 
        
    },
    Yucca: (p) => {
        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#74b53f', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#5e9333', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.lineWidth = p.radius/4.5 * 1.6
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.49 * 1.6, p.radius * -0.77 * 1.6);
        ctx.quadraticCurveTo(p.radius * 0.67 * 1.6, p.radius * 0.37 * 1.6, p.radius * -0.49 * 1.6, p.radius * 0.77 * 1.6)
        ctx.quadraticCurveTo(p.radius * -0.67 * 1.6, p.radius * -0.39 * 1.6, p.radius * 0.49 * 1.6, p.radius * -0.77 * 1.6)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        ctx.lineWidth = p.radius/8 * 1.6;
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.45 * 1.6, p.radius * 0.64 * 1.6);
        ctx.quadraticCurveTo(p.radius * -0.09 * 1.6, p.radius * -0.21 * 1.6, p.radius * 0.48 * 1.6, p.radius * -0.74 * 1.6)
        ctx.stroke();
        ctx.closePath();
      
        
    },
    Pincer: (p) => {
        const divCoef = 1.35;
        ctx.fillStyle = blendColor('#333333', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#292929', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.lineWidth = p.radius/4.5
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.35 * 1.4, p.radius * 0.79 * 1.4);
        ctx.quadraticCurveTo(p.radius * 0.25 * 1.4, p.radius * 0.2 * 1.4, p.radius * -0.85 * 1.4, p.radius * -0.22 * 1.4);
        ctx.quadraticCurveTo(p.radius * 0.93 * 1.4, p.radius * -0.69 * 1.4, p.radius * 0.35 * 1.4, p.radius * 0.79 * 1.4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    "Yin Yang": (p) => {
        let fillColor1 = blendColor('#ffffff', '#FF0000', blendAmount(p));
        let strokeColor1 = blendColor('#cfcfcf', '#FF0000', blendAmount(p));
        let fillColor2 = blendColor('#333333', '#FF0000', blendAmount(p));
        let strokeColor2 = blendColor('#292929', '#FF0000', blendAmount(p));
        
        if(checkForFirstFrame(p)){
            fillColor1 = "#FFFFFF";
            strokeColor1 = "#FFFFFF";
            fillColor2 = "#FFFFFF";
            strokeColor2 = "#FFFFFF";
        }
        
        ctx.lineWidth = p.radius/4.5
        ctx.strokeStyle = strokeColor1
        ctx.fillStyle = fillColor1
        ctx.beginPath();
        ctx.arc(0, 0, p.radius*0.89, Math.PI/2, Math.PI/2 *3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        ctx.strokeStyle = strokeColor2;
        ctx.fillStyle = fillColor2;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius*0.89, 3*Math.PI/2, Math.PI/2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        ctx.beginPath();
        ctx.arc(0.5, p.radius * 0.445, p.radius*0.445, Math.PI/2, Math.PI/2*3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        ctx.strokeStyle = strokeColor1;
        ctx.fillStyle = fillColor1;
        ctx.beginPath();
        ctx.arc(-0.5, -p.radius * 0.44, p.radius*0.445, Math.PI/2*3, Math.PI/2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
    },
    "Rose": (p) => {
        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#ff94c9', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cf78a3', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        if (p.rarity == 12){
            ctx.lineWidth = p.radius;
            ctx.beginPath();
            for(let i = 0; i < 4; i++){
                ctx.lineTo(Math.cos(i * 2.09439510239) * p.radius*0.9, Math.sin(i * 2.09439510239) * p.radius*0.9);
            }
            ctx.stroke();
            ctx.closePath();
            
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = p.radius*0.6;
            ctx.beginPath();
            for(let i = 0; i < 4; i++){
                ctx.lineTo(Math.cos(i * 2.09439510239) * p.radius*0.6, Math.sin(i * 2.09439510239) * p.radius*0.6);
            }
            ctx.stroke();
            ctx.closePath();
        }
        else{
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        
    },
    "Trident": (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#25dbe8', '#FF0000', blendAmount(p));
        if (p.rarity == 5){
            ctx.fillStyle = blendColor('#24529c', '#FF0000', blendAmount(p));
        }
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
        }
        
        //Shaft
        ctx.beginPath();
        ctx.moveTo(p.radius * -0.15, p.radius * 1.4);
        ctx.lineTo(p.radius * 0.15, p.radius * 1.4);
        ctx.lineTo(p.radius * 0.15, p.radius * -0.6);
        ctx.lineTo(p.radius * -0.15, p.radius * -0.6);
        ctx.fill()
        ctx.closePath();

        //Top Arrow
        ctx.beginPath();
        ctx.moveTo(p.radius * 0.35, p.radius * -0.6);
        ctx.lineTo(p.radius * -0.35, p.radius * -0.6);
        ctx.lineTo(p.radius * 0, p.radius * -1.2);
        ctx.fill()
        ctx.closePath();

        //Right bottom
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.15, p.radius * 0.75);
        ctx.quadraticCurveTo(p.radius * 0.35, p.radius * 0.72, p.radius * 0.62, p.radius * 0.81);
        ctx.lineTo(p.radius * 0.42, p.radius * 0.5);
        ctx.lineTo(p.radius * 0.15, p.radius * 0.5);
        ctx.fill()
        ctx.closePath();

        //Right right
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.62, p.radius * 0.81)
        ctx.quadraticCurveTo(p.radius * 0.66, p.radius * -0.12, p.radius * 1.22, p.radius * -0.84);
        ctx.lineTo(p.radius * 0.71, p.radius * -0.5)
        ctx.quadraticCurveTo(p.radius * 0.5, p.radius * -0.26, p.radius * 0.42, p.radius * 0.5)
        ctx.fill();
        ctx.closePath();

        //Right top
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.71, p.radius * -0.5)
        ctx.lineTo(p.radius * 0.56, p.radius * -0.54)
        ctx.quadraticCurveTo(p.radius * 0.84, p.radius * -0.81, p.radius * 1.22, p.radius * -0.84)
        ctx.fill();
        ctx.closePath();

        //Left bottom
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.15, p.radius * 0.75);
        ctx.quadraticCurveTo(p.radius * -0.35, p.radius * 0.72, p.radius * -0.62, p.radius * 0.81);
        ctx.lineTo(p.radius * -0.42, p.radius * 0.5);
        ctx.lineTo(p.radius * -0.15, p.radius * 0.5);
        ctx.fill()
        ctx.closePath();

        //Left right
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.62, p.radius * 0.81)
        ctx.quadraticCurveTo(p.radius * -0.66, p.radius * -0.12, p.radius * -1.22, p.radius * -0.84);
        ctx.lineTo(p.radius * -0.71, p.radius * -0.5)
        ctx.quadraticCurveTo(p.radius * -0.5, p.radius * -0.26, p.radius * -0.42, p.radius * 0.5)
        ctx.fill();
        ctx.closePath();

        //Left top
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.71, p.radius * -0.5)
        ctx.lineTo(p.radius * -0.56, p.radius * -0.54)
        ctx.quadraticCurveTo(p.radius * -0.84, p.radius * -0.81, p.radius * -1.22, p.radius * -0.84)
        ctx.fill();
        ctx.closePath();
    },
    "Dahlia": (p) => {
        const divCoef = 1;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#ff94c9', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cf78a3', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
    },
    
    "Corn": (p) => {
        ctx.lineWidth = p.radius*0.65
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#ffe419', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfb914', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.lineTo(p.radius * -0.159, p.radius * 1.122);
        ctx.quadraticCurveTo(-p.radius * 0.16, p.radius * 0.17, p.radius * -1.085, p.radius * 0.342);
        ctx.quadraticCurveTo(p.radius * -0.76, p.radius * -1.91, p.radius * 0.63, p.radius * -0.74);
        ctx.quadraticCurveTo(p.radius * 2, p.radius * 0.43, p.radius * -0.159, p.radius * 1.122);
        
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        
    },
    "Token": (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ffcb21', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#c79b0c', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = `hsl(${Date.now()/2.5 % 360}, 50%, 50%)`;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius / 2.5, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

    },
    "Bone": (p) => {
        // ctx.beginPath();
        let fill = blendColor('#ffffff', '#FF0000', blendAmount(p));
        let stroke = blendColor('#cdcdcd', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            fill = "#FFFFFF";
            stroke = "#FFFFFF";
        }
        
        ctx.fillStyle = stroke;
        ctx.lineWidth = p.radius/6
        ctx.beginPath();
        ctx.arc(p.radius * 0.33, p.radius * 0.93, p.radius * 0.39, -Math.PI * 0.1, Math.PI * 1.05);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.7, p.radius * 0.69, p.radius * 0.39, -Math.PI*0.45, Math.PI * 0.6);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.7, p.radius * -0.67, p.radius * 0.39, Math.PI*0.69, Math.PI * 1.8);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.32, p.radius * -0.91, p.radius * 0.39, Math.PI * 0.95, 0.1);
        ctx.fill();
        ctx.closePath();
        
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.radius * 0.33, p.radius * 0.93, p.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.7, p.radius * 0.69, p.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.7, p.radius * -0.67, p.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.32, p.radius * -0.91, p.radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.035, p.radius * 0.86);
        ctx.quadraticCurveTo(p.radius * -0.03, p.radius * 0.07, p.radius * -0.86, p.radius * -0.41)
        ctx.lineTo(p.radius * -0.5, p.radius * -0.78);
        ctx.lineTo(p.radius * -0.02, p.radius * -0.86);
        ctx.quadraticCurveTo(p.radius * 0.03, p.radius * -0.07, p.radius * 0.8, p.radius * 0.42)
        ctx.lineTo(p.radius * 0.51, p.radius * 0.789);
        ctx.fill();
        ctx.closePath();
      
        ctx.beginPath();
        ctx.lineTo(p.radius * 0.035, p.radius * 0.86);
        ctx.quadraticCurveTo(p.radius * -0.03, p.radius * 0.07, p.radius * -0.86, p.radius * -0.41)
        ctx.moveTo(p.radius * 0.8, p.radius * 0.42);
        ctx.quadraticCurveTo(p.radius * 0.03, p.radius * -0.07, p.radius * -0.02, p.radius * -0.86)
        ctx.stroke()
        ctx.closePath();
      
        
    },
    "Wing": (p) => {
        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/1.9//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#ffffff', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cdcdcd', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius*1.01, -Math.PI * 0.18, Math.PI * 0.818);
        ctx.arcTo(p.radius * 0.42, p.radius * 0.6, p.radius*0.85, -p.radius * 0.53, p.radius * 1.7);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    },
    "Oranges": (p) => {
        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/2.2//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#f0bd48', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#c2993a', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = blendColor('#39b54a', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#2e933c', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.lineWidth = p.radius/3.4;
        ctx.beginPath();
        ctx.moveTo(p.radius * 0.61, p.radius * 0.13)
        ctx.quadraticCurveTo(p.radius * 0.92, p.radius * 0.51, p.radius * 0.3, p.radius * 1.09)
        ctx.quadraticCurveTo(p.radius*0.08, p.radius*0.18, p.radius * 0.61, p.radius * 0.13)
        ctx.stroke();
        ctx.fill();
    },
    "Neutron Star": (p) => {

        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.strokeStyle = blendColor('#0f0742', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        for(let i = 7; i--; i>0){
            ctx.lineTo(Math.cos(i * Math.PI/3 + p.angle/5) * p.radius, Math.sin(i * Math.PI/3 + p.angle/5) * p.radius * 2/3)
        }
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = blendColor('#3c115c', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        for(let i = 7; i--; i>0){
            ctx.lineTo(Math.cos(i * Math.PI/3 + Math.PI/6 - p.angle/5) * p.radius * 2/3, Math.sin(i * Math.PI/3 + Math.PI/6 - p.angle/5) * p.radius)
        }
        ctx.stroke();
        ctx.closePath();

    },
    "Honey": (p) => {
        const divCoef = 1.35;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#f7cf2f', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#c8a826', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        for(let i = 7; i--; i>0){
            ctx.lineTo(Math.cos(i * Math.PI/3) * p.radius, Math.sin(i * Math.PI/3) * p.radius)
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
    },
    "Peas": (p) => {
        const divCoef = 1;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#8ac255', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#709d45', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
    },
    "Grapes": (p) => {
        const divCoef = 1;

        ctx.lineWidth = p.radius/divCoef/2.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#ce76db', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#a760b1', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        
    },
    "Cactus": (p) => {
        if(p.rarity === 6){
            if(p.image === undefined || p.image.onload === undefined){
                p.image = new Image();
                p.image.src = './gfx/deteled.png';
                p.image.onload = () => {
                    p.imageLoaded = true;
                }
            }
            
            if(p.imageLoaded === true){
                ctx.drawImage(p.image, -p.radius * 1.1, - p.radius * 1.1, p.radius * 2.2, p.radius * 2.2);
            }
            
            return;
        }

        const divCoef = 1;

        ctx.lineWidth = p.radius/divCoef/5.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#38c75f', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#2da14d', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.beginPath();
		ctx.moveTo(p.radius, 0);
		for(let i = 0; i <= Math.PI * 2; i += Math.PI / 4){
			ctx.quadraticCurveTo(Math.cos(i - Math.PI / 8) * (p.radius * .7), Math.sin(i - Math.PI / 8) * (p.radius * .7), Math.cos(i) * p.radius, Math.sin(i) * p.radius);
		}
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = blendColor('#74d68f', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
        }
        ctx.beginPath();
        ctx.arc(0, 0, p.radius/2, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        
    },
    "Dandelion": (p) => {
        ctx.strokeStyle = "black";
		ctx.lineWidth = p.radius / 1.39;

		//ctx.rotate(p.offset.angle);
		ctx.beginPath();
		ctx.moveTo(-p.radius * 1.59, 0);
		ctx.lineTo(0, 0);
		ctx.stroke();
		ctx.closePath();
		//ctx.rotate(-p.offset.angle);

		ctx.lineWidth = p.radius / 4;

		ctx.fillStyle = blendColor('#ffffff', "#FF0000", blendAmount(p));
		ctx.strokeStyle = blendColor('#cfcfcf', "#FF0000", blendAmount(p));
		if (checkForFirstFrame(p)) {
			ctx.fillStyle = "#ffffff"; //"#FFFFFF";
			ctx.strokeStyle = "#ffffff" //'#cecece';//blendColor("#FFFFFF", "#000000", 0.19);
		}

		ctx.beginPath();
		ctx.arc(0, 0, p.radius * 9 / 10, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
    },
    Egg: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#fff0b8', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfc295', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius*1.35, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    "Jellyfish Egg": (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ffffff', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#b8b8b8', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.globalAlpha *= 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius*1.35, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius*1.35, 0, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();


        ctx.globalAlpha *= 0.7;
        ctx.beginPath();
        ctx.arc(p.radius * 0.31, p.radius * 0.5, p.radius * 0.33, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.53, p.radius * 0.25, p.radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * -0.34, p.radius * -0.29, p.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(p.radius * 0.33, p.radius * -0.21, p.radius * 0.165, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(0, p.radius * -0.7, p.radius * 0.164, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha *= 1/0.7;

    },
    
    "Plastic Egg": (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#4b89db', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#3563a1', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius, p.radius*1.35, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    "Mini Flower": (p) => {
        ctx.lineWidth = 3;
        if(p.flowerRender === undefined || p.flowerRender.drawFlower === undefined) {
            p.flowerRender = new Flower(1);
        }
        const self = room.flowers[window.selfId];
        if(self){
            p.flowerRender.render.petalDistance = self.render.petalDistance;
            p.flowerRender.render.fastPetalDistance = self.render.fastPetalDistance;
            p.flowerRender.render.radius = p.radius;
            p.flowerRender.radius = p.radius;
        }
        p.flowerRender.drawFlower(0, 0, p.radius);
    },
    "Web": (p) => {
        const divCoef = 1;

        ctx.lineWidth = p.radius/divCoef/5.5//2.2;
        // ctx.beginPath();
        ctx.fillStyle = blendColor('#ffffff', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfcfcf', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.beginPath();
		ctx.moveTo(p.radius, 0);
		for(let i = 0; i <= Math.PI * 2; i += Math.PI * 2/5){
			ctx.quadraticCurveTo(Math.cos(i - Math.PI * 1/5) * (p.radius * .6), Math.sin(i - Math.PI / 5) * (p.radius * .6), Math.cos(i) * p.radius, Math.sin(i) * p.radius);
		}
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        
    },
    Pollen: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ffe763', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#cfbb50', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    },
    Magnet: (p) => {
        ctx.fillStyle = blendColor('#a44343', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#853636', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }

        ctx.lineWidth = p.radius / 6;
        ctx.lineCap = "butt";
        ctx.beginPath();
        ctx.moveTo(p.radius * -0.25, p.radius * 0.38);
        ctx.quadraticCurveTo(p.radius * -0.47, p.radius * 0.22, p.radius * -0.42, p.radius * 0.08)
        ctx.quadraticCurveTo(p.radius * -0.28, p.radius * -0.25, p.radius * 0.05, p.radius * -0.48);
        ctx.quadraticCurveTo(p.radius * 0.32, p.radius * -1.12, p.radius * -0.39, p.radius * -1.05)
        ctx.quadraticCurveTo(p.radius * -1.78, p.radius * 0.1, p.radius * -0.66, p.radius * 0.96)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        ctx.fillStyle = blendColor('#4343a4', '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor('#363685', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
        }
        ctx.beginPath();
        ctx.moveTo(p.radius * -0.68, p.radius * 0.95);
        ctx.quadraticCurveTo(p.radius * 0.65, p.radius * 1.65, p.radius * 1.1, p.radius * -0.06);
        ctx.quadraticCurveTo(p.radius * 0.9, p.radius * -0.75, p.radius * 0.4, p.radius * -0.24);
        ctx.quadraticCurveTo(p.radius * 0.18, p.radius * 0.7, p.radius * -0.25, p.radius * 0.38);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.lineCap = "round";
    },
    Stick: (p) => {
        ctx.beginPath();
		let innerColor = blendColor("#7d5b1f", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#654a19", '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            innerColor = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }

        ctx.lineWidth = p.radius*0.75

        ctx.beginPath();
        ctx.moveTo(p.radius * -0.90, p.radius * 0.58);
        ctx.lineTo(p.radius * 0.01, p.radius * 0);
        ctx.lineTo(p.radius * 0.56, p.radius * -1.14);
        ctx.moveTo(p.radius * 0.01, p.radius * 0);
        ctx.lineTo(p.radius * 0.88, p.radius * -0.06);
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = p.radius*0.35
        ctx.strokeStyle = innerColor;
        ctx.beginPath();
        ctx.moveTo(p.radius * -0.90, p.radius * 0.58);
        ctx.lineTo(p.radius * 0.01, p.radius * 0);
        ctx.lineTo(p.radius * 0.56, p.radius * -1.14);
        ctx.moveTo(p.radius * 0.01, p.radius * 0);
        ctx.lineTo(p.radius * 0.88, p.radius * -0.06);
        ctx.stroke();
        ctx.closePath();
      
    },
    Square: (p) => {
        ctx.beginPath();
		ctx.fillStyle = blendColor("#ffe869", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#cfbc55", '#FF0000', blendAmount(p));
        ctx.lineWidth = 2;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
		for(let i = 0; i < 4; i++){
			ctx.lineTo(Math.cos(i * 1.57079) * p.radius, Math.sin(i * 1.57079) * p.radius);
        }
		ctx.fill();
        ctx.lineTo(Math.cos(4 * 1.57079) * p.radius, Math.sin(4 * 1.57079) * p.radius);
        ctx.stroke();
        ctx.closePath();
    },
    Pentagon: (p) => {
        ctx.beginPath();
		ctx.fillStyle = blendColor("#768dfc", '#FF0000', blendAmount(p));
        ctx.strokeStyle = blendColor("#586bbd", '#FF0000', blendAmount(p));
        ctx.lineWidth = 2;
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF"
        }
		for(let i = 0; i < 5; i++){
			ctx.lineTo(Math.cos(i * 1.256632) * p.radius, Math.sin(i * 1.256632) * p.radius);
        }
		ctx.fill();
        ctx.lineTo(Math.cos(5 * 1.256632) * p.radius, Math.sin(5 * 1.256632) * p.radius);
        ctx.stroke();
        ctx.closePath();
    },
    Card: (p) => {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.fillStyle = blendColor('#ffffff', '#FF0000', blendAmount(p));
        let border = ctx.strokeStyle = blendColor('#cfcfcf', '#FF0000', blendAmount(p));
        let stripe = blendColor('#202020', '#FF0000', blendAmount(p));
        if(checkForFirstFrame(p)){
            ctx.fillStyle = "#FFFFFF"; 
            ctx.strokeStyle = "#FFFFFF";
            stripe = "#FFFFFF";
            border = "#FFFFFF";
        }
        ctx.beginPath();
        ctx.roundRect(-p.radius * 1.2, -p.radius * 0.8, p.radius * 2.4, p.radius * 1.6, p.radius / 4);
        ctx.fill();
        ctx.closePath();

        ctx.strokeStyle = stripe;

        ctx.beginPath();
        ctx.moveTo(-p.radius * 1.1, p.radius * 0.35);
        ctx.lineTo(p.radius * 1.1, p.radius * 0.35);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = border ;
        ctx.beginPath();
        ctx.roundRect(-p.radius * 1.2, -p.radius * 0.8, p.radius * 2.4, p.radius * 1.6, p.radius / 4);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = blendColor('#d4af37', '#FF0000', blendAmount(p));
        ctx.beginPath();
        ctx.roundRect(-p.radius * 0.9, -p.radius * 0.45, p.radius * 0.8, p.radius * 0.5, p.radius / 4);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = blendColor('#FF9500', '#FF0000', blendAmount(p));
        ctx.beginPath();
        ctx.arc(p.radius * 0.4, -p.radius * 0.2, p.radius / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = blendColor('#FF1500', '#FF0000', blendAmount(p));
        ctx.beginPath();
        ctx.arc(p.radius * 0.7, -p.radius * 0.2, p.radius / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();


    },
    Custom: (p, ...params) => {
        if(petalRenderMap[p.customType] !== undefined){
            petalRenderMap[p.customType](p, ...params);
            return;
        }
        const shapes = editorPetalShapesMap[p.customType];
		if(shapes === undefined && Math.random() > 0.05){
            console.warn('path undefined for petal type ' + p.customType);
            return;
        }
        const lastGA = (p.dying === true && p.insidePetalContainer !== true) ? 1 : ctx.globalAlpha;
        ctx.fillOpacity = 1;
        ctx.strokeOpacity = 1;
        ctx.lineWidth = .3;
		ctx.save();
		ctx.scale(p.radius, p.radius);
        let blendAmt = blendAmount(p);
		if(checkForFirstFrame(p)){
			window.overrideBlendColor = [1, "#FFFFFF"];
		} else if(blendAmt > 0){
			window.overrideBlendColor = [blendAmt, "#FF0000"];
		} else {
			window.overrideBlendColor = undefined;
		}
        ctx.setGlobalAlpha(ctx.globalAlpha);
        ctx.setFillStyle('#FFFFFF');
        ctx.setStrokeStyle('#cfcfcf');
		for(let i = 0; i < shapes.length; i++){
            ctx.beginPath();
			for(let j = 0; j < shapes[i].length; j++){
				ctx[shapes[i][j][0]](...shapes[i][j].slice(1));
			}
            ctx.setGlobalAlpha(ctx.fillOpacity * lastGA);
            ctx.fill();
            ctx.setGlobalAlpha(ctx.strokeOpacity * lastGA);
            ctx.stroke();
            ctx.closePath();
            ctx.setGlobalAlpha(lastGA, true);
		}
		ctx.restore();

        // if there's nothing rendering
        if(shapes.length === 1 && shapes[0].length === 0){
            petalRenderMap.Basic(p);
        }
    }
}
