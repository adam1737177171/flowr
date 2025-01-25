// crafting and absorbing menu

function calculateChance(attempt, rarity){
    if (rarity == 0){
      //Common to Unusual
      let chance = 30 + attempt * 9;
      if (attempt > 6){
        chance += (attempt - 6)**2 / 2;
        if (chance > 100){
          chance = 100;
        }
      }
      return chance;
    }
    else if (rarity == 1){
      //Unusual to Rare
      let chance = 15 + attempt * 1.5;
      if (attempt > 12){
        chance += (attempt - 12)**2 / 2;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 2){
      //Rare to Epic
      let chance = 8 + attempt / 1.4;
      if (attempt > 18){
        chance += (attempt - 18)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 3){
      //Epic to Legendary
      let chance = 5 + attempt / 5.6;
      if (attempt > 35){
        chance += (attempt - 35)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 4){
      //Legendary to Mythic
      let chance = 3 + attempt / 22.5;
      if (attempt > 60){
        chance += (attempt - 60)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 5){
      //Mythic to Ultra
      let chance = 2 + attempt / 33;
      if (attempt > 70){
        chance += (attempt - 70)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 6){
      //Ultra to Super
      let chance = 1 + attempt / 43;
      if (attempt > 95){
        chance += (attempt - 95)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 7){
      //Super to Omega
      let chance = 0.9 + attempt / 45;
      if (attempt > 95){
        chance += (attempt - 95)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 8){
      //Omega to Fabled
      let chance = 0.8 + attempt / 48;
      if (attempt > 95){
        chance += (attempt - 95)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 9){
      //Fabled to Divine
      let chance = 0.7 + attempt / 51;
      if (attempt > 100){
        chance += (attempt - 100)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 10){
      //Divine to Supreme
      let chance = 0.6 + attempt / 53;
      if (attempt > 105){
        chance += (attempt - 105)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 11){
      //Supreme to Omnipotent
      let chance = 0.5 + attempt / 55;
      if (attempt > 110){
        chance += (attempt - 110)**2 / 5;
      }
      if (chance > 100){
        chance = 100;
      }
      return chance;
    }
    else if (rarity == 12){
    //Omnipotent to Astral
    let chance = 0.1 + attempt / 100;
    if (attempt > 270){
      chance += (attempt - 270)**2 / 10;
    }
    if (chance > 100){
      chance = 100;
    }
    return chance;
  }
  }

class CraftingMenu {
    constructor(){
        this.state = 'crafting';

        this.icon = new Image();
        if(location.origin === 'https://flowrclient.serum0017.repl.co'){
            this.icon.src = 'https://flowr.fun/gfx/okbutthisoneisoriginal.png';
        } else {
            this.icon.src = 'gfx/okbutthisoneisoriginal.png';
        }

        this.hoveringOverButton = false;

        this.hoveringOverX = false;

        this.menuActive = false;

        this.petalContainers = {/*type: {rarity: petalContainer}*/};

        this.fillerPetalSlots = {}// same as petalContainers except there's slots for stuff that isnt rendered

        this.w = 445;//510;
        this.h = 665;//740;

        this.scroll = 0;
        this.horizontalScroll = 0;
        this.render = {scroll: this.scroll, horizontalScroll: this.horizontalScroll};

        this.totalPetalHeight = 0;

        // relative to this.x, this.y
        this.craftingPetalSlotsDimensions = {
            x: this.w * .30,
            y: this.h * .24,
            maxRadius: 88,
            radius: 88,
            angleOffset: 0
        }
        this.craftingPetalSlots = [];
        for(let i = 0; i < 5; i++){
            const angle = Math.PI * 2 * i / 5 - Math.PI / 2;
            this.craftingPetalSlots.push({
                x: this.craftingPetalSlotsDimensions.x + Math.cos(angle) * this.craftingPetalSlotsDimensions.radius,
                y: this.craftingPetalSlotsDimensions.y + Math.sin(angle) * this.craftingPetalSlotsDimensions.radius,
                w: 65,
                h: 65
            })
        }
        this.craftingPetalContainers = [];

        this.craftingAnimationState = false;// false, true, "display" <- displays the collected petalSlots
        this.craftingAnimationTimer = 0;
        this.craftingAnimationData = {/*successAmount, lostAmount, pc*/};

        this.hoveringOverCraftButton = false;
        this.craftingButton = {
            x: this.w * .83,
            y: this.h * .28,
            w: this.w * .16,
            h: this.w * .11
        }

        this.inventorySpace = {
            x: 6,
            y: this.h * .48,
            w: this.w - 10 - 24,
            h: this.h * .52 - 4
            // h: this.h * .52 - 4 - 24
        }

        this.scrollbar = {top: 0, bottom: 0, renderTop: 0, renderBottom: 0, length: 75, start: this.inventorySpace.y + 105/2, end: this.inventorySpace.y + this.inventorySpace.h - 105/2};
        this.horizontalScrollBar = {left: 0, right: 0, renderLeft: 0, renderRight: 0, length: 75, start: this.inventorySpace.x + 105 / 2, end: this.inventorySpace.x + this.inventorySpace.w - 105/2};

        this.draggingScrollBar = false;
        this.draggingHorizontalScrollBar = false;

        this.typeIndex = 0;
        this.typeIndexes = {/*[type]: typeIndex*/};

        this.petalContainerSize = 57.4;

        this.maxRarity = 0;

        this.fadingPetalContainers = [];

        this.rainingPetalSlots = [];
        this.isRainingPetalSlots = false;

        this.hoveringOverScrollBar = false;
        this.hoveringOverHorizontalScrollBar = false;
    }
    enterGame(){
        this.craftingPetalContainers = [];

        this.craftingAnimationState = false;// false, true, "display" <- displays the collected petalSlots
        this.craftingAnimationTimer = 0;
        this.craftingAnimationData = {/*successAmount, lostAmount, pc*/};
    }
    addPetalContainer(p){
        // this whole function is really inefficient lol. If you're ever bored then refactor ig.
        if(this.petalContainers[p.type] === undefined){
            this.petalContainers[p.type] = {};
            this.typeIndexes[p.type] = this.typeIndex++;
        }

        if(this.petalContainers[p.type][p.rarity] !== undefined){
            this.petalContainers[p.type][p.rarity].amount += p.amount;
            this.petalContainers[p.type][p.rarity].lastAmountChangedTime = time;
            if (p.attempt != undefined){
                this.petalContainers[p.type][p.rarity].attempt = p.attempt;
            }
        } else {
            this.petalContainers[p.type][p.rarity] = p;
            this.petalContainers[p.type][p.rarity].w = this.petalContainerSize;
            this.petalContainers[p.type][p.rarity].h = this.petalContainerSize;
            if (p.attempt != undefined){
                this.petalContainers[p.type][p.rarity].attempt = p.attempt;
            }
        }

        if(p.rarity > this.maxRarity){
            this.maxRarity = p.rarity;
            if(this.maxRarity > 5){
                this.inventorySpace.h = this.h * .52 - 4 - 24
            }
        }
    }
    removePetalContainer(type, rarity){
        if(this.petalContainers[type][rarity] !== undefined && this.petalContainers[type][rarity].amount >= 2){
            this.petalContainers[type][rarity].amount--;
            this.petalContainers[type][rarity].lastAmountChangedTime = time;
        } else {
            delete this.petalContainers[type][rarity];
            // if(Object.keys(this.petalContainers[type]).length === 0){
            //     delete this.petalContainers[type];
            //     this.recalculateTypeIndexes();
            // }
        }
    }
    removePetalContainerAmount(type, rarity, amount){
        if(this.petalContainers[type][rarity] !== undefined && this.petalContainers[type][rarity].amount >= amount + 1){
            this.petalContainers[type][rarity].amount -= amount;
            this.petalContainers[type][rarity].lastAmountChangedTime = time;
        } else {
            delete this.petalContainers[type][rarity];
            // if(Object.keys(this.petalContainers[type]).length === 0){
            //     delete this.petalContainers[type];
            //     this.recalculateTypeIndexes();
            // }
        }
    }
    recalculateTypeIndexes(){
        this.typeIndexes = {};
        this.typeIndex = 0;
        for(let typeKey in this.petalContainers){
            this.typeIndexes[typeKey] = this.typeIndex++;
        }
    }
    draw(){
        let alpha = this.fadingOut === true ? 1 - (time - this.originalFadeOutTime) / 100 : 1;

        this.drawIcon(alpha);

        // animation stuff here, calling drawInventory but possibly transforming beforehand
        if(this.menuActive === true || (time - this.lastCloseTime) < 160){
            this.drawInventory(alpha);
        } else {
            this.hoveringOverX = false;
        }
    }
    getMainStroke(){
        return this.state === 'crafting' ? '#986c40' : '#603f99';
    }
    getMainFill(){
        return this.state === 'crafting' ? '#da9b5b' : '#895adb'
    }
    getHoverFill(){
        return this.state === 'crafting' ? '#dea56b' : '#956adf'
    }
    drawIcon(){
        ctx.lineWidth = 6;
        ctx.fillStyle = this.getMainFill();
        ctx.strokeStyle = this.getMainStroke();

        ctx.translate(0, -100);

        if(mouse.canvasX + 6 > 20 && mouse.canvasY + 6 > canvas.h - 20 - 80 - 100 && mouse.canvasX - 6 < 20 + 80 && mouse.canvasY - 6 < canvas.h - 20 - 80 + 80 - 100){
            ctx.fillStyle = this.getHoverFill();
            setCursor('pointer');
            this.hoveringOverButton = true;
        } else {
            // if(this.hoveringOverX === false){
            //     document.body.style.cursor = 'auto';
            // }
            this.hoveringOverButton = false;
        }

        ctx.beginPath();
        ctx.roundRect(20, canvas.h - 20 - 80, 80, 80, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.drawImage(this.icon, 20 + 15, canvas.h - 20 - 80 + 15, 80 - 15 * 2, 80 - 15 * 2);

        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.25;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 14px Ubuntu`;
        const lastLetterSpacing = ctx.letterSpacing;
        ctx.letterSpacing = '0px';
        ctx.strokeText("[C]", 20 + 80 - 15 - 2.5, canvas.h - 20 - 80 + 15);
        ctx.fillText("[C]", 20 + 80 - 15 - 2.5, canvas.h - 20 - 80 + 15);
        ctx.letterSpacing = lastLetterSpacing;

        ctx.translate(0, 100);

        if(this.isRainingPetalSlots === true){
            this.renderRainPetalSlots();
        }
    }
    toggleMenu(){
        if(mobGallery.menuActive === true) mobGallery.toggleMenu();
        if(this.menuActive === true){
            this.lastCloseTime = time;
        } else {
            this.lastOpenTime = time;
            if(globalInventory.menuActive === true){
                globalInventory.toggleMenu();
            }
        }
        this.menuActive = !this.menuActive;
        // console.log(this.menuActive);
    }
    drawInventory(alpha = 1) {
        this.render.scroll = interpolate(this.render.scroll, this.scroll, 0.0070 * dt);

        if (alpha !== 1) {
            ctx.globalAlpha = alpha;
        }
        let translation = 0;
        if (time - this.lastCloseTime < 160) {
            translation += this.h * easeOutCubic((time - this.lastCloseTime) / 160);
        }
        if (time - this.lastOpenTime < 160) {
            translation += (this.h + 40) - (this.h + 40) * easeOutCubic((time - this.lastOpenTime) / 160);
        }
        if (translation !== 0) {
            ctx.translate(0, translation);
        }

        ctx.translate(130, canvas.h - this.h - 20);

        // if(time - this.lastCloseTime < 500){
        //     ctx.translate()
        // }
        ctx.fillStyle = this.getMainFill();
        ctx.strokeStyle = this.getMainStroke();
        ctx.lineWidth = 8;

        ctx.beginPath()
        ctx.roundRect(0, 0, this.w, this.h, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3.75;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 32px Ubuntu`;
        ctx.strokeText("Craft", this.w / 2, 29);
        ctx.fillText("Craft", this.w / 2, 29);

        if (this.craftingAnimationState === true) {
            this.runCraftingAnimation();
        }
        if (this.craftingAnimationState === "display") {
            this.displayPetalContainer.x = this.craftingPetalSlotsDimensions.x + this.displayPetalContainer.render.w * .35;
            this.displayPetalContainer.y = this.craftingPetalSlotsDimensions.y + this.displayPetalContainer.render.h * .35;
            this.displayPetalContainer.render.x = this.displayPetalContainer.x;
            this.displayPetalContainer.render.y = this.displayPetalContainer.y;
            this.displayPetalContainer.draw();
            // ctx.fillStyle = '#b17f49';
            // ctx.beginPath();
            // ctx.roundRect(this.displayPetalContainer.x, this.displayPetalContainer.y, this.displayPetalContainer.w, this.displayPetalContainer.h, 8);
            // ctx.fill();
            // ctx.closePath();
        } else {
            for (let i = 0; i < this.craftingPetalSlots.length; i++) {
                // this.craftingPetalSlots[i]
                ctx.fillStyle = '#b17f49';
                ctx.beginPath();
                ctx.roundRect(this.craftingPetalSlots[i].x, this.craftingPetalSlots[i].y, this.craftingPetalSlots[i].w, this.craftingPetalSlots[i].h, 8);
                ctx.fill();
                ctx.closePath();

                if (this.craftingPetalContainers[i] !== undefined) {
                    const pc = this.craftingPetalContainers[i];
                    pc.x = this.craftingPetalSlots[i].x + this.craftingPetalSlots[i].w / 2;
                    pc.y = this.craftingPetalSlots[i].y + this.craftingPetalSlots[i].h / 2;
                    pc.draw();
                }
            }
        }

        if (mouseInBox({ x: mouse.canvasX, y: mouse.canvasY }, { x: this.craftingButton.x - this.craftingButton.w / 2 + 130, y: this.craftingButton.y - this.craftingButton.h / 2 + canvas.h - this.h - 20, w: this.craftingButton.w, h: this.craftingButton.h }) === true && this.craftingAnimationState === false) {
            this.hoveringOverCraftButton = true;
        } else {
            this.hoveringOverCraftButton = false;
        }
        ctx.letterSpacing = "0px";
        let fillcolor = "#777777"
        let strokecolor = "#555555";
        if (this.craftingPetalContainers[0] !== undefined) {// in that case we should make stroke more thicc i think
            if (Colors.rarities[this.craftingPetalContainers[0].rarity + 1]) {
                fillcolor = Colors.rarities[this.craftingPetalContainers[0].rarity + 1].color;
                strokecolor = Colors.rarities[this.craftingPetalContainers[0].rarity + 1].border;

                if (this.hoveringOverCraftButton) {
                    fillcolor = blendColor(fillcolor, "#ffffff", 0.1);
                    strokecolor = blendColor(strokecolor, "#ffffff", 0.03)
                }
            }
        }
        ctx.lineWidth = 7;
        ctx.fillStyle = fillcolor;//this.hoveringOverCraftButton ? this.getHoverFill() : this.getMainFill();
        ctx.strokeStyle = strokecolor; //this.getMainStroke();
        ctx.beginPath();
        ctx.roundRect(this.craftingButton.x - this.craftingButton.w / 2, this.craftingButton.y - this.craftingButton.h / 2, this.craftingButton.w, this.craftingButton.h, 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.25;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 22px Ubuntu`;
        ctx.strokeText("Craft", this.craftingButton.x, this.craftingButton.y);
        ctx.fillText("Craft", this.craftingButton.x, this.craftingButton.y);
        if (this.craftingPetalContainers[0]) {
            ctx.fillStyle = '#f0f0f0';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2.25;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `900 12px Ubuntu`;

            let attempt = this.craftingPetalContainers[0].attempt;
            if (attempt == undefined) {
                attempt = 0;
            }
            let chance = calculateChance(attempt, this.craftingPetalContainers[0].rarity)
            if (this.craftingAnimationTimer > 3000 && this.craftingAnimationData.successAmount > 0) {
                ctx.fillStyle = "#00ff00"
                ctx.strokeText("Success (-" + this.craftingAnimationData.lost + ")", this.craftingButton.x, this.craftingButton.y + 40);
                ctx.fillText("Success (-" + this.craftingAnimationData.lost + ")", this.craftingButton.x, this.craftingButton.y + 40);
            }
            else {
                ctx.strokeText("Attempt " + (attempt + 1), this.craftingButton.x, this.craftingButton.y + 60);
                ctx.fillText("Attempt " + (attempt + 1), this.craftingButton.x, this.craftingButton.y + 60);

                if (this.craftingPetalContainers[0].rarity >= 12){
                    ctx.strokeText(Math.floor(chance * 100) / 100 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                    ctx.fillText(Math.floor(chance * 100) / 100 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                }
                else{
                    ctx.strokeText(Math.floor(chance * 10) / 10 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                    ctx.fillText(Math.floor(chance * 10) / 10 + "% success chance", this.craftingButton.x, this.craftingButton.y + 40);
                }
            }

        }

        if (this.hoveringOverCraftButton === true || this.draggingHorizontalScrollBar === true || this.draggingScrollBar === true || this.hoveringOverHorizontalScrollBar === true || this.hoveringOverScrollBar === true) {
            setCursor('pointer');
        }

        ctx.save();

        // drawing clipping rect
        ctx.beginPath();
        ctx.rect(this.inventorySpace.x, this.inventorySpace.y, this.fillingHorizontal ? this.inventorySpace.w + 24 : this.inventorySpace.w, this.inventorySpace.h);
        ctx.clip();
        ctx.closePath();

        this.firstPetalContainer = null;
        this.lastPetalContainer = null;

        const firstRarityX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * 0 + 3;
        const lastRarityX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * this.maxRarity - 6;
        this.totalPetalWidth = lastRarityX - firstRarityX;

        let maxTypeIndex = 0;
        for (let typeKey in this.petalContainers) {
            for (let i = 0; i <= Math.max(5, this.maxRarity); i++) {
                const rarityKey = i;
                const pcX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * rarityKey + 3 - this.render.horizontalScroll * (this.totalPetalWidth - this.inventorySpace.h);
                const pcY = 5 + this.petalContainerSize / 2 + this.typeIndexes[typeKey] * (this.petalContainerSize + 12) + 5 + this.inventorySpace.y - this.render.scroll * (this.totalPetalHeight - this.inventorySpace.h);
                if (this.typeIndexes[typeKey] > maxTypeIndex) {
                    maxTypeIndex = this.typeIndexes[typeKey];
                }

                // always draw box because y not
                if (this.fillerPetalSlots[typeKey] === undefined) {
                    this.fillerPetalSlots[typeKey] = {};
                }
                if (this.fillerPetalSlots[typeKey][rarityKey] === undefined) {
                    this.fillerPetalSlots[typeKey][rarityKey] = { render: { x: pcX, y: pcY } };
                }

                const fpc = this.fillerPetalSlots[typeKey][rarityKey];
                fpc.x = pcX;
                fpc.y = pcY;
                fpc.render.x = interpolate(fpc.render.x, fpc.x, 0.00672 * dt);
                fpc.render.y = interpolate(fpc.render.y, fpc.y, 0.00672 * dt);
                ctx.fillStyle = '#b17f49';

                if (this.petalContainers[typeKey][rarityKey] === undefined && fpc.render.x + this.petalContainerSize / 2 > this.inventorySpace.x * 0.9 && fpc.render.x + this.petalContainerSize / 2 < (this.inventorySpace.x + this.inventorySpace.w) * 1.2 && fpc.render.y + this.petalContainerSize / 2 > this.inventorySpace.y * 0.9 && fpc.render.y + this.petalContainerSize / 2 < (this.inventorySpace.y + this.inventorySpace.h) * 1.1) {
                    ctx.beginPath();
                    ctx.roundRect(fpc.render.x - this.petalContainerSize / 2, fpc.render.y - this.petalContainerSize / 2, this.petalContainerSize, this.petalContainerSize, 8);
                    ctx.fill();
                    ctx.closePath();
                }

                if (this.petalContainers[typeKey] !== undefined && this.petalContainers[typeKey][rarityKey] !== undefined) {
                    const pc = this.petalContainers[typeKey][rarityKey];
                    pc.x = pcX;
                    pc.y = pcY;

                    if (pc.render.x + pc.w / 2 > this.inventorySpace.x * 0.9 && pc.render.x - pc.w / 2 < (this.inventorySpace.x + this.inventorySpace.w) * 1.1 && pc.render.y + pc.w / 2 > this.inventorySpace.y * 0.9 && pc.render.y - pc.w / 2 < (this.inventorySpace.y + this.inventorySpace.h) * 1.1) {
                        pc.draw();
                    } else {
                        pc.render.x = interpolate(pc.render.x, pc.x, 0.00672 * dt)
                        pc.render.y = interpolate(pc.render.y, pc.y, 0.00672 * dt)
                    }

                    if (this.firstPetalContainer === null) {
                        this.firstPetalContainer = pc;
                    }
                    this.lastPetalContainer = pc;
                } else {
                    if (this.firstPetalContainer === null) {
                        this.firstPetalContainer = fpc;
                    }
                    this.lastPetalContainer = fpc;
                }
                // else {
                //     if(this.fillerPetalSlots[typeKey] === undefined){
                //         this.fillerPetalSlots[typeKey] = {};
                //     }
                //     if(this.fillerPetalSlots[typeKey][rarityKey] === undefined){
                //         this.fillerPetalSlots[typeKey][rarityKey] = {render: {x: pcX, y: pcY}};
                //     }
                //     const fpc = this.fillerPetalSlots[typeKey][rarityKey];
                //     fpc.x = pcX;
                //     fpc.y = pcY;
                //     fpc.render.x = interpolate(fpc.render.x, fpc.x, 0.00672 * dt);
                //     fpc.render.y = interpolate(fpc.render.y, fpc.y, 0.00672 * dt);
                //     ctx.fillStyle = '#b17f49';
                //     ctx.beginPath();
                //     ctx.roundRect(fpc.render.x - this.petalContainerSize/2, fpc.render.y - this.petalContainerSize/2, this.petalContainerSize, this.petalContainerSize, 8);
                //     ctx.fill();
                //     ctx.closePath();
                // }
            }
        }

        // if we're drawing < 5 pcs then draw the extras as boxes
        if (Object.keys(this.petalContainers).length < 5) {
            this.fillingHorizontal = true;
            // const amountMore = 5 - Object.keys(this.petalContainers).length;
            for (let j = Object.keys(this.petalContainers).length; j < 5; j++) {
                const typeKey = "filler" + j;
                for (let i = 0; i <= Math.max(5, this.maxRarity); i++) {
                    const rarityKey = i;
                    const pcX = this.petalContainerSize / 2 + this.inventorySpace.x + (this.petalContainerSize + 12) * rarityKey + 3 - this.render.horizontalScroll * (this.totalPetalWidth - this.inventorySpace.h);
                    const pcY = 5 + this.petalContainerSize / 2 + (maxTypeIndex + j - Object.keys(this.petalContainers).length + 1) * (this.petalContainerSize + 12) + 5 + this.inventorySpace.y - this.render.scroll * (this.totalPetalHeight - this.inventorySpace.h);

                    // draw box
                    if (this.fillerPetalSlots[typeKey] === undefined) {
                        this.fillerPetalSlots[typeKey] = {};
                    }
                    if (this.fillerPetalSlots[typeKey][rarityKey] === undefined) {
                        this.fillerPetalSlots[typeKey][rarityKey] = { render: { x: pcX, y: pcY } };
                    }
                    const fpc = this.fillerPetalSlots[typeKey][rarityKey];
                    fpc.x = pcX;
                    fpc.y = pcY;
                    fpc.render.x = interpolate(fpc.render.x, fpc.x, 0.00672 * dt);
                    fpc.render.y = interpolate(fpc.render.y, fpc.y, 0.00672 * dt);
                    ctx.fillStyle = '#b17f49';
                    ctx.beginPath();
                    ctx.roundRect(fpc.render.x - this.petalContainerSize / 2, fpc.render.y - this.petalContainerSize / 2, this.petalContainerSize, this.petalContainerSize, 8);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        } else {
            this.fillingHorizontal = false;
        }

        if (this.lastPetalContainer !== null) {
            const petalDimensions = {
                start: this.firstPetalContainer.y - this.petalContainerSize / 2 - 6,
                end: this.lastPetalContainer.y + this.petalContainerSize / 2 + 6
            }
            petalDimensions.length = petalDimensions.end - petalDimensions.start;
            this.totalPetalHeight = petalDimensions.length;
        }

        ctx.restore();

        let needsFilter = false;
        for (let i = 0; i < this.fadingPetalContainers.length; i++) {
            if (this.fadingPetalContainers[i].spawnTime < 0.001) {
                this.fadingPetalContainers[i].toRemove = true;
                needsFilter = true;
            }
            this.fadingPetalContainers[i].draw();
        }
        if (needsFilter === true) {
            this.fadingPetalContainers = this.fadingPetalContainers.filter(p => p.toRemove !== true);
        }

        // stroking the rect again so that hte stroke isn't halfway in
        // ctx.fillStyle = this.getMainFill();
        // ctx.strokeStyle = this.getMainStroke();
        // ctx.lineWidth = 8;

        // ctx.save();

        // ctx.beginPath()
        // ctx.roundRect(0, 0, this.w, this.h, 3);
        // ctx.stroke();
        // ctx.closePath();

        if (this.fillingHorizontal === false) {
            this.render.scroll = interpolate(this.render.scroll, this.scroll, 0.0070 * dt);
            if (this.render.scroll < -.1) {
                this.render.scroll = -.1;
            } else if (this.render.scroll > 1.1) {
                this.render.scroll = 1.1;
            }

            this.scrollbar.pos = interpolate(this.scrollbar.start, this.scrollbar.end, this.render.scroll);
            this.scrollbar.bottom = this.scrollbar.pos + this.scrollbar.length / 2;
            this.scrollbar.top = this.scrollbar.pos - this.scrollbar.length / 2;

            this.scrollbar.renderTop = interpolate(this.scrollbar.renderTop, this.scrollbar.top, this.draggingScrollBar ? 0.28 : 0.08);
            this.scrollbar.renderBottom = interpolate(this.scrollbar.renderBottom, this.scrollbar.bottom, this.draggingScrollBar ? 0.28 : 0.08);
        }

        if (this.maxRarity >= 5) {
            this.render.horizontalScroll = interpolate(this.render.horizontalScroll, this.horizontalScroll, 0.0070 * dt);

            this.horizontalScrollBar.pos = interpolate(this.horizontalScrollBar.start, this.horizontalScrollBar.end, this.render.horizontalScroll);
            this.horizontalScrollBar.right = this.horizontalScrollBar.pos + this.horizontalScrollBar.length / 2;
            this.horizontalScrollBar.left = this.horizontalScrollBar.pos - this.horizontalScrollBar.length / 2;

            this.horizontalScrollBar.renderRight = interpolate(this.horizontalScrollBar.renderRight, this.horizontalScrollBar.right, this.draggingHorizontalScrollBar ? 0.28 : 0.08);
            this.horizontalScrollBar.renderLeft = interpolate(this.horizontalScrollBar.renderLeft, this.horizontalScrollBar.left, this.draggingHorizontalScrollBar ? 0.28 : 0.08);
        }

        if (this.scroll < 0) {
            this.scroll = 0;
        } else if (this.scroll > 1) {
            this.scroll = 1;
        }

        // console.log(this.render.scroll);
        ctx.strokeStyle = this.getMainStroke();
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.w - 16, (this.scrollbar.renderTop) /** ((this.h - 82 - 16) / this.h) + 82*/);
        ctx.lineTo(this.w - 16, (this.scrollbar.renderBottom) /** ((this.h - 82 - 16) / this.h) + 82*/);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.horizontalScrollBar.renderRight, this.h - 16 /** ((this.h - 82 - 16) / this.h) + 82*/);
        ctx.lineTo(this.horizontalScrollBar.renderLeft, this.h - 16 /** ((this.h - 82 - 16) / this.h) + 82*/);
        ctx.stroke();
        ctx.closePath();

        if (this.menuActive === true && translation === 0) {
            if (mouse.canvasX > 130 + this.w - 7.5 - 30 - 3 && mouse.canvasY > canvas.h - this.h - 20 + 7.5 + 3 && mouse.canvasX < 130 + this.w - 7.5 - 3 && mouse.canvasY < canvas.h - this.h - 20 + 7.5 + 30 + 3) {
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

        // X rendering
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

        const mouseX = mouse.x * canvas.w / window.innerWidth;
        const mouseY = mouse.y * canvas.h / window.innerHeight;

        if (mouseX > 130 && mouseX < 130 + this.w - 20 && mouseY > canvas.h - this.h - 20 && mouseY < canvas.h - 20) {
            ctx.lastTransform5 = ctx.getTransform();
            for (let typeKey in this.petalContainers) {
                for (let i = 0; i <= this.maxRarity; i++) {
                    if (this.petalContainers[typeKey] === undefined) continue;
                    const rarityKey = i;
                    const pc = this.petalContainers[typeKey][rarityKey];
                    if (pc === undefined) continue;

                    if (pc.render.x + pc.w / 2 > this.inventorySpace.x * 0.9 && pc.render.x - pc.w / 2 < (this.inventorySpace.x + this.inventorySpace.w) * 1.1 && pc.render.y + pc.w / 2 > this.inventorySpace.y * 0.9 && pc.render.y - pc.w / 2 < (this.inventorySpace.y + this.inventorySpace.h) * 1.1) {
                        if (mouseInBox({ x: mouseX, y: mouseY }, { x: pc.render.x - pc.w / 2 + 130, y: pc.render.y - pc.h / 2 + canvas.h - this.h - 20, w: pc.w, h: pc.h }) === true) {
                            pc.isHovered = true;
                        }
                        pc.drawStatsBox();
                    }
                }
            }

            if (this.craftingAnimationState === "display") {
                const pc = this.displayPetalContainer;
                if (mouseInBox({ x: mouseX, y: mouseY }, { x: pc.render.x - pc.w / 2 + 130, y: pc.render.y - pc.h / 2 + canvas.h - this.h - 20, w: pc.w, h: pc.h }) === true) {
                    pc.isHovered = true;
                }
                pc.drawStatsBox();
            } else {
                for (let i = 0; i < this.craftingPetalSlots.length; i++) {
                    if (this.craftingPetalContainers[i] !== undefined) {
                        const pc = this.craftingPetalContainers[i];
                        if (mouseInBox({ x: mouseX, y: mouseY }, { x: pc.render.x - pc.w / 2 + 130, y: pc.render.y - pc.h / 2 + canvas.h - this.h - 20, w: pc.w, h: pc.h }) === true) {
                            pc.isHovered = true;
                        }
                        pc.drawStatsBox();
                    }
                }
            }
            ctx.setTransform(ctx.lastTransform5);
            delete ctx.lastTransform5;
        }

        ctx.translate(-130, -(canvas.h - this.h - 20));

        if (translation !== 0) {
            ctx.translate(0, -translation);
        }
        ctx.globalAlpha = 1;

        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.mouse.x, this.mouse.y, 6, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();

        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.mouse2.x, this.mouse2.y, 6, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();

        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.mouse3.x, this.mouse3.y, 6, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
    }
    updateScroll(/*delta*/{x,y}, {mouseX, mouseY}){
        if(this.menuActive !== true || Object.keys(this.petalContainers).length === 0 || this.fillingHorizontal === true){
            return;
        }
        // console.log(mouseX);
        // if(mouseInBox({x: mouseX, y: mouseY}, {x: 130, y: canvas.h - this.h - 20, w: this.w * 1.12, h: this.h}) === false){
        //     return;
        // }
        if(mouseX < 130 || mouseY < canvas.h - this.h - 20 || mouseX > 130 + this.w || mouseY > canvas.h - 20){
            return;
        }

        const petalDimensions = {
            start: this.firstPetalContainer.y - this.petalContainerSize / 2 - 6,
            end: this.lastPetalContainer.y + this.petalContainerSize / 2 + 6
        }
        petalDimensions.length = petalDimensions.end - petalDimensions.start;

        this.scroll += y / petalDimensions.length;

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
    mouseDown({mouseX, mouseY}, evt){
        // ctx.translate(130, canvas.h - this.h - 20);
        // ctx.moveTo(this.w - 16, (this.scrollbar.renderTop) /** ((this.h - 82 - 16) / this.h) + 82*/);
        // ctx.lineTo(this.w - 16, (this.scrollbar.renderBottom) /** ((this.h - 82 - 16) / this.h) + 82*/);
        // this.mouse = {x: 130 + this.w - 24, y: this.scrollbar.renderTop + canvas.h - this.h - 20}//{x: mouseX, y: mouseY};
        // this.mouse2 = {x: this.mouse.x + 16, y: this.mouse.y + this.scrollbar.length};
        // this.mouse3 = {x: mouseX, y: mouseY};
        if(mouseX > 130 + this.w - 24 && mouseX < 130 + this.w - 24 + 16 && mouseY > this.scrollbar.top + canvas.h - this.h - 20 && mouseY < this.scrollbar.top + canvas.h - this.h - 20 + this.scrollbar.length){
            // console.log('drag');
            this.draggingScrollBar = true;
        } else if(this.maxRarity >= 5 && mouseX > 130 + this.horizontalScrollBar.left && mouseX < 130 + this.horizontalScrollBar.left + this.horizontalScrollBar.length && mouseY > canvas.h - this.h - 20 + this.h - 16 - 16 && mouseY < canvas.h - this.h - 20 + this.h - 16 + 16){
            this.draggingHorizontalScrollBar = true;
        }

        if(this.craftingAnimationState === "display"){
            if(mouseInBox({x: this.mouseX, y: this.mouseY}, {x: this.displayPetalContainer.x - this.displayPetalContainer.w/2 + 130, y: this.displayPetalContainer.y - this.displayPetalContainer.h/2 + canvas.h - this.h - 20, w: this.displayPetalContainer.w, h: this.displayPetalContainer.h}) === true){
                this.displayPetalContainer.isDisplayPetalContainer = false;
                this.displayPetalContainer.toOscillate = false;
                this.displayPetalContainer.angleOffset = 0;
                globalInventory.addPetalContainer(this.displayPetalContainer);
                this.addFadingPetalContainer(this.displayPetalContainer);
                delete this.displayPetalContainer;
                this.craftingAnimationState = false;
                this.craftingAnimationData = {};
            }
            return;
        }

        if(this.craftingAnimationState === true){
            return;
        }

        if(this.hoveringOverCraftButton === true && this.craftingPetalContainers.length === 5){
            if (this.craftingPetalContainers[0]){
                if (this.craftingPetalContainers[0].type == "Token"){
                    return;
                }
            }
            let amount = 0;
            for(let i of this.craftingPetalContainers){
                amount += i.amount;
            }
            send({craft: true, type: this.craftingPetalContainers[4].type, rarity: this.craftingPetalContainers[4].rarity, amount: amount});
            // this.craftingPetalContainers = [];
            this.startCraftingAnimation();
            return;
        }

        for(let i = 0; i < this.craftingPetalContainers.length; i++){
            const pc = this.craftingPetalContainers[i];
            if(mouseInBox({x: mouseX, y: mouseY}, {x: pc.x - pc.w/2 + 130, y: pc.y - pc.h/2 + canvas.h - this.h - 20, w: pc.w, h: pc.h}) === true){
                this.removeCraftingPetalContainers();
            }
        }

        if(mouseInBox({x: mouseX, y: mouseY}, {x: this.inventorySpace.x + 130, y: this.inventorySpace.y - this.h - 20 + canvas.h, w: this.inventorySpace.w, h: this.inventorySpace.h}) === true && this.craftingAnimationState === false){
            for(let typeKey in this.petalContainers){
                for(let rarityKey in this.petalContainers[typeKey]){
                    const pc = this.petalContainers[typeKey][rarityKey];
                    // if(pc.amount < 5){
                    //     continue;
                    // }
                    if(mouseX > pc.x - pc.w/2 + 130 && mouseX < 130 + pc.x + pc.w/2 && mouseY > pc.y - pc.h/2 + canvas.h - this.h - 20 && mouseY < pc.y + pc.h/2 + canvas.h - this.h - 20){
                        // if(evt.shiftKey === true){
                        //     send({craft: true, type: typeKey, rarity: rarityKey, amount: pc.amount});
                        //     this.removePetalContainerAmount(typeKey, rarityKey, pc.amount);
                        // } else {
                        //     send({craft: true, type: typeKey, rarity: rarityKey, amount: 5});
                        //     this.removePetalContainerAmount(typeKey, rarityKey, 5);
                        // }
                        this.addCraftingPetalContainers(typeKey, rarityKey, evt.shiftKey === true ? pc.amount : Math.min(pc.amount, 5), pc.attempt);
                    }
                }
            }
        }
    }
    addCraftingPetalContainers(type, rarity, amount, attempt){
        if(type === 'Basic' && rarity == 0){
            return;
        }
        if(this.craftingAnimationState === "display"){
            return;
        }
        const amountPerSlot = Math.floor(amount / 5);
        const leftOvers = amount - amountPerSlot * 5;

        const preexistingType = this.craftingPetalContainers[0] !== undefined ? this.craftingPetalContainers[0].type : 'NULL';
        
        if(amountPerSlot === 0 && type !== preexistingType){
            for(let i = 0; i < 5; i++){
                if(!(leftOvers > i) && this.craftingPetalContainers[i] === undefined){
                    return;
                }
            }
        }

        let preexistingAmount = 0;
        for(let i = 0; i < this.craftingPetalContainers.length; i++){
            if(this.craftingPetalContainers[i] !== undefined){
                preexistingAmount++;
            }
        }

        // if they're not the same type and amount is less than 5 then return
        if(preexistingType !== type && amount < 5){
            return;
        } else if(preexistingType === type && preexistingAmount + amount < 5){
            return;
        }

        const lastPetalContainer = this.petalContainers[type][rarity];
        // send({craft: true, type, rarity, amount: amount});
        if(!(this.craftingPetalContainers[0] && preexistingType === type && (this.craftingPetalContainers[0] ?? {rarity: -1}).rarity === rarity)){
            for(let i = 0; i < globalInventory.petalContainers[rarity].length; i++){
                const pc = globalInventory.petalContainers[rarity][i];
                if(pc.type === type){
                    globalInventory.removePetalContainerAmount(pc.rarity, i, amount);//removePetalContainerAmount(rarity, indexInRarity, amount){
                    break;
                }
            }
        }

        for(let i = 0; i < 5; i++){
            if(this.craftingPetalContainers[i] !== undefined){
                // this.addPetalContainer(this.craftingPetalContainers[i]);
                if(this.craftingPetalContainers[i].type === type && this.craftingPetalContainers[i].rarity == rarity){
                    this.craftingPetalContainers[i].amount += amountPerSlot + (leftOvers > i);
                    // if(amountPerSlot + (leftOvers - i) > 0){
                    //     this.craftingPetalContainers[i].lastAmountChangedTime = performance.now();
                    // }
                } else {
                    globalInventory.addPetalContainer(this.craftingPetalContainers[i]);
                    this.addFadingPetalContainer(this.craftingPetalContainers[i]);
                    this.craftingPetalContainers[i] = new PetalContainer(lastPetalContainer.petals, {...lastPetalContainer, w: 65, h: 65}, Math.random(), amountPerSlot + (leftOvers > i), attempt);
                }
            } else {
                this.craftingPetalContainers[i] = new PetalContainer(lastPetalContainer.petals, {...lastPetalContainer, w: 65, h: 65}, Math.random(), amountPerSlot + (leftOvers > i), attempt);
            }
        }
    }
    removeCraftingPetalContainers(){
        if(this.craftingPetalContainers.length === 0){
            return;
        }
        for(let i = 0; i < this.craftingPetalContainers.length; i++){
            this.addFadingPetalContainer(/*new PetalContainer(this.craftingPetalContainers[i].petals.map(p => new Petal(p)), {...this.craftingPetalContainers[i]}, -Math.random(), 1)*/this.craftingPetalContainers[i]);
        }

        let amount = 0;
        for(let i = 0; i < this.craftingPetalContainers.length; i++){
            amount += this.craftingPetalContainers[i].amount;
        }
        this.craftingPetalContainers[0].amount = amount;
        
        globalInventory.addPetalContainer(this.craftingPetalContainers[0]);
        this.craftingPetalContainers = [];
    }
    startCraftingAnimation(){
        this.craftingAnimationState = true;
        this.craftingAnimationTimer = 0;
    }
    runCraftingAnimation(){
        this.craftingAnimationTimer += dt;
        for(let i = 0; i < 5; i++){
            const angle = this.craftingAnimationTimer / 150 + Math.PI * 2 * i / 5;
            const radius = this.craftingPetalSlotsDimensions.radius * Math.sin(this.craftingAnimationTimer / 300);
            this.craftingPetalSlots[i].x = this.craftingPetalSlotsDimensions.x + Math.cos(angle) * radius;
            this.craftingPetalSlots[i].y = this.craftingPetalSlotsDimensions.y + Math.sin(angle) * radius;

            this.craftingPetalContainers[i].render.x = this.craftingPetalSlots[i].x + this.craftingPetalSlots[i].w/2;
            this.craftingPetalContainers[i].x = this.craftingPetalSlots[i].x + this.craftingPetalSlots[i].w/2;
            this.craftingPetalContainers[i].render.y = this.craftingPetalSlots[i].y + this.craftingPetalSlots[i].h/2;
            this.craftingPetalContainers[i].y = this.craftingPetalSlots[i].y + this.craftingPetalSlots[i].h/2;
        }

        // divisible by 150 so radius should be ~0
        if(this.craftingAnimationTimer > 3000 && this.craftingAnimationData !== undefined){
            if(this.craftingAnimationData.successAmount > 0){
                this.craftingAnimationState = "display";
                this.displayPetalContainer = new PetalContainer(new Array(this.craftingAnimationData.petalData.petalAmount).fill(new Petal(this.craftingAnimationData.petalData.petal)), {...this.craftingAnimationData.petalData, toOscillate: true, w: 65, h: 65}, Math.random(), this.craftingAnimationData.successAmount);
                this.startRainingPetalSlots(new PetalContainer(new Array(this.craftingAnimationData.petalData.petalAmount).fill(new Petal(this.craftingAnimationData.petalData.petal)), {...this.craftingAnimationData.petalData, toOscillate: true, w: 65, h: 65}, Math.random(), this.craftingAnimationData.successAmount));
                this.displayPetalContainer.angleOffset /= 3;
                this.displayPetalContainer.isDisplayPetalContainer = true;
                this.displayPetalContainer.w = 85;
                this.displayPetalContainer.h = 85;
                this.displayPetalContainer.render.w = 85;
                this.displayPetalContainer.render.h = 85;

                for(let i = 0; i < this.craftingPetalContainers.length; i++){
                    if(i >= this.craftingAnimationData.amountRemaining){
                        // remove petal container
                        this.craftingPetalContainers[i].toRemove = true;
                        this.craftingPetalContainers[i].attempt  = this.craftingAnimationData.attempt;
                    } else {
                        this.craftingPetalContainers[i].amount = 1;
                        this.craftingPetalContainers[i].attempt  = this.craftingAnimationData.attempt;
                    }
                }
                if (this.petalContainers[this.craftingPetalContainers[0].type][this.craftingPetalContainers[0].rarity]){
                    this.petalContainers[this.craftingPetalContainers[0].type][this.craftingPetalContainers[0].rarity].attempt = this.craftingAnimationData.attempt;
                }
                this.craftingPetalContainers = this.craftingPetalContainers.filter(p => p.toRemove !== true);
            } else {
                // go straight to the normal phase where there's only a few petal containers left (1-4)
                this.craftingAnimationState = false;
                // console.log(this.craftingAnimationData.amountRemaining, this.craftingPetalContainers.length);
                for(let i = 0; i < this.craftingPetalContainers.length; i++){
                    if(i >= this.craftingAnimationData.amountRemaining){
                        // remove petal container
                        this.addFadingPetalContainer(this.craftingPetalContainers[i]);
                        this.craftingPetalContainers[i].toRemove = true;
                        this.craftingPetalContainers[i].attempt  = this.craftingAnimationData.attempt;
                    } else {
                        this.craftingPetalContainers[i].amount = 1;
                        this.craftingPetalContainers[i].attempt  = this.craftingAnimationData.attempt;
                    }
                }
                this.craftingPetalContainers = this.craftingPetalContainers.filter(p => p.toRemove !== true);
            }

            this.craftingPetalSlots = [];
            for(let i = 0; i < 5; i++){
                const angle = Math.PI * 2 * i / 5 - Math.PI / 2;
                this.craftingPetalSlots.push({
                    x: this.craftingPetalSlotsDimensions.x + Math.cos(angle) * this.craftingPetalSlotsDimensions.radius,
                    y: this.craftingPetalSlotsDimensions.y + Math.sin(angle) * this.craftingPetalSlotsDimensions.radius,
                    w: 65,
                    h: 65
                })
            }
        }
    }
    processCraftResults(successAmount, amountRemaining, petalData, attempt, lost){
        this.craftingAnimationData = {successAmount, amountRemaining, petalData, attempt, lost};
        // console.log(this.craftingAnimationData.attempt);
    }
    addFadingPetalContainer(p){
        this.fadingPetalContainers.push(new PetalContainer(p.petals.map(pInit => new Petal(pInit)), {...p}, Math.random(), p.amount));
        this.fadingPetalContainers[this.fadingPetalContainers.length-1].collectTime = performance.now();
    }
    startRainingPetalSlots(pc){
        if (window.petalRain == false){
            return;
        }
        this.isRainingPetalSlots = true;
        const rarityToRainSettings = {
            0: {
                amount: 3,
            },
            1: {
                amount: 7
            },
            2: {
                amount: 15
            },
            3: {
                amount: 30
            },
            4: {
                amount: 56
            },
            5: {
                amount: 82
            },
            6: {
                amount: 120
            },
            7: {
                amount: 200
            },
            8: {
                amount: 200
            },
            9: {
                amount: 200
            },
            10: {
                amount: 200
            },
            11: {
                amount: 200
            },
            12: {
                amount: 200
            }
        };
        let rainAmountLeft = rarityToRainSettings[pc.rarity-1].amount * Math.ceil(Math.sqrt(pc.amount));
        this.rainInterval = setInterval(() => {
            rainAmountLeft--;
            if(rainAmountLeft < 0){
                clearInterval(this.rainInterval);
                delete this.rainInterval;
                // this.isRainingPetalSlots = false;
                return;
            }
            this.rainingPetalSlots.push(this.spawnRainPetalSlot(pc));
        }, 10);
    }
    spawnRainPetalSlot(pc){
        const newPc = new PetalContainer(pc.petals.map(p => new Petal(p)), {...pc}, Math.random(), pc.amount);
        newPc.toOscillate = true;
        newPc.toSkipCulling = true;//toSkipCulling
        newPc.isDisplayPetalContainer = true;
        newPc.renderAnimationTimer = 0;
        newPc.y = canvas.h//canvas.w - newPc.w / 2 //+ newPc.w * Math.sqrt(2);
        newPc.render.y = newPc.y;
        newPc.x = canvas.w / 2 + (Math.random() * 2 - 1) * canvas.w * .4;
        newPc.render.x = newPc.x;

        newPc.angleOffset = - Math.PI * 2 + (Math.random() * 2 - 1) * Math.PI * .2;
        newPc.angleOffsetVel = Math.sqrt((Math.random() * 2 - 1) * .03);

        const shootAngle = Math.PI * 0.5 + (Math.random() * 2 - 1) * Math.PI * .6;
        // console.log(shootAngle);
        newPc.xv = Math.cos(shootAngle) * 3;
        newPc.yv = -Math.sin(shootAngle) * 10;
        return newPc;
    }
    simulateRainPetalSlot(pc){
        pc.angleOffset += pc.angleOffsetVel;

        pc.x += pc.xv;
        pc.y += pc.yv;
        pc.yv += 0.03;
        if(pc.y > canvas.height + pc.w * Math.sqrt(2) && pc.yv > 0){
            pc.toRemove = true;
        }
    }
    renderRainPetalSlots(){
        for(let i = 0; i < this.rainingPetalSlots.length; i++){
            this.rainingPetalSlots[i].draw();
            // ctx.beginPath();
            // ctx.fillStyle = 'red';
            // ctx.arc(this.rainingPetalSlots[i].render.x, this.rainingPetalSlots[i].render.y, 30, 0, Math.PI * 2);
            // ctx.fill();
            // ctx.closePath();
            this.simulateRainPetalSlot(this.rainingPetalSlots[i]);
        }
        this.rainingPetalSlots = this.rainingPetalSlots.filter(p => p.toRemove !== true);
        if(this.rainingPetalSlots.length === 0 && this.rainInterval === undefined){
            this.isRainingPetalSlots = false;
        }
    }
    mouseUp({mouseX, mouseY}){
        this.draggingScrollBar = false;
        this.draggingHorizontalScrollBar = false;
    }
    mouseMove({mouseX, mouseY}){
        this.hoveringOverHorizontalScrollBar = false;
        this.hoveringOverScrollBar = false;
        
        if(this.draggingScrollBar === true){
            this.scroll = (mouseY - (canvas.h - this.h - 20) - this.scrollbar.start) / (this.scrollbar.end - this.scrollbar.start);
            if(this.scroll < 0){
                this.scroll = 0;
            } else if(this.scroll > 1){
                this.scroll = 1;
            }
        } else if(this.draggingHorizontalScrollBar === true){
            this.horizontalScroll = (mouseX - (130) - this.horizontalScrollBar.start) / (this.horizontalScrollBar.end - this.horizontalScrollBar.start);
            if(this.horizontalScroll < 0){
                this.horizontalScroll = 0;
            } else if(this.horizontalScroll > 1){
                this.horizontalScroll = 1;
            }
        } else {
            // hover effect
            if(mouseX > 130 + this.w - 24 && mouseX < 130 + this.w - 24 + 16 && mouseY > this.scrollbar.top + canvas.h - this.h - 20 && mouseY < this.scrollbar.top + canvas.h - this.h - 20 + this.scrollbar.length){
                // console.log('drag');
                this.hoveringOverScrollBar = true;
            } else if(this.maxRarity >= 5 && mouseX > 130 + this.horizontalScrollBar.left && mouseX < 130 + this.horizontalScrollBar.left + this.horizontalScrollBar.length && mouseY > canvas.h - this.h - 20 + this.h - 16 - 16 && mouseY < canvas.h - this.h - 20 + this.h - 16 + 16){
                this.hoveringOverHorizontalScrollBar = true;
            }
        }
    }
}

function mouseInBox({x,y}/*mouse*/, box={x,y,w,h}){
    if(x > box.x + box.w || y > box.y + box.h)return false;
    if(x < box.x || y < box.y)return false;
    return true;
}
