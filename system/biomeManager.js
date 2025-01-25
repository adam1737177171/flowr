//const { DirectoryChannel } = require("discord.js");

let initBiomeIndex = localStorage.getItem("lastBiome");
if(initBiomeIndex === null){
    initBiomeIndex = 0;
}

class BiomeManager {
    constructor(){
        this.biomeOrder = [...Object.keys(Colors.biomes)]//.filter(a => a !== 'ocean');

        this.currentBiome = parseInt(initBiomeIndex) ?? 0;
        if(this.currentBiome >= this.biomeOrder.length) this.currentBiome = 0;

        this.arrowOscilTimer = 0;

        // this.drawLeftArrow = false;
        // this.drawRightArrow = true;
        this.drawLeftArrow = this.biomeOrder[this.currentBiome - 1] !== undefined;
        this.drawRightArrow = this.biomeOrder[this.currentBiome + 1] !== undefined;

        if(!window.showCommunityBiomes){
            this.drawRightArrow = this.currentBiome + 1 < officialBiomes.length;
        }

        this.hoveringLeftArrow = false;
        this.hoveringRightArrow = false;

        this.transitionTime = 400;
        this.transitionAnimationTimer = this.transitionTime;

        this.lastDirectionPressed = 'right';

        this.arrowMargin = 11;
        this.arrowSize = 1773 * .032;

        this.updateArrowDimensions();

        this.fadeTimer = 1;
        this.fadeState = 'in';
    }
    fadeOut(){
        this.fadeState = 'out';
    }
    fadeIn(){
        this.fadeState = 'in';
    }
    updateArrowDimensions(){
        this.rightArrow = {
            x: canvas.w - canvas.w * .03 - canvas.w * .032,
            y: canvas.h/2 - canvas.w * .032/2,
            w: canvas.w * .032,
            h: canvas.w * .032
        }

        this.leftArrow = {
            x: canvas.w * .03,
            y: canvas.h/2 - canvas.w * .032/2,
            w: canvas.w * .032,
            h: canvas.w * .032
        }
    }
    // generateTileImages(){
    //     const nextBiomeInd = (this.currentBiome+1) % this.biomeOrder.length;
    //     let previousBiomeInd = (this.currentBiome-1) % this.biomeOrder.length;
    //     if(previousBiomeInd < 0){
    //         previousBiomeInd += this.biomeOrder.length;
    //     }

    //     const nextBiome = this.biomeOrder[nextBiomeInd];
    //     const previousBiome = this.biomeOrder[previousBiomeInd];

    //     this.leftTileImage = new Image();
    //     this.rightTileImage = new Image();
        
    //     const canv = document.createElement('canvas');
    //     canv.width = window.innerWidth / canvas.zoom;
    //     canv.height = window.innerHeight / canvas.zoom;
    //     const cx = canv.getContext('2d');
    //     const lastCtx = ctx;

    //     ctx = cx;
    //     // ctx.setTransform(lastCtx.getTransform());
    //     ctx.fillStyle = Colors.biomes[previousBiome].background;
    //     ctx.strokeStyle = Colors.biomes[previousBiome].grid;
    //     renderBg();
    //     this.leftTileImage = canv;

    //     const canv2 = document.createElement('canvas');
    //     canv2.width = window.innerWidth / canvas.zoom;
    //     canv2.height = window.innerHeight / canvas.zoom;
    //     const cx2 = canv.getContext('2d');
    //     ctx = cx2;
    //     // ctx.setTransform(lastCtx.getTransform());
    //     ctx.fillStyle = Colors.biomes[nextBiome].background;
    //     ctx.strokeStyle = Colors.biomes[nextBiome].grid;
    //     renderBg();
    //     this.rightTileImage = canv2;

    //     ctx = lastCtx;
    // }
    // generateArrowImage(img, direction){
    //     const canv = document.createElement('canvas');
    //     const cx = canv.getContext('2d');
    //     canv.width = this.arrowSize;
    //     canv.height = this.arrowSize;

    //     cx.fillStyle = '#b8b8b8';
    //     cx.strokeStyle = '#b8b8b8';

    //     cx.lineWidth = this.arrowMargin * 2;

    //     cx.translate(canv.width/2, canv.height/2);
    //     cx.scale((this.arrowSize + this.arrowMargin) / this.arrowSize, (this.arrowSize + this.arrowMargin) / this.arrowSize);
    //     cx.translate(-canv.width/2 + this.arrowMargin, -canv.height/2 + this.arrowMargin);

