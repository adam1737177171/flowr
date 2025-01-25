class LevelBar {
    constructor(){
        this.xp = 0;
        this.level = 0;// decimal

        this.calculateDimensions();

        this.hasInit = false;

        this.render = {xp: this.xp, level: this.level, initAnimation: 0};
    }
    calculateDimensions(){
        this.dimensions = {
            x: canvas.w * .80,
            y: canvas.h * .94,
            w: canvas.w * (.17 + .04/2),
            h: canvas.h * .04,
            roundness: canvas.w,// more than enough to trigger max roundness
            innerPadding: 4
        }
    }
    init(xp){
        this.xp = xp;
        this.level = levelPerXp(this.xp);
        this.hasInit = true;
        this.render.xp = this.xp;
    }
    addXp(xp){
        if(window.automaticallyLeaveFlag === true) return;
        // when an enemy dies
        this.xp += xp;
        this.level = levelPerXp(this.xp);
    }
    getPetalSlotsNumber(){
        let petalSlots = basePetalSlots;
        for(let i = 0; i < petalSlotThresholds.length; i++){
            if((this.level+1) >= petalSlotThresholds[i]){
                petalSlots++;
            } else {
                break;
            }
        }
        return petalSlots;
    }
    draw(){
        if(this.hasInit === true){
            this.render.initAnimation = interpolate(this.render.initAnimation, 1, 0.04);
        }
        if(this.render.initAnimation < 0.999){
            ctx.translate(0, (1-this.render.initAnimation) * canvas.h * .18);
        }

        this.render.xp = interpolate(this.render.xp, this.xp, 0.04);
        this.render.level = levelPerXp(this.render.xp);

        if(this.dimensions.w < this.dimensions.h) return;

        // this.level += .001;
        ctx.beginPath();
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.roundRect(this.dimensions.x, this.dimensions.y, this.dimensions.w, this.dimensions.h, this.dimensions.roundness);
        ctx.fill();
        ctx.closePath();

        if(this.render.level % 1 < .1){
            ctx.globalAlpha = Math.max(0,(this.render.level % 1) * 9.5 + 0.05);
        }

        ctx.fillStyle = '#e2eb67';
		ctx.beginPath();
		ctx.roundRect(this.dimensions.x + this.dimensions.innerPadding, this.dimensions.y + this.dimensions.innerPadding, this.dimensions.h + (this.dimensions.w - this.dimensions.h) * (this.render.level % 1) - this.dimensions.innerPadding * 2, this.dimensions.h - this.dimensions.innerPadding * 2, this.dimensions.roundness);
		ctx.fill();
		ctx.closePath();

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.25;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 18px Ubuntu`;

        let levelText = `Lvl ${Math.ceil(this.render.level)} Flower`;
        
        // if(this.render.level % 1 > .95 /*&& this.render.level > 45*/){
        //     levelText += ` (${Math.floor((this.render.level % 1) * 100)}% there)`;
        // }
        ctx.strokeText(levelText, this.dimensions.x + (this.dimensions.w) / 2, this.dimensions.y + this.dimensions.h / 2);
        ctx.fillText(levelText, this.dimensions.x + (this.dimensions.w) / 2, this.dimensions.y + this.dimensions.h / 2);
        
        if (mouse.canvasX > this.dimensions.x && mouse.canvasY > this.dimensions.y){
            let levelReqText = `${formatAmountHighPrecision(levelBar.xp)}/${formatAmountHighPrecision(xpPerLevel(Math.ceil(levelPerXp(levelBar.xp))))} xp`;
            let hp = formatAmountHighPrecision(Stats.hpPerLevel(this.render.level));
            ctx.strokeText(levelReqText +" | "+hp+" hp", this.dimensions.x + (this.dimensions.w) / 2, this.dimensions.y / 1.035 + this.dimensions.h / 2);
            ctx.fillText(levelReqText +" | "+hp+" hp", this.dimensions.x + (this.dimensions.w) / 2, this.dimensions.y / 1.035 + this.dimensions.h / 2);
        }
        if(this.render.initAnimation < 0.999){
            ctx.translate(0, -(1-this.render.initAnimation) * canvas.h * .18);
        }
    }
}

const levelBar = new LevelBar();