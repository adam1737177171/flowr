const numberOfRarities = 19;
//Change back to 13 if this causes issues, beacuse only 13 are real
//After omnipotent is all dev trolling purposes, not real rarities
//13+ will never be actually spawnable or legitamately obtainable
// ------

// this is the inventory in the bottom right corner
class GlobalInventory {
    constructor(){
        this.icon = new Image();
        
        if(location.origin === 'https://flowrclient.serum0017.repl.co'){
            this.icon.src = 'https://flowr.fun/gfx/youdontownthisiconzert.png';
        } else {
            this.icon.src = 'gfx/youdontownthisiconzert.png';
        }

        this.hoveringOverButton = false;

        this.hoveringOverX = false;

        this.menuActive = false;

        this.petalContainers = {/*rarity: [petalName: PetalContainer]*/};

        this.w = 445;//510;
        this.h = 665;//740;

        this.scroll = 5;
        this.render = {scroll: this.scroll};

        this.menuHeights = {beginning: 0, end: this.h};
        this.scrollbar = {top: 0, bottom: 0, renderTop: 0, renderBottom: 0, length: 150};


        // this.scrollbar.bottom = (canvas.h - this.h - 20) + 60 - this.scrollbar.length * 7/8
        // this.scrollbar.top = this.scrollbar.bottom + this.scrollbar.length / 2
        const scrollBarProjections = {
            top: (canvas.h - this.h - 20) + this.scrollbar.length*.5 + 60,
            bottom: (canvas.h - 20) - this.scrollbar.length*.5 + 30
        }
        this.scrollbar.top = this.scrollbar.bottom = scrollBarProjections.top + this.scrollbar.length;
        this.scrollbar.renderBottom = this.scrollbar.bottom;
        this.scrollbar.renderTop = this.scrollbar.top;

        this.draggingScrollBar = false;

        this.totalPetalHeight = 0;

        this.hoveringOverScrollbar = false;
        this.scrollBarActive = false;
    }
    resizeScroll(){
        if(this.resizeFlag !== undefined) {
            return;
        }
        const scrollBarProjections = {
            top: (canvas.h - this.h - 20) + this.scrollbar.length*.5 + 60,
            bottom: (canvas.h - 20) - this.scrollbar.length*.5 + 30
        }
        this.scrollbar.top = this.scrollbar.bottom = scrollBarProjections.top + this.scrollbar.length;

        this.resizeFlag = true;
    }
    drawIcon(alpha=1){
        if(alpha !== 1){
            ctx.globalAlpha = alpha;
        }
        // these colors are taken from florr.io, not hornex. They are the exact same. I checked.
        ctx.fillStyle = '#5a9fdb';
        ctx.strokeStyle = '#4981b1';
        if(mouse.canvasX + 6 > 20 && mouse.canvasY + 6 > canvas.h - 20 - 80 - 100 - 100 && mouse.canvasX - 6 < 20 + 80 && mouse.canvasY - 6 < canvas.h - 20 - 80 + 80 - 100 - 100){
            ctx.fillStyle = '#6aa8df';
            setCursor('pointer');
            this.hoveringOverButton = true;
        } else {
            // if(this.hoveringOverX === false){
            //     document.body.style.cursor = 'auto';
            // }
            this.hoveringOverButton = false;
        }
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(20, canvas.h - 20 - 80 - 100 - 100, 80, 80, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.drawImage(this.icon, 20 + 15, canvas.h - 20 - 80 + 15 - 100 - 100, 80 - 15 * 2, 80 - 15 * 2);
        
        ctx.fillStyle = '#f0f0f0';// this is gonna be pain lol
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.25;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 14px Ubuntu`;
        const lastLetterSpacing = ctx.letterSpacing;
        ctx.letterSpacing = '0px';
        ctx.strokeText("[X]", 20 + 80 - 15 - 2.5, canvas.h - 20 - 80 + 15 - 100 - 100)
        ctx.fillText("[X]", 20 + 80 - 15 - 2.5, canvas.h - 20 - 80 + 15 - 100 - 100)
        ctx.letterSpacing = lastLetterSpacing;

        ctx.globalAlpha = 1;
    }
    draw(){
        let alpha = this.fadingOut === true ? 1 - (time - this.originalFadeOutTime) / 100 : 1;

        this.drawIcon(alpha);

        // animation stuff here, calling drawInventory but possibly transforming beforehand
        if(this.menuActive === true || (time - this.lastCloseTime) < 140){
            this.drawInventory(alpha);
        } else {
            this.hoveringOverX = false;
        }
    }
    fadeOut(){
        this.fadingOut = true;
        this.originalFadeOutTime = time;
        setTimeout(() => {
            delete this.fadingOut;
            if(this.menuActive === true){
                this.toggleMenu();
            }
        }, 100);
    }
    initInventory(data){
        this.petalContainers = {};
        craftingMenu.petalContainers = {};
        craftingMenu.fillerPetalSlots = {};
        craftingMenu.recalculateTypeIndexes();

        // console.log({'init inventory data': data});
        for(let i = 0; i < data.length; i++){
            const {x,y,w,h,originalX,originalY,radius} = data[i];
            this.addPetalContainer(new PetalContainer(Array(data[i].petalAmount).fill(new Petal(data[i].petal)), {x,y,w:65,h:65,originalX,originalY,radius,toOscillate:false,petalStats:data[i].petalStats,customBiome:data[i].customBiome}, data[i].id, data[i].amount, data[i].attempt));
        }

        // if(savedPetals){
        //     for(let key in savedPetals.top){
        //         const pc = savedPetals.top[key];
        //         this.removeByRarityAndType(pc.rarity, pc.type);
        //     }
        //     for(let key in savedPetals.bottom){
        //         const pc = savedPetals.bottom[key];
        //         this.removeByRarityAndType(pc.rarity, pc.type);
        //     }
        // }

        for(let key in this.petalContainers){
            if(key > maxRarityObtained){
                maxRarityObtained = parseInt(key);
            }
        }
        // if(maxRarityObtained === 9)maxRarityObtained = 100;
    }
    addPetalContainer(p, isCRSync=false){
        craftingMenu.addPetalContainer(new PetalContainer(p.petals, {...p}, p.id, p.amount, p.attempt));
        // this whole function is really inefficient lol. If you're ever bored then refactor ig.
        if(this.petalContainers[p.rarity] === undefined){
            this.petalContainers[p.rarity] = [];
        }

        // const me = room.flowers[window.selfId];

        let previousStack = this.petalContainers[p.rarity].find(p2 => p2.type === p.type);
        if(previousStack !== undefined){
            previousStack.amount += p.amount;
            previousStack.lastAmountChangedTime = time;

            // if(this.menuActive === true){
            //     previousStack.lastAmountChangedTime = time;
            //     p.isTempAnimation = true;
            //     p.realNonAnimationParent = previousStack;
                
            //     setTimeout(() => {
            //         const lastLength = this.petalContainers[p.rarity.length];
            //         this.petalContainers[p.rarity] = this.petalContainers[p.rarity].filter(p2 => p2 !== p);
            //         if(lastLength === this.petalContainers[p.rarity].length){
            //             for(let i = 0; i < this.petalContainers[p.rarity]; i++){
            //                 if(this.petalContainers[p.rarity][i].type === p.type){
            //                     this.removePetalContainer(p.rarity, i);
            //                     return;
            //                 }
            //             }
            //         }
            //     }, 2000)
            //     return;
            // } else {
                return;
            // }
        }// else {
            // this.petalContainers[p.rarity].unshift(p);
            // this.petalContainers[p.rarity].sort();
        // }

        p.w = 62;
        p.h = 62;

        this.petalContainers[p.rarity].unshift(p);// pushing p ong

        this.petalContainers[p.rarity].sort();

        // adding camera render so that it looks the same even without translation
        // p.render.x += canvas.w/2-me.render.headX;
        // p.render.y += canvas.h/2-me.render.headY;
    }
    removeByRarityAndType(rarity, type){
        if(this.petalContainers[rarity]?.length === undefined){
            return;
        }
        for(let i = 0; i < this.petalContainers[rarity].length; i++){
            if(this.petalContainers[rarity][i].type === type){
                this.removePetalContainer(rarity, i);
                return true;
            }
        }
        // why is this here?? wtf?
        // craftingMenu.removePetalContainer(type, rarity);
        return false;
    }
    ReturnRarityAndType(rarity, type){
        if(this.petalContainers[rarity]?.length === undefined){
            return false;
        }
        for(let i = 0; i < this.petalContainers[rarity].length; i++){
            if(this.petalContainers[rarity][i].type === type){
                return this.petalContainers[rarity][i];
            }
        }
        return false;
    }
    removeByRarityAndTypeAndReturn(rarity, type){
        if(this.petalContainers[rarity]?.length === undefined){
            return false;
        }
        for(let i = 0; i < this.petalContainers[rarity].length; i++){
            if(this.petalContainers[rarity][i].type === type){
                return this.removePetalContainer(rarity, i);
            }
        }
        // why is this here?? wtf?
        // craftingMenu.removePetalContainer(type, rarity);
        return false;
    }
    removePetalContainer(rarity, indexInRarity){
        const petalContainer = this.petalContainers[rarity][indexInRarity];
        craftingMenu.removePetalContainer(petalContainer.type, petalContainer.rarity);
        if(petalContainer.amount >= 2){
            petalContainer.amount--;
            petalContainer.lastAmountChangedTime = time;
        } else {
            this.petalContainers[rarity].splice(indexInRarity, 1);
        }
        return petalContainer;
        // for(let i = 0; i < this.petalContainers[p.rarity].length; i++){
        //     const petalContainer = this.petalContainers[p.rarity][i];
        //     if(petalContainer === p){
        //         console.log(p);
        //         if(petalContainer.amount >= 2){
        //             p.amount--;
        //             p.lastAmountChangedTime = time;
        //         } else {
        //             this.petalContainers[p.rarity].splice(i,1);
        //         }
        //         return p;
        //     }
        // }
        // console.log('not found');
        // this.petalContainers[p.rarity] = this.petalContainers[p.rarity].filter(p2 => p2 !== p);
    }
    removePetalContainerAmount(rarity, indexInRarity, amount){
        const petalContainer = this.petalContainers[rarity][indexInRarity];
        if(petalContainer.amount >= amount + 1){
            petalContainer.amount -= amount;
            petalContainer.lastAmountChangedTime = time;
        } else {
            this.petalContainers[rarity].splice(indexInRarity, 1);
        }
        craftingMenu.removePetalContainerAmount(petalContainer.type, petalContainer.rarity, amount);
    }
    mouseDown({mouseX, mouseY}, inv){
        if(this.removeDraggingAnim){
            clearTimeout(this.removeDraggingAnim);
            draggingPetalContainer = null;
            delete this.removeDraggingAnim;
        }
        for(let i in this.petalContainers){
            if(this.petalContainers[i] === undefined){
                continue;
            }
            for(let j = 0; j < this.petalContainers[i].length; j++){
                const petalContainer = this.petalContainers[i][j];
                if(petalContainer.greyed === true) continue;
                // console.log({petalContainer, mouseX, mouseY})
                // 130, canvas.h - this.h - 20
                if(mouseX > 130 + petalContainer.x - petalContainer.w/2 && mouseX < 130 + petalContainer.x + petalContainer.w/2 && mouseY > canvas.h - this.h - 20 + petalContainer.y - petalContainer.h/2 && mouseY < canvas.h - this.h - 20 + petalContainer.y + petalContainer.h/2){
                    // for now we'll just equip the petal, but in the future we would want to start a petal drag
                    // let position = -1;
                    // let isTop = true;
                    // for(let k = 0; k < inv.topPetalSlots.length; k++){
                    //     if(inv.topPetalContainers[k] === undefined){
                    //         position = k;
                    //         break;
                    //     }
                    // }
                    // if(position === -1){
                    //     for(let k = 0; k < inv.bottomPetalSlots.length; k++){
                    //         if(inv.bottomPetalContainers[k] === undefined){
                    //             position = k;
                    //             isTop = false;
                    //             break;
                    //         }
                    //     }
                    // }
                    // // console.log({position});
                    // if(position === -1){
                    //     return;
                    // }
                    // inv.addPetalContainer(new PetalContainer(petalContainer.petals, petalContainer, petalContainer.id, 1), isTop, position);
                    
                    // this.removePetalContainer(petalContainer);
                    // return;
                    const removedPC = this.removePetalContainer(i,j);
                    draggingPetalContainer = new PetalContainer(removedPC.petals, {...removedPC, isDragging: true}, Math.random(), 1)//petalContainer;
                    draggingPetalContainer.x += 130;
                    draggingPetalContainer.render.x += 130;
                    draggingPetalContainer.y += canvas.h - this.h - 20;
                    draggingPetalContainer.render.y += canvas.h - this.h - 20;
                    draggingPetalContainer.amount = 1;
                    draggingPetalContainer.mouseOffset = {
                        x: draggingPetalContainer.x - mouseX,
                        y: draggingPetalContainer.y - mouseY
                    }
                    draggingPetalContainer.w = 85;
                    draggingPetalContainer.h = 85;
                    // draggingPetalContainer.spawnAnimation = .8;
                }
            }
        }

        if(
            mouseX < this.w - 16 + 12 + 130 &&
            mouseX > this.w - 16 - 12 + 130 &&
            mouseY > (this.scrollbar.bottom) &&
            mouseY < (this.scrollbar.top)
        ){
            this.draggingScrollBar = true;
        }
    }
    mouseUp({mouseX, mouseY}, inv, skipFastFlag=false){
        this.draggingScrollBar = false;
        // delete this.scrollbarMouseOffset;

        if(this.removeDraggingAnim){
            clearTimeout(this.removeDraggingAnim);
            draggingPetalContainer = null;
            delete this.removeDraggingAnim;
        }
        // console.log(Math.sqrt((mouse.lastDownData.x-mouse.x)**2+(mouse.lastDownData.y-mouse.y)**2));
        if(draggingPetalContainer !== null){
            if(skipFastFlag === false && time - mouse.lastDownData.time < 300 && Math.sqrt((mouse.lastDownData.x-mouse.x)**2+(mouse.lastDownData.y-mouse.y)**2) < 20){
                if(draggingPetalContainer.lastPetalSlot !== undefined && draggingPetalContainer.lastPetalSlot.index !== -1){
                    if(draggingPetalContainer.lastPetalSlot.top === true){
                        if(inv.bottomPetalContainers[draggingPetalContainer.lastPetalSlot.index] === undefined){
                            this.mouseUp(...arguments, true);
                            return;
                        }
                    } else {
                        if(inv.topPetalContainers[draggingPetalContainer.lastPetalSlot.index] === undefined){
                            this.mouseUp(...arguments, true);
                            return;
                        }
                    }
                    // if the petal is in Inventory then try and swap it.
                    // add it back
                    inv.addPetalContainer(draggingPetalContainer, draggingPetalContainer.lastPetalSlot.top, draggingPetalContainer.lastPetalSlot.index);
                    // swap it
                    inv.swapPetals(draggingPetalContainer.lastPetalSlot.index, false);
                    draggingPetalContainer = null;
                    return;
                } else {
                    // otherwise if it came from globalInventory then try and equip it
                    if(inv.addInFirstAvailableSlot(draggingPetalContainer) === true){
                        draggingPetalContainer = null;
                        return;
                    }
                }
            }
            if(inv.addClosest(draggingPetalContainer, this) === true){
                draggingPetalContainer = null;
            } else {
                // if(this.menuActive === false){
                    const render = window.structuredClone(draggingPetalContainer.render);
                    const mouseOffset = {x:draggingPetalContainer.mouseOffset.x,y:draggingPetalContainer.mouseOffset.y};
                    // let clone = new PetalContainer(draggingPetalContainer.petals, {...draggingPetalContainer}, Math.random(), draggingPetalContainer.amount);
                    this.addPetalContainer(draggingPetalContainer);
                    draggingPetalContainer = new PetalContainer(draggingPetalContainer.petals, {...draggingPetalContainer, isDragging: true}, Math.random(), draggingPetalContainer.amount);//p.collectTime = time;
                    for(let key in render){
                        draggingPetalContainer[key] = render[key];
                    }
                    draggingPetalContainer.mouseOffset = mouseOffset;
                    draggingPetalContainer.x = render.x;
                    draggingPetalContainer.y = render.y;
                    draggingPetalContainer.spawnAnimation = 1;
                    draggingPetalContainer.collectTime = time;
                    this.removeDraggingAnim = setTimeout(() => {
                        draggingPetalContainer = null;
                        delete this.removeDraggingAnim;
                    }, 150)
                // } else {
                //     this.addPetalContainer(draggingPetalContainer);
                //     draggingPetalContainer = null;
                // }
            }
        }
    }
    drawInventory(alpha=1){
        this.render.scroll = interpolate(this.render.scroll, this.scroll, 0.0070 * dt);

        if(alpha !== 1){
            ctx.globalAlpha = alpha;
        }
        let translation = 0;
        if(time - this.lastCloseTime < 160){
            translation += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
        }
        if(time - this.lastOpenTime < 160){
            translation += (this.h + 40) - (this.h + 40) * easeOutCubic((time - this.lastOpenTime) / 160);
        }
        if(translation !== 0){
            ctx.translate(0, translation);
        }

        if(this.hoveringOverScrollbar === true || this.draggingScrollBar === true){
            setCursor('pointer');
        }

        ctx.translate(130, canvas.h - this.h - 20);
        // if(time - this.lastCloseTime < 500){
        //     ctx.translate()
        // }
        ctx.fillStyle = '#5a9fdb';
        ctx.strokeStyle = '#4981b1';
        ctx.lineWidth = 8;

        ctx.save();

        ctx.beginPath()
        ctx.roundRect(0, 0, this.w, this.h, 3);
        ctx.fill();
        ctx.stroke();
        ctx.clip();
        ctx.closePath();

        const petalContainersPerRow = 5;
        const padding = 35;
        const rightPadding = 50;// scroll bar is here so we need more
        const petalContainerSize = 65//(this.petalContainers[0] ?? {w: 0}).w;

        let firstPetalContainer = null;
        let lastPetalContainer = null;

        let renderIndex = 0;
        for(let i = numberOfRarities-1; i >= 0; i--){
            if(this.petalContainers[i] === undefined){
                continue;
            }
            for(let j = 0; j < this.petalContainers[i].length; j++){
                const petalContainer = this.petalContainers[i][j];
                if(petalContainer.isTempAnimation === true){
                    var lastRenderIndex = renderIndex;
                    renderIndex = petalContainer.realNonAnimationParent.renderIndex;
                }
                petalContainer.x = petalContainerSize / 2 + padding + (renderIndex % petalContainersPerRow) / (petalContainersPerRow-1) * (this.w - petalContainerSize - padding - rightPadding);
                petalContainer.y = padding + petalContainerSize/2 + Math.floor(renderIndex / petalContainersPerRow) * (petalContainerSize + 12) + this.render.scroll;
                petalContainer.renderIndex = renderIndex;

                // really unoptimized lol
                if(firstPetalContainer === null){
                    firstPetalContainer = petalContainer;
                }
                lastPetalContainer = petalContainer;

                petalContainer.relativeY = Math.floor(renderIndex / petalContainersPerRow) * (petalContainerSize + 12) + petalContainerSize / 2 + this.render.scroll;
                if(petalContainer.relativeY - petalContainer.y + petalContainer.render.y < this.h - padding /*-*/+ petalContainerSize && petalContainer.relativeY - petalContainer.y + petalContainer.render.y > /*padding*/ - petalContainerSize * 2){
                    // if(this.h - petalContainer.relativeY < petalContainerSize / 2){
                    //     ctx.globalAlpha = (this.h - petalContainer.relativeY) / petalContainerSize / 2;
                    // }
                    if(petalContainer.lastOutTime !== undefined){
                        delete petalContainer.lastOutTime;
                        petalContainer.lastInTime = time;
                    }

                    // if(petalContainer.lastInTime !== undefined){
                    //     ctx.globalAlpha = ((time - petalContainer.lastInTime) / 300) ** 2;
                    //     if(time - petalContainer.lastInTime > 300){
                    //         delete petalContainer.lastInTime;
                    //     }
                    // }
                    
                    petalContainer.draw();
                    // ctx.globalAlpha = 1;
                } else {
                    // if(petalContainer.lastOutTime === undefined){
                    //     petalContainer.lastOutTime = time;
                    // }
                    // if(petalContainer.lastInTime !== undefined){
                    //     delete petalContainer.lastInTime;
                    // }
                    // if(time - petalContainer.lastOutTime < 300){
                    //     ctx.globalAlpha = (1 - (time - petalContainer.lastOutTime) / 300) ** 2;
                    //     petalContainer.draw();
                    //     ctx.globalAlpha = 1;
                    // } else {
                        petalContainer.updateInterpolate();
                    // }
                }
                renderIndex++;
                if(petalContainer.isTempAnimation === true){
                    renderIndex = lastRenderIndex;
                }
            }
        }

        ctx.restore();

        // stroking the rect again so that hte stroke isn't halfway in
        ctx.fillStyle = '#5a9fdb';
        ctx.strokeStyle = '#4981b1';
        ctx.lineWidth = 8;

        ctx.save();

        ctx.beginPath()
        ctx.roundRect(0, 0, this.w, this.h, 3);
        ctx.stroke();
        ctx.closePath();

        if(firstPetalContainer !== null && Object.keys(this.petalContainers).length > 0){// insanity
            this.menuHeights = {
                beginning: firstPetalContainer.relativeY, //- petalContainerSize * 1/2,
                end: lastPetalContainer.relativeY //+ petalContainerSize * 4
            }

            if(this.menuHeights.end - this.menuHeights.beginning < this.h - (petalContainerSize + 12)/*extra row*/){
                this.scrollBarActive = false;
                this.scroll = 5;
            } else {
                if(this.menuHeights.end - this.menuHeights.beginning < this.h){
                    this.scrollBarActive = false;
                } else {
                    this.scrollBarActive = true;
                }

                // const lastScroll = this.scroll;

                // console.log(this.menuHeights.beginning - this.menuHeights.end);

                if(this.menuHeights.end + this.scroll - this.render.scroll < this.h - petalContainerSize - padding){
                    // we want to move target - actual distance
                    this.scroll = (this.menuHeights.beginning - this.menuHeights.end) + this.h - petalContainerSize - padding - 5;
                } else if(this.menuHeights.beginning + this.scroll - this.render.scroll > padding){
                    this.scroll = 5;
                    // this.render.scroll = 0;
                }

                // const ratio = (this.scroll - 5) / ((this.menuHeights.beginning - this.menuHeights.end) + this.h - petalContainerSize * 3/2 - 5 - 5);// at 0 it will be 0, at max (this.mH.beginning - ...) it will be 1

                // this.scrollbar.length = ((this.menuHeights.beginning - this.menuHeights.end) + this.h - petalContainerSize - 5); // max scroll
                // this.scrollbar.top = ratio * (this.h - this.scrollbar.length);
                // this.scrollbar.bottom = ratio * (this.h - this.scrollbar.length) + this.scrollbar.length;

                // reverseing the mouseY to scroll to give us mouseY in terms of this.scroll
                const scrollBarProjections = {
                    top: (canvas.h - this.h - 20) + this.scrollbar.length*.5 + 60,
                    bottom: (canvas.h - 20) - this.scrollbar.length*.5 + 30
                }
                // top: (canvas.h - this.h - 20) + this.scrollbar.length - 130,
                // bottom: (canvas.h - 20) - 16 + this.scrollbar.length + 160

                // const mouseProjections = {
                //     top: scrollBarProjections.top - this.scrollbar.length * .25,
                //     bottom: scrollBarProjections.bottom - this.scrollbar.length * .25 + 30
                // }
                // // console.log(scrollBarProjections.bottom - canvas.h);
                // ctx.translate(-130, -(canvas.h - this.h - 20));
                // ctx.fillStyle = 'blue';
                // ctx.beginPath();
                // ctx.arc(0, mouseProjections.bottom, 30, 0, Math.PI * 2);
                // ctx.fill();
                // ctx.closePath();
                // ctx.beginPath();
                // ctx.arc(0, mouseProjections.top, 30, 0, Math.PI * 2);
                // ctx.fill();
                // ctx.closePath();
                // ctx.translate(130, (canvas.h - this.h - 20));

                this.totalPetalHeight = (this.menuHeights.beginning - this.menuHeights.end);

                // this.scroll = (mouseY - scrollBarProjections.top) / (scrollBarProjections.bottom - scrollBarProjections.top) * (this.totalPetalHeight + this.scrollbar.length) //* ((this.h - 82 - 16 * 2) / this.h);

                // max at (this.scroll - this.h) / this.totalPetalHeight, min at 0 / this.totalPetalHeight
                // const ratio = (this.scroll - this.h * ratio) / this.totalPetalHeight;
                const ratio = this.scroll / this.totalPetalHeight / (1 + this.h / this.totalPetalHeight);
                // console.log(ratio);
                this.scrollbar.bottom = interpolate(scrollBarProjections.top, scrollBarProjections.bottom, ratio) - this.scrollbar.length / 2//this.scroll / (this.totalPetalHeight) * (scrollBarProjections.bottom - scrollBarProjections.top) + scrollBarProjections.top + this.scrollbar.length / 2 - (canvas.h - this.h - 20);
                // this.scrollbar.bottom = this.scroll / (this.totalPetalHeight + this.scrollbar.length) * (scrollBarProjections.bottom - scrollBarProjections.top) + scrollBarProjections.top - this.scrollbar.length/2;
                this.scrollbar.top = this.scrollbar.bottom + this.scrollbar.length / 2//this.scrollbar.bottom - this.scrollbar.length / 2;
            }
        }

        this.scrollbar.renderTop = interpolate(this.scrollbar.renderTop, this.scrollbar.top, this.draggingScrollBar ? 0.28 : 0.08);
        this.scrollbar.renderBottom = interpolate(this.scrollbar.renderBottom, this.scrollbar.bottom, this.draggingScrollBar ? 0.28 : 0.08);

        // console.log(this.scrollBarActive);
        if(this.scrollBarActive !== false && Object.keys(this.petalContainers).length > 0){
            ctx.translate(0, -(canvas.h - this.h - 20));
            ctx.strokeStyle = '#4981b1';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(this.w - 16, (this.scrollbar.renderTop) /** ((this.h - 82 - 16) / this.h) + 82*/);
            ctx.lineTo(this.w - 16, (this.scrollbar.renderBottom) /** ((this.h - 82 - 16) / this.h) + 82*/);
            ctx.stroke();
            ctx.closePath();
            ctx.translate(0, (canvas.h - this.h - 20));
        }
        

        if(this.menuActive === true && translation === 0){
            if(mouse.canvasX > 130 + this.w - 7.5 - 30 - 3 && mouse.canvasY > canvas.h - this.h - 20 + 7.5 + 3 && mouse.canvasX < 130 + this.w - 7.5 - 3 && mouse.canvasY < canvas.h - this.h - 20 + 7.5 + 30 + 3){
                ctx.fillStyle = "#c16666";
                setCursor('pointer');
                this.hoveringOverX = true;
            } else {
                // if(this.hoveringOverButton === false){
                //     document.body.style.cursor = 'auto';
                // }
                this.hoveringOverX = false;
                ctx.fillStyle = '#c1565e';
            }
        } else {
            ctx.fillStyle = '#c1565e';
            this.hoveringOverX = false;
        }

        ctx.translate(-3, 3);
        ctx.strokeStyle = '#90464b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(this.w - 7.5 - 30, 7.5, 30, 30, 6);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 4.75;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#cccccc';
        ctx.beginPath();
        ctx.moveTo(this.w - 30, 30);
        ctx.lineTo(this.w - 7.5 * 2, 7.5 + 7.5);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(this.w - 7.5 * 2, 30);
        ctx.lineTo(this.w - 30, 7.5 + 7.5);
        ctx.stroke();
        ctx.closePath();
        ctx.translate(3, -3);
        // ctx.beginPath();
        // ctx.moveTo(this.w - 7.5, 7.5 - 7.5 - 7.5, 30 + 7.5 + 7.5);
        // ctx.lineTo(this.w - 7.5 - 30, 15 + 30 + 15);
        // ctx.stroke();
        // ctx.closePath();

        // const firstPetalContainer = this.petalContainers[0][0];
        // const lastPetalContainer = this.petalContainers[numberOfRarities-2][this.petalContainers[numberOfRarities-2].length-1].y
        // if(firstPetalContainer.relativeY < this.h - petalContainerSize - padding - 20){
        //     this.scroll += (this.h - petalContainerSize - padding - 20 - firstPetalContainer.relativeY);
        // } else if(lastPetalContainer.relativeY > 0){
        //     console.log('alrt');
        // }
        const mouseRelative = {
            x: mouse.canvasX - 130,
            y: mouse.canvasY - (canvas.h - this.h - 20)
        };

        if(mouseRelative.y > 0 && mouseRelative.x < this.w){
            ctx.lastTransform6 = ctx.getTransform();
            for(let i = numberOfRarities-1; i >= 0; i--){
                if(this.petalContainers[i] === undefined){
                    continue;
                }
                for(let j = 0; j < this.petalContainers[i].length; j++){
                    const petalContainer = this.petalContainers[i][j];
    
                    if(
                        mouseRelative.x > petalContainer.render.x - (petalContainer.w/2+6) &&
                        mouseRelative.x < petalContainer.render.x + (petalContainer.w/2+6) &&
                        mouseRelative.y > petalContainer.render.y - (petalContainer.h/2+6) &&
                        mouseRelative.y < petalContainer.render.y + (petalContainer.h/2+6)
                    ){
                        petalContainer.isHovered = true;
                    }
    
                    petalContainer.drawStatsBox();
                }
            }
            ctx.setTransform(ctx.lastTransform6);
            delete ctx.lastTransform6;
        }

        ctx.translate(-130, -(canvas.h - this.h - 20));

        if(translation !== 0){
            ctx.translate(0, -translation);
        }
        ctx.globalAlpha = 1;

        // ctx.fillStyle = 'red';
        // const scrollBarProjections = {
        //     top: (canvas.h - this.h - 20) + 85 + this.scrollbar.length - 130,
        //     bottom: (canvas.h - 20) - 16 + this.scrollbar.length - 130 - 22
        // }
        // ctx.beginPath();
        // ctx.arc(130, scrollBarProjections.top, 12, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(130, scrollBarProjections.bottom, 12, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
    }
    updateScroll(/*delta*/{x,y}, {mouseX, mouseY}){
        if(this.menuActive !== true){
            return;
        }
        
        if(mouseX < 130 || mouseY < canvas.h - this.h - 20 || mouseX > 130 + this.w || mouseY > canvas.h - 20){
            return;
        }

        this.scroll -= y;

        // let counter = 0;
        // let intrvl = setInterval(() => {
        //     counter++;
        //     if(counter > 10){
        //         clearInterval(intrvl);
        //         return;
        //     }
            // for(let i = numberOfRarities-1; i >= 0; i--){
            //     if(this.petalContainers[i] === undefined){
            //         continue;
            //     }
            //     for(let j = 0; j < this.petalContainers[i].length; j++){
            //         const petalContainer = this.petalContainers[i][j];
            //         if(petalContainer.lastInTime !== undefined){
            //             petalContainer.lastInTime -= Math.abs(y) * 3;
            //         }
            //         if(petalContainer.lastOutTime !== undefined){
            //             petalContainer.lastOutTime -= Math.abs(y) * 3;
            //         }
            //     }    
            // }
        // }, 100)
    }
    mouseMove({mouseX, mouseY}){
        if(
            mouseX < this.w - 16 + 12 + 130 &&
            mouseX > this.w - 16 - 12 + 130 &&
            mouseY > (this.scrollbar.bottom) &&
            mouseY < (this.scrollbar.top)
        ){
            this.hoveringOverScrollbar = true;
            // setCursor('pointer');
            // this.scrollbarMouseOffset = 0//(this.scrollbar.top) * ((this.h - 82 - 16) / this.h) + 82 + (canvas.h - this.h - 20) - mouseY;
        } else {
            this.hoveringOverScrollbar = false;
        }
        /*
        //Tooltip
        for(let i in this.petalContainers){
            if(this.petalContainers[i] === undefined){
                continue;
            }
            for(let j = 0; j < this.petalContainers[i].length; j++){
                const petalContainer = this.petalContainers[i][j];
                if(mouseX > 130 + petalContainer.x - petalContainer.w/2 && mouseX < 130 + petalContainer.x + petalContainer.w/2 && mouseY > canvas.h - this.h - 20 + petalContainer.y - petalContainer.h/2 && mouseY < canvas.h - this.h - 20 + petalContainer.y + petalContainer.h/2){
                    console.log(petalContainer.type, petalContainer.rarity)
                }
            }
        }
        */
        if(this.draggingScrollBar !== true || Object.keys(this.petalContainers).length === 0){
            return;
        }

        const scrollBarProjections = {
            top: (canvas.h - this.h - 20) + this.scrollbar.length*.5 + 60,
            bottom: (canvas.h - 20) - this.scrollbar.length*.5 + 30
        }

        const mouseProjections = {
            top: scrollBarProjections.top - this.scrollbar.length * .25,
            bottom: scrollBarProjections.bottom + this.scrollbar.length * .33
        }

        let ratio = (mouseY - mouseProjections.top) / (mouseProjections.bottom - mouseProjections.top);
        if(ratio < 0){
            ratio = 0;
        } else if(ratio > 1){
            ratio = 1;
        }

        // console.log(mouseY - scrollBarProjections.top);

        if(this.scrollBarActive !== false){
            this.scroll = ratio * (this.totalPetalHeight) //* ((this.h - 82 - 16 * 2) / this.h);
        } else {
            this.scroll = 5;
        }
    }
    toggleMenu(){
        if(mobGallery.menuActive === true) mobGallery.toggleMenu();
        if(this.menuActive === true){
            this.lastCloseTime = time;
        } else {
            this.lastOpenTime = time;
            if(craftingMenu.menuActive === true){
                craftingMenu.toggleMenu();
            }
        }
        this.menuActive = !this.menuActive;
        // console.log(this.menuActive);
    }
}

function simulatedraggingPetalContainer(x,y){
    const d = draggingPetalContainer;
    d.x = x + d.mouseOffset.x;
    d.y = y + d.mouseOffset.y;
    
    if(d.base === undefined){
        d.render.x = interpolate(d.render.x, d.x, 0.2);
        d.render.y = interpolate(d.render.y, d.y, 0.2);
    }
    

    const intersectingSlot = menuInventory.getClosest(d);
    if(intersectingSlot === false){
        if(d.base){
            d.w = d.base.w;
            d.h = d.base.h;
            delete d.base;
            delete d.firstPetalSettleTimer;
        }
        return;
    }
    if(d.base === undefined){
        d.base = {w: d.w, h: d.h};
    }
    if(d.firstPetalSettleTimer !== undefined && (time - d.firstPetalSettleTimer) > 200){
        d.x = intersectingSlot.x;
        d.y = intersectingSlot.y + menuInventory.translateY;
        d.w = intersectingSlot.size;
        d.h = intersectingSlot.size;
    } else if(d.firstPetalSettleTimer === undefined) {
        d.firstPetalSettleTimer = time;
    }
    
    // console.log([isTop, index]);
}