const paddingRatio = 0.25;// ratio of padding to petal width

let savedPetals = localStorage.getItem("savedPetals");
try {
    savedPetals = JSON.parse(savedPetals);
} catch(e) {
    savedPetals = false;
}

// savedPetals: {top: {0: {type, rarity}, 1: {type, rarity}}, bottom: {...}}

class Inventory {
    constructor(amountPerRow){
        this.topPetalSlots = [];
        this.bottomPetalSlots = [];
        for(let i = 0; i < amountPerRow; i++){
            this.topPetalSlots.push(new PetalSlot({x: 0, y: 0, size: 65}));
            this.bottomPetalSlots.push(new PetalSlot({x: 0, y: 0, size: 55}));
        }
        this.positionPetalSlots();

        this.topPetalContainers = {};// key in this case will be the coords of the petal slot its currently in
        this.bottomPetalContainers = {};

        this.translateY = 0;

        try {
            if(savedPetals){
                for(let key in savedPetals.top){
                    const pc = savedPetals.top[key];
                    this.addPetalContainer(new PetalContainer(pc.petals.map(p => new Petal(p)), {...pc}, Math.random(), 1), true, key);
                    pc.render.x = canvas.w;
                    pc.render.y = canvas.h * 2/3;
                }
                for(let key in savedPetals.bottom){
                    const pc = savedPetals.bottom[key];
                    this.addPetalContainer(new PetalContainer(pc.petals.map(p => new Petal(p)), {...pc}, Math.random(), 1), false, key);
                    pc.render.x = canvas.w;
                    pc.render.y = canvas.h * 2/3;
                }
            }
        } catch(e){
            console.log('ERROR');
            console.log(savedPetals);
            localStorage.removeItem("savedPetals");
        }
        
        this.fadingPetalContainer = null;
    }
    initChangePetalsQueue(){
        if(this === menuInventory){
            this.changePetalsQueueInterval = setInterval(() => {
                if(this.queuedChangedPetals !== undefined && window.state === 'menu' && window.connected === true){
                    send({changePetals: true, ...this.queuedChangedPetals});
                    delete this.queuedChangedPetals;
                }
            }, 1200)
        }
    }
    sendQueuedChangedPetalsImmediately(){
        send({changePetals: true, ...this.pack()});
        // doesnt work :(... will need to find a workaround
        // squadUI.updateSelfFlowerPetals({top: this.topPetalContainers, bottom: this.bottomPetalContainers});
    }
    setPetalSlotsNumber(num){
        localStorage.setItem("savedSlotAmount", num);

        for(let i = this.topPetalSlots.length; i < num; i++){
            this.topPetalSlots.push(new PetalSlot({x: 0, y: 0, size: 65}));
            this.bottomPetalSlots.push(new PetalSlot({x: 0, y: 0, size: 55}));
        }

        // this.topPetalSlots.length = num;
        // this.bottomPetalSlots.length = num;

        for(let key in this.bottomPetalContainers){
            if(key > num-1){
                delete this.bottomPetalContainers[key];
                continue;
            }
        }

        for(let key in this.topPetalContainers){
            if(key > num-1){
                delete this.topPetalContainers[key];
                continue;
            }
        }

        this.positionPetalSlots();
    }
    copy(otherInventory){
        this.topPetalContainers = otherInventory.topPetalContainers;
        this.bottomPetalContainers = otherInventory.bottomPetalContainers;
    }
    // pack(){
    //     return this.topPetalContainers.map(p => {return {rarity: p.rarity, type: p.type}});
    // }
    positionPetalSlots(){
        const topPetalSlotSize = this.topPetalSlots[0].size;// global size for all petal slots
        const bottomPetalSlotSize = this.bottomPetalSlots[0].size;
        
        const totalTopSize = this.topPetalSlots.length * topPetalSlotSize/*they're all the same size*/ + (this.topPetalSlots.length-1) * paddingRatio * topPetalSlotSize;
        for(let i = 0; i < this.topPetalSlots.length; i++){
            this.topPetalSlots[i].x = canvas.w/2 - (totalTopSize - topPetalSlotSize)/2 + i * (topPetalSlotSize + paddingRatio * topPetalSlotSize);
            this.topPetalSlots[i].y = canvas.h - bottomPetalSlotSize - bottomPetalSlotSize * paddingRatio - topPetalSlotSize * paddingRatio - topPetalSlotSize / 2;
        }

        const totalBottomSize = this.bottomPetalSlots.length * bottomPetalSlotSize/*they're all the same size*/ + (this.bottomPetalSlots.length-1) * paddingRatio * bottomPetalSlotSize;
        for(let i = 0; i < this.bottomPetalSlots.length; i++){
            this.bottomPetalSlots[i].x = canvas.w/2 - (totalBottomSize - bottomPetalSlotSize)/2 + i * (bottomPetalSlotSize + paddingRatio * bottomPetalSlotSize);
            this.bottomPetalSlots[i].y = canvas.h - bottomPetalSlotSize * paddingRatio - bottomPetalSlotSize / 2;
        }

        for(let key in this.topPetalContainers){
            const petalSlot = this.topPetalSlots[key];
            if(petalSlot === undefined)continue;
            this.topPetalContainers[key].x = petalSlot.x;
            this.topPetalContainers[key].y = petalSlot.y;
            this.topPetalContainers[key].w = petalSlot.size;
            this.topPetalContainers[key].h = petalSlot.size;
        }

        for(let key in this.bottomPetalContainers){
            const petalSlot = this.bottomPetalSlots[key];
            if(petalSlot === undefined)continue;
            this.bottomPetalContainers[key].x = petalSlot.x;
            this.bottomPetalContainers[key].y = petalSlot.y;
            this.bottomPetalContainers[key].w = petalSlot.size;
            this.bottomPetalContainers[key].h = petalSlot.size;
        }
    }
    addPetalContainer(p, isTop, position, toFade=true){
        // where it will be translated in render
        // (we want to negate this so that it appears to come from the same place)
        // (to be used later at p.render.y -= this.translateY)

        if(isTop){
            if(this.topPetalContainers[position] !== undefined){
                this.topPetalContainers[position].w = 65;
                this.topPetalContainers[position].h = 65;
                this.topPetalContainers[position].render.y += this.translateY;
                if(toFade){
                    this.fadingPetalContainer = this.topPetalContainers[position];
                    this.fadingPetalContainer.fadeTime = time;
                    globalInventory.addPetalContainer(this.topPetalContainers[position]);
                }
            }
            this.topPetalContainers[position] = p;
        } else {
            if(this.bottomPetalContainers[position] !== undefined){
                this.bottomPetalContainers[position].w = 65;
                this.bottomPetalContainers[position].h = 65;
                this.bottomPetalContainers[position].render.y += this.translateY;
                if(toFade){
                    this.fadingPetalContainer = this.bottomPetalContainers[position];
                    this.fadingPetalContainer.fadeTime = time;
                    globalInventory.addPetalContainer(this.bottomPetalContainers[position]);
                }
            }
            this.bottomPetalContainers[position] = p;
        }
        this.positionPetalSlots();

        p.render.y -= this.translateY;
        // ctx.translate(0, this.translateY)

        this.updateSavedPetals();
    }
    addInFirstAvailableSlot(p){
        for(let i = 0; i < this.topPetalSlots.length; i++){
            if(this.topPetalContainers[i] === undefined){
                this.addPetalContainer(p, true, i, true);
                return true;
            }
        }
        for(let i = 0; i < this.bottomPetalSlots.length; i++){
            if(this.bottomPetalContainers[i] === undefined){
                this.addPetalContainer(p, false, i, true);
                return true;
            }
        }
        return false;
    }
    getClosest(p){
        const rectA = {
            x: p.x,
            y: p.y,
            difference: {
                x: p.w/2,
                y: p.h/2
            }
        }

        for(let i = 0; i < this.topPetalSlots.length; i++){
            if(p.lastPetalSlot !== undefined){
                if(p.lastPetalSlot.top === true && p.lastPetalSlot.index == i){ //{index: 0, top: true}
                    continue;
                }
            }
            
            const pc = this.topPetalSlots[i];
            const rectB = {
                x: pc.x,
                y: pc.y + this.translateY,
                difference: {
                    x: pc.size,
                    y: pc.size
                }
            }

            if(this.intersectingRect(rectA, rectB) === true){
                return pc;
            }
        }

        for(let i = 0; i < this.bottomPetalSlots.length; i++){
            if(p.lastPetalSlot !== undefined){
                if(p.lastPetalSlot.top === false && p.lastPetalSlot.index == i){ //{index: 0, top: true}
                    continue;
                }
            }

            const pc = this.bottomPetalSlots[i];
            const rectB = {
                x: pc.x,
                y: pc.y + this.translateY,
                difference: {
                    x: pc.size,
                    y: pc.size
                }
            }

            if(this.intersectingRect(rectA, rectB) === true){
                return pc;
            }
        }
        
        return false;
    }
    addClosest(p, globalInv){
        const rectA = {
            x: p.x,
            y: p.y,
            difference: {
                x: p.w/2,
                y: p.h/2
            }
        }

        for(let i = 0; i < this.topPetalSlots.length; i++){
            const pc = this.topPetalSlots[i];
            const rectB = {
                x: pc.x,
                y: pc.y + this.translateY,
                difference: {
                    x: pc.size,
                    y: pc.size
                }
            }

            if(this.intersectingRect(rectA, rectB) === true){
                if(p.lastPetalSlot !== undefined && p.lastPetalSlot.index !== -1){
                    let swappingPetalContainer = this.topPetalContainers[i];
                    if(swappingPetalContainer === undefined){
                        // if no other petal exists then just function as normal
                        this.addPetalContainer(p, true, i);
                        return true;
                    }
                    
                    // otherwise swap petals
                    this.addPetalContainer(p, true, i, false);
                    this.addPetalContainer(swappingPetalContainer, p.lastPetalSlot.top, p.lastPetalSlot.index, false);
                    return true;
                }
                // TODO: make petal go back into inventory if one already exists
                this.addPetalContainer(p, true, i);
                return true;
            }
        }

        for(let i = 0; i < this.bottomPetalSlots.length; i++){
            const pc = this.bottomPetalSlots[i];
            const rectB = {
                x: pc.x,
                y: pc.y + this.translateY,
                difference: {
                    x: pc.size,
                    y: pc.size
                }
            }

            if(this.intersectingRect(rectA, rectB) === true){
                if(p.lastPetalSlot !== undefined && p.lastPetalSlot.index !== -1){
                    let swappingPetalContainer = this.bottomPetalContainers[i];
                    if(swappingPetalContainer === undefined){
                        // if no other petal exists then just function as normal
                        this.addPetalContainer(p, false, i);
                        return true;
                    }
                    
                    // otherwise swap petals
                    this.addPetalContainer(p, false, i, false);
                    this.addPetalContainer(swappingPetalContainer, p.lastPetalSlot.top, p.lastPetalSlot.index, false);
                    return true;
                }
                this.addPetalContainer(p, false, i);
                return true;
            }
        }
        
        return false;
    }
    intersectingRect(obj1, obj2){
        if(obj1.x - obj1.difference.x/2 > obj2.x + obj2.difference.x/2 || obj1.x + obj1.difference.x/2 < obj2.x - obj2.difference.x/2) return false;
        if(obj1.y - obj1.difference.y/2 > obj2.y + obj2.difference.y/2 || obj1.y + obj1.difference.y/2 < obj2.y - obj2.difference.y/2) return false;
        return true;
    }
    removePetalContainer(isBottom, key){
        if(isBottom === true){
            if(this.bottomPetalContainers[key].amount > 1){
                this.bottomPetalContainers[key].amount--;
                this.bottomPetalContainers[key].y -= this.translateY;
                this.bottomPetalContainers[key].w = 50;
                this.bottomPetalContainers[key].h = 50;
            } else {
                delete this.bottomPetalContainers[key];
            }
        } else {
            if(this.topPetalContainers[key].amount > 1){
                this.topPetalContainers[key].amount--;
                this.topPetalContainers[key].y -= this.translateY;
                this.topPetalContainers[key].w = 50;
                this.topPetalContainers[key].h = 50;
            } else {
                delete this.topPetalContainers[key];
            }
        }
        // this.petalContainers[p.rarity] = this.petalContainers[p.rarity].filter(p2 => p2 !== p);

        this.updateSavedPetals();
    }
    clear() {
        this.topPetalContainers = {};// key in this case will be the coords of the petal slot its currently in
        this.bottomPetalContainers = {};
    }
    mouseDown({mouseX, mouseY}, inv){
        if(window.state !== 'menu'){
            if(window.state == 'game'){
                for(let key in this.topPetalContainers){
                    const pc = this.topPetalContainers[key];
                    if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && mouseY > pc.y - pc.h/2 && mouseY < pc.y + pc.h/2){
                        this.swapPetals(parseInt(key));
                        return;
                    }
                }
                for(let key in this.bottomPetalContainers){
                    const pc = this.bottomPetalContainers[key];
                    if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && mouseY > pc.y - pc.h/2 && mouseY < pc.y + pc.h/2){
                        this.swapPetals(parseInt(key));
                        return;
                    }
                }
            }
            return;
        }
        const offsetMouseY = mouseY - this.translateY;
        // for(let key in this.bottomPetalContainers){
        //     const pc = this.bottomPetalContainers[key];

        //     // if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
        //         draggingPetalContainer = new PetalContainer(pc.petals, {...pc}, Math.random(), 1);
        //         this.removePetalContainer(true, key);
        //         return;
        //     // }
        // }
        for(let key in this.topPetalContainers){
            const pc = this.topPetalContainers[key];

            if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
                draggingPetalContainer = new PetalContainer(pc.petals, {...pc, isDragging: true, lastSlot: {top: true, index: key}}, Math.random(), 1);
                draggingPetalContainer.mouseOffset = {
                    x: draggingPetalContainer.x - mouseX,
                    y: draggingPetalContainer.y - offsetMouseY
                }
                draggingPetalContainer.render.y += this.translateY;
                draggingPetalContainer.y += this.translateY;
                draggingPetalContainer.w = 85;
                draggingPetalContainer.h = 85;
                draggingPetalContainer.spawnAnimation = 1;
                this.removePetalContainer(false, key);
                return;
            }
        }

        for(let key in this.bottomPetalContainers){
            const pc = this.bottomPetalContainers[key];

            if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
                draggingPetalContainer = new PetalContainer(pc.petals, {...pc, isDragging: true, lastSlot: {top: false, index: key}}, Math.random(), 1);
                draggingPetalContainer.mouseOffset = {
                    x: draggingPetalContainer.x - mouseX,
                    y: draggingPetalContainer.y - offsetMouseY
                }
                draggingPetalContainer.render.y += this.translateY;
                draggingPetalContainer.y += this.translateY;
                draggingPetalContainer.w = 85;
                draggingPetalContainer.h = 85;
                draggingPetalContainer.spawnAnimation = 1;
                this.removePetalContainer(true, key);
                return;
            }
        }
        // if(this.petalContainers[i] === undefined){
        //     continue;
        // }
        // for(let j = 0; j < this.petalContainers[i].length; j++){
        //     const petalContainer = this.petalContainers[i][j];
        //     // console.log({petalContainer, mouseX, mouseY})
        //     if(mouseX > petalContainer.x - petalContainer.w/2 && mouseX < petalContainer.x + petalContainer.w/2 && mouseY > petalContainer.y - petalContainer.h/2 && mouseY < petalContainer.y + petalContainer.h/2){
        //         // for now we'll just equip the petal, but in the future we would want to start a petal drag
        //         // let position = -1;
        //         // let isTop = true;
        //         // for(let k = 0; k < inv.topPetalSlots.length; k++){
        //         //     if(inv.topPetalContainers[k] === undefined){
        //         //         position = k;
        //         //         break;
        //         //     }
        //         // }
        //         // if(position === -1){
        //         //     for(let k = 0; k < inv.bottomPetalSlots.length; k++){
        //         //         if(inv.bottomPetalContainers[k] === undefined){
        //         //             position = k;
        //         //             isTop = false;
        //         //             break;
        //         //         }
        //         //     }
        //         // }
        //         // // console.log({position});
        //         // if(position === -1){
        //         //     return;
        //         // }
        //         // inv.addPetalContainer(new PetalContainer(petalContainer.petals, petalContainer, petalContainer.id, 1), isTop, position);
                
        //         // this.removePetalContainer(petalContainer);
        //         // return;
        //         draggingPetalContainer = new PetalContainer(petalContainer.petals, {...petalContainer}, Math.random(), 1)//petalContainer;
        //         draggingPetalContainer.mouseOffset = {
        //             x: draggingPetalContainer.x - mouseX,
        //             y: draggingPetalContainer.y - mouseY
        //         }
        //         this.removePetalContainer(petalContainer);
        //     }
        // }
    }
    swapPetals(index, toSend=true){
        if(this.topPetalSlots[index] === undefined){
            return;
        }
        
        const placeholder = this.topPetalContainers[index];
        this.topPetalContainers[index] = this.bottomPetalContainers[index];
        this.bottomPetalContainers[index] = placeholder;
        if(this.topPetalContainers[index] === undefined){
            delete this.topPetalContainers[index];
        }
        if(this.bottomPetalContainers[index] === undefined){
            delete this.bottomPetalContainers[index];
        }
        this.positionPetalSlots();
        
        if(toSend === true) send({swapPetal: index});

        this.updateSavedPetals();
    }
    draw(alpha=1){
        if(this.fadingPetalContainer !== null){
            const temp = {x: this.fadingPetalContainer.render.x, y: this.fadingPetalContainer.render.y};
            this.fadingPetalContainer.render.x = this.fadingPetalContainer.x;
            this.fadingPetalContainer.render.y = this.fadingPetalContainer.y;
            // ctx.translate(0,-this.translateY);
            const animationTime = 1 - (time - this.fadingPetalContainer.fadeTime) / 200;
            ctx.globalAlpha = Math.max(0,Math.min(1,animationTime));
            ctx.save();
            ctx.translate(this.fadingPetalContainer.x, this.fadingPetalContainer.y);
            ctx.scale(2 - animationTime, 2 - animationTime);
            ctx.translate(-this.fadingPetalContainer.x, -this.fadingPetalContainer.y);
            this.fadingPetalContainer.draw(alpha);
            ctx.restore();
            // ctx.translate(0,this.translateY);
            this.fadingPetalContainer.render.x = temp.x;
            this.fadingPetalContainer.render.y = temp.y;
            if(time - this.fadingPetalContainer.fadeTime > 200){
                this.fadingPetalContainer = null;
            }
        }

        for(let i = 0; i < this.topPetalSlots.length; i++){
            this.topPetalSlots[i].draw(alpha);
        }
        for(let i = 0; i < this.bottomPetalSlots.length; i++){
            this.bottomPetalSlots[i].draw(alpha);
        }
        for(let key in this.topPetalContainers){
            this.topPetalContainers[key].draw(true, key);
        }
        for(let key in this.bottomPetalContainers){
            this.bottomPetalContainers[key].draw();
        }

        if(this === menuInventory){
            const mouseX = mouse.x * canvas.w / window.innerWidth;
            const mouseY = mouse.y * canvas.h / window.innerHeight;
            const offsetMouseY = mouseY - this.translateY;
            ctx.lastTransform8 = ctx.getTransform();
            for(let key in this.topPetalContainers){
                const pc = this.topPetalContainers[key];

                if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
                    pc.isHovered = true;
                }
                pc.drawStatsBox(true);
            }

            for(let key in this.bottomPetalContainers){
                const pc = this.bottomPetalContainers[key];

                if(mouseX > pc.x - pc.w/2 && mouseX < pc.x + pc.w/2 && offsetMouseY > pc.y - pc.h/2 && offsetMouseY < pc.y + pc.h/2){
                    pc.isHovered = true;
                }
                pc.drawStatsBox(true);
            }
            ctx.setTransform(ctx.lastTransform8);
            delete ctx.lastTransform8;
        }
    }
    updateBiome(){
        for(let key in this.topPetalContainers){
            const pc = this.topPetalContainers[key];
            pc.draw();
            if(pc.greyed === true){
                globalInventory.addPetalContainer(pc);
                this.removePetalContainer(false, key);
            }
        }
        for(let key in this.bottomPetalContainers){
            const pc = this.bottomPetalContainers[key];
            pc.draw();
            if(pc.greyed === true){
                globalInventory.addPetalContainer(pc);
                this.removePetalContainer(true, key);
            }
        }
    }
    updateSavedPetals(){
        // let savedPetals = {top: {}, bottom: {}};
        // for(let key in this.topPetalContainers){
        //     savedPetals.top[key] = {rarity: this.topPetalContainers[key].rarity, type: this.topPetalContainers[key].type};
        // }
        // for(let key in this.bottomPetalContainers){
        //     savedPetals.bottom[key] = this.bottomPetalContainers[key];
        // }
        // savedPetals = {top: this.topPetalContainers, bottom: this.bottomPetalContainers};
        localStorage.setItem("savedPetals", JSON.stringify({top: this.topPetalContainers, bottom: this.bottomPetalContainers}));

        if(window.loaded === true){
            if(this === menuInventory){
                this.queueSendChangedPetals();
                squadUI.updateSelfFlowerPetals({top: this.topPetalContainers, bottom: this.bottomPetalContainers});
            }
        }
    }
    queueSendChangedPetals() {
        const pack = this.pack();
        this.queuedChangedPetals = pack;
    }
    pack(){
        return {
            top: mapObject(this.topPetalContainers, pc => {return {rarity: pc.rarity, type: pc.type}}),
            bottom: mapObject(this.bottomPetalContainers, pc => {return {rarity: pc.rarity, type: pc.type}})
        };
    }
}

function mapObject(obj, fn){
    let newObj = {};
    for(let key in obj){
        newObj[key] = fn(obj[key]);
    }
    return newObj;
}

// not a petalContainer! These are the "slots" where you put the petal containers into (basically 1 box in the inventory)
class PetalSlot {
    constructor(init){
        this.x = init.x;
        this.y = init.y;
        this.size = init.size;
    }
    draw(alpha){
        ctx.globalAlpha = 0.8 * alpha;
        ctx.fillStyle = '#eeeeee';
        ctx.strokeStyle = '#bebebe';
        ctx.lineWidth = 6;// maybe 5?
        ctx.beginPath();
        ctx.roundRect(this.x - this.size / 2 + 1, this.y - this.size/2 + 1, this.size - 2, this.size - 2, this.size / 10);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
}