    //     if(direction === 'right'){
    //         cx.beginPath();
    //         cx.moveTo(this.arrowSize, this.arrowSize / 2);
    //         cx.lineTo(0,0);
    //         cx.lineTo(0, this.arrowSize);
    //         cx.lineTo(this.arrowSize, this.arrowSize/2);
    //         cx.stroke();
    //         cx.fill();
    //         cx.closePath();
    //     } else if(direction === 'left'){
    //         cx.beginPath();
    //         cx.moveTo(0, this.arrowSize / 2);
    //         cx.lineTo(this.arrowSize,0);
    //         cx.lineTo(this.arrowSize, this.arrowSize);
    //         cx.lineTo(0, this.arrowSize/2);
    //         cx.stroke();
    //         cx.fill();
    //         cx.closePath();
    //     }

    //     img.src = cx;
    // }
    draw(){
        if(window.loaded !== true){
            return;
        }

        if(this.fadeState === 'in'){
            this.fadeTimer+=dt/160;
            if(this.fadeTimer > 1){
                this.fadeTimer = 1;
            }
        } else if(this.fadeState === 'out'){
            this.fadeTimer-=dt/100;
            if(this.fadeTimer < 0){
                this.fadeTimer = 0;
            }
        }

        if(window.squadUIEnabled === true && this.fadeState === 'in'){
            this.fadeOut();
        } else if(window.squadUIEnabled !== true && this.fadeState === 'out'){
            this.fadeIn();
        }

        this.drawBiomeSwitchArrows(smoothstep(this.fadeTimer));
    }
    drawBiomeSwitchArrows(alpha=1){
        this.transitionAnimationTimer += dt;
        
        if(this.fadeState === 'out'){
            this.hoveringRightArrow = false;
            this.hoveringLeftArrow = false;
        }
        if(alpha === 0){
            return;
        }
        ctx.globalAlpha = alpha;
        this.arrowOscilTimer += dt;

        let renderOscil = Math.sin(this.arrowOscilTimer / 200) * 6;

        const nextBiomeInd = (this.currentBiome+1) % this.biomeOrder.length;
        let previousBiomeInd = (this.currentBiome-1) % this.biomeOrder.length;
        if(previousBiomeInd < 0){
            previousBiomeInd += this.biomeOrder.length;
        }

        const nextBiome = this.biomeOrder[nextBiomeInd];
        const previousBiome = this.biomeOrder[previousBiomeInd];

        ctx.strokeStyle = '#b8b8b8';

        ctx.lineWidth = 12;

        if(this.drawRightArrow === true){
            ctx.save();
            // ctx.globalAlpha = 1//this.hoveringRightArrow ? 0.8 : 0.4;
            ctx.beginPath();
            ctx.moveTo(renderOscil + this.rightArrow.x + this.rightArrow.w, this.rightArrow.y + this.rightArrow.h/2);
            ctx.lineTo(renderOscil + this.rightArrow.x, this.rightArrow.y);
            ctx.lineTo(renderOscil + this.rightArrow.x, this.rightArrow.y + this.rightArrow.h);
            ctx.lineTo(renderOscil + this.rightArrow.x + this.rightArrow.w, this.rightArrow.y + this.rightArrow.h/2);

            // ctx.stroke();
            // ctx.fill();
            ctx.clip();
            ctx.closePath();

            // ctx.drawImage(this.rightTileImage, 0, 0);
            ctx.fillStyle = Colors.biomes[nextBiome].background;
            ctx.strokeStyle = Colors.biomes[nextBiome].grid;
            renderBg();

            ctx.restore();

            // if(this.hoveringRightArrow === true){
                ctx.globalAlpha = 0.4 * alpha//this.hoveringRightArrow ? 0.8 : 0.4;
                ctx.setLineDash([30, 30]);
                ctx.lineDashOffset = -performance.now() / 12;

                ctx.beginPath();
                ctx.moveTo(renderOscil + this.rightArrow.x + this.rightArrow.w, this.rightArrow.y + this.rightArrow.h/2);
                ctx.lineTo(renderOscil + this.rightArrow.x, this.rightArrow.y);
                ctx.lineTo(renderOscil + this.rightArrow.x, this.rightArrow.y + this.rightArrow.h);
                ctx.lineTo(renderOscil + this.rightArrow.x + this.rightArrow.w, this.rightArrow.y + this.rightArrow.h/2);

                ctx.stroke();
                ctx.closePath();

                ctx.setLineDash([]);
                ctx.globalAlpha = alpha;
            // }
        }
        
        if(this.drawLeftArrow === true){
            ctx.save();
            ctx.globalAlpha = alpha//this.hoveringRightArrow ? 0.8 : 0.4;
            ctx.beginPath();
            ctx.moveTo(-renderOscil + this.leftArrow.x, this.leftArrow.y + this.leftArrow.h/2);
            ctx.lineTo(-renderOscil + this.leftArrow.x + this.leftArrow.w, this.leftArrow.y);
            ctx.lineTo(-renderOscil + this.leftArrow.x + this.leftArrow.w, this.leftArrow.y + this.leftArrow.h);
            ctx.lineTo(-renderOscil + this.leftArrow.x, this.leftArrow.y + this.leftArrow.h/2);

            // ctx.stroke();
            // ctx.fill();
            ctx.clip();
            ctx.closePath();

            // ctx.drawImage(this.leftTileImage, 0, 0);
            ctx.fillStyle = Colors.biomes[previousBiome].background;
            ctx.strokeStyle = Colors.biomes[previousBiome].grid;
            renderBg();

            ctx.restore();

            // if(this.hoveringLeftArrow === true){
                ctx.globalAlpha = 0.4 * alpha//this.hoveringLeftArrow ? 0.8 : 0.4;
                ctx.setLineDash([30, 30]);
                ctx.lineDashOffset = -performance.now() / 12;

                ctx.beginPath();
                ctx.moveTo(-renderOscil + this.leftArrow.x, this.leftArrow.y + this.leftArrow.h/2);
                ctx.lineTo(-renderOscil + this.leftArrow.x + this.leftArrow.w, this.leftArrow.y);
                ctx.lineTo(-renderOscil + this.leftArrow.x + this.leftArrow.w, this.leftArrow.y + this.leftArrow.h);
                ctx.lineTo(-renderOscil + this.leftArrow.x, this.leftArrow.y + this.leftArrow.h/2);

                ctx.stroke();
                ctx.closePath();

                ctx.setLineDash([]);
                ctx.globalAlpha = alpha;
            // }
        }

        ctx.globalAlpha = 1;
    }
    mouseDown({mouseX, mouseY}){
        if(this.fadeTimer === 0){
            return;
        }
        if(this.drawRightArrow && mouseInBox({x: mouseX, y: mouseY}, this.rightArrow) === true){
            this.lastBiome = this.currentBiome;
            this.currentBiome++;
            this.lastDirectionPressed = 'right';
            this.updateBiome();
        } else if(this.drawLeftArrow && mouseInBox({x: mouseX, y: mouseY}, this.leftArrow) === true){
            this.lastBiome = this.currentBiome;
            this.currentBiome--;
            this.lastDirectionPressed = 'left';
            this.updateBiome();
        }
    }
    switchToBiome(biomeName){
        // switching to our current biome
        if(biomeName === this.biomeOrder[this.currentBiome]){
            return;
        }

        let index = null;
        for(let i = 0; i < this.biomeOrder.length; i++){
            if(this.biomeOrder[i] === biomeName){
                index = i;
                break;
            }
        }

        if(index === null){
            return;
        }

        this.lastBiome = this.currentBiome;
        this.currentBiome = index;
        this.lastDirectionPressed = this.current > this.lastBiome ? 'right' : 'left';
        this.updateBiome();
    }
    mouseMove({mouseX, mouseY}){
        if(this.fadeTimer === 0){
            return;
        }
        this.hoveringRightArrow = false;
        this.hoveringLeftArrow = false;
        if(this.drawRightArrow && mouseInBox({x: mouseX, y: mouseY}, this.rightArrow) === true){
            this.hoveringRightArrow = true;
        } else if(this.drawLeftArrow && mouseInBox({x: mouseX, y: mouseY}, this.leftArrow) === true){
            this.hoveringLeftArrow = true;
        }
    }
    updateBiome(){
        mobGallery.toRegenerate = true;
        this.transitionAnimationTimer = 0;
        this.drawLeftArrow = this.biomeOrder[this.currentBiome - 1] !== undefined;
        this.drawRightArrow = this.biomeOrder[this.currentBiome + 1] !== undefined;

        if(!window.showCommunityBiomes){
            this.drawRightArrow = this.currentBiome + 1 < officialBiomes.length;
        }

        for(let i = 0; i < menuEnemies.length; i++){
            menuEnemies[i].updatedBiome = false;
        }

        menuInventory.updateBiome();

        localStorage.setItem("lastBiome", this.currentBiome);
    }
    getCurrentBiomeData(){
        return {
            ratio: Math.min(1, this.transitionAnimationTimer / this.transitionTime),
            last: this.biomeOrder[this.lastBiome],
            current: this.biomeOrder[this.currentBiome],
            direction: this.lastDirectionPressed
        }
    }
    getCurrentBiome(){
        return this.biomeOrder[this.currentBiome];
    }
}

const biomeManager = new BiomeManager();