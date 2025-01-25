let savedStartingWave = localStorage.getItem('startingWave');// can be null
if(typeof savedStartingWave === 'string') savedStartingWave = parseInt(savedStartingWave);
if (isNaN(savedStartingWave)){
    savedStartingWave = 1;
}

const outsidePadding = 16;
const playerPadding = 10;
const buttonPadding = 10;
class SquadUI {
    constructor(){
        this.clients = [];
        this.w = 446;
        this.h = 0;
        this.minimizedHeight = 46;
        this.baseHeight = this.h;//this.h;
        this.minimized = true;

        this.initRenderTimer = 0;

        this.hoveringOverX = false;
        this.hoveringOverPublic = false;
        this.hoveringOverNew = false;
        this.hoveringOverPrivate = false;
        this.hoveringOverQuickJoin = false;
        this.hoveringOverJoinMainPvp = false;

        this.public = true;

        this.selfId = null;

        this.startingWaveSlider = 1;
        this.desiredSWS = 1;
        this.draggingSlider = false;
        this.maxStartingWave = 1;
        this.startingWave = this.maxStartingWave;

        this.isCustomCode = false;
        this.is1v1 = false;
    }
    reset(){
        this.clients = [];
        this.is1v1 = false;
        this.hoveringOverX = false;
        this.hoveringOverPublic = false;
        this.hoveringOverNew = false;
        this.hoveringOverPrivate = false;
        this.hoveringOverQuickJoin = false;
        this.hoveringOverJoinMainPvp = false;

        this.public = true;

        delete this.lastUnMinimizedTimer;
        delete window.squadUICloseTime;
        delete this.selfIdSentFlag;

        this.h = 0;
    }
    removeAllClients(){
        this.clients = [];
    }
    startGame(){
        this.hoveringOverX = false;
        this.hoveringOverPublic = false;
        this.hoveringOverNew = false;
        this.hoveringOverPrivate = false;
        this.hoveringOverQuickJoin = false;
        this.hoveringOverJoinMainPvp = false;

        this.clients = [];
        this.h = 0;
        this.minimized = true;
        window.squadUIEnabled = false;
    }
    recieveData(init){
        this.selfId = init.selfId;
        // console.log(init);
        // ss
        // return {
        //     clients: this.clients.map(c => {
        //         return {name: c.name, id: c.id};
        //     })
        // }
        // for(let i = 0; i < init.clients.length; i++){
        //     if(this.clients[i] === undefined){
        //         this.clients[i] = {};
        //     }
        //     this.clients[i].name = init.clients[i].name;
        //     this.clients[i].id = init.clients[i].id;
        // }
        // this.clients = init.clients;
        for(let i = 0; i < init.clients.length; i++){
            this.addClient(init.clients[i]);
            // if(this.clients[i] === undefined){
            //     this.clients[i] = this.createClient();
            // }
            // if(this.clients[i].ready !== init.clients[i].ready){
            //     if(this.clients[i].ready === true){
            //         // fade out
            //         this.clients[i].lastReadyDisableTime = performance.now();
            //     } else {
            //         // fade in
            //         this.clients[i].lastReadyEnableTime = performance.now();
            //     }
            // }
            // for(let key in init.clients[i]){
            //     this.clients[i][key] = init.clients[i][key];
            // }
            // // console.log(init.clients[i]);
            // if(init.clients[i].petals){
            //     this.updateFlowerPetals(init.clients[i].petals, this.clients[i].id);
            // }
            
            // console.log({[i]:this.clients[i].petals});
        }

        if(this.clients.length > init.clients.length){
            for(let i = 0; i < this.clients.length; i++){
                if(init.clients[i] === undefined){
                    this.clients[i].removed = true;
                }
            }
            this.clients = this.clients.filter(c => c.removed !== true);
        }

        if(init.public === false){
            this.public = false;
            biomeManager.switchToBiome(init.biome);
        } else {
            this.public = true;
        }

        // update
        if(savedStartingWave !== null){
            this.desiredSWS = savedStartingWave / this.maxStartingWave;
        }
        
    }
    updateFlowerPetals(data, id){
        if(id === this.selfId){
            if(this.selfIdSentFlag === true){
                return;
            }
            if(data.length > 0){
                this.selfIdSentFlag = true;
            }
        }
        let cid;
        let client;
        for(let i = 0; i < this.clients.length; i++){
            if(this.clients[i].id === id){
                client = this.clients[i];
                cid = i;
            }
        }
        if(client === undefined){
            return;
        }
        const f = client.flower;

        f.lastPetals = f.petals;
        f.petals = [];
        const playerWidth = (this.w - playerPadding * 3 - outsidePadding * 2) / 4;
        f.render.headX = canvas.w / 2 - this.w/2 + outsidePadding + cid * (playerWidth + playerPadding) + playerWidth / 2;
        f.render.headY = canvas.h / 2 + this.h / 2 + 35 - 9;
        f.headX = f.render.headX;
        f.headY = f.render.headY;
        f.x = f.render.headX;
        f.y = f.render.headY;
        f.render.x = f.x;
        f.render.y = f.y;
        f.render.baseX = f.x;
        f.render.baseY = f.y;
        f.baseX = f.x;
        f.baseY = f.y;
        // f.fastAngleInitTimer = performance.now();

        for(let i = 0; i < data.length; i++){
            const petal = f.petals[i] = new Petal(data[i]);
            petal.distance = neutralPetalDistance;
            petal.render.distance = 0;
            petal.updateInterpolate(f);
            petal.x = f.baseX;
            petal.y = f.baseY;
            petal.render.x = petal.x;
            petal.render.y = petal.y;
            petal.slowInterpolateDistance = true;
            if(f.lastPetals[i] !== undefined){
                // petal.render.angle = f.lastPetals[i].render.angle;
                // petal.render.distance = f.lastPetals[i].render.distance;
                for(let key in f.lastPetals[i].render){
                    petal.render[key] = f.lastPetals[i].render[key];
                }
                petal.angle = petal.render.angle;
            }
        }

        this.updateFlowerPetalContainers(f);

        delete f.lastPetals;
    }
    updateFlowerPetalContainers(f){
        f.petalContainers = []//f.petalContainers.filter(pc => pc.toPreserve === true);
        let petalsInContainer = [];
        for(let i = 0; i < f.petals.length; i++){
            //petals, {x,y,w,h,originalX,originalY,radius,toOscillate,isDragging,lastSlot}, id, amount, attempt
            // console.log(f.petals[i].subStackedId, f.petalContainers);
            if(f.petals[i].subId > 0 && f.petals[i].subStackedId === 0){
                f.petalContainers[f.petalContainers.length-1].petals.push(new Petal(f.petals[i]));
                continue;
            }
            petalsInContainer.push(f.petals[i]);
            if(f.petals[i].subStackedId === 0){
                f.petalContainers.push(new PetalContainer(petalsInContainer.map(p => new Petal(p)), {x: 0, y: 0, w: 20, h: 20, originalX: 0, originalY: 0, radius: 100, toRenderText: false, toOscillate: false}, Math.random(), 1));
                petalsInContainer = [];

                const lastPC = f.petalContainers[f.petalContainers.length-1];
                for(let i = 0; i < lastPC.petals.length; i++){
                    lastPC.petals[i].angle = 0;
                    lastPC.petals[i].selfAngle = 0;
                }
                // if(!(i > lastPetalContainerLen)){
                //     lastPC.spawnAnimation = 1;
                // }
            }
        }
    }
    updateSelfFlowerPetals(menuInvPack/*= menuInventory.pack()*/){
        // for selfId
        const client = this.findClient(this.selfId);
        const f = client.flower;
        if(client === undefined || f === undefined) return;
        f.petals = [];

        // plan: recreate server petal id system (stuff with like parentPetalId, petalContainerId, etc.)
        // and add those petals to the flower and then position petal slots the same way we do server side (crude implementation)

        for(let key in menuInvPack.top){
            const pc = menuInvPack.top[key];
            for(let i = 0; i < pc.petals.length; i++){
                const data = {...pc.petals[i]};
                delete data.insidePetalContainer;
                data.petalContainerId = key;
                if(multiPetals[data.type] !== undefined){// if this is a petal like light which has separated petals
                    data.subId = i;
                } else if(pc.petals.length > 1) {// if this is a petal like stinger which has connected petals
                    data.subStackedId = i;
                    data.subId = i;

                    data.offset = {};
                    data.offset.angle = data.subStackedId / pc.petals.length * Math.PI * 2;
                    data.offset.distance = data.radius;
                }
                f.petals.push(new Petal(data));
                const petal = f.petals[f.petals.length-1];
                petal.distance = neutralPetalDistance;
                petal.render.distance = 0;
                petal.updateInterpolate(f);
                petal.x = f.baseX;
                petal.y = f.baseY;
                petal.render.x = petal.x;
                petal.render.y = petal.y;
                petal.slowInterpolateDistance = true;
            }
        }

        for(let key in menuInvPack.bottom){
            const pc = menuInvPack.bottom[key];
            for(let i = 0; i < pc.petals.length; i++){
                const data = {...pc.petals[i]};
                delete data.insidePetalContainer;
                data.petalContainerId = key;
                if(multiPetals[data.type] !== undefined){// if this is a petal like light which has separated petals
                    data.subId = i;
                } else if(pc.petals.length > 1) {// if this is a petal like stinger which has connected petals
                    data.subStackedId = i;
                    data.subId = i;

                    data.offset = {};
                    data.offset.angle = data.subStackedId / pc.petals.length * Math.PI * 2;
                    data.offset.distance = data.radius;
                }
                f.petals.push(new Petal(data));
                const petal = f.petals[f.petals.length-1];
                petal.distance = neutralPetalDistance;
                petal.render.distance = 0;
                petal.updateInterpolate(f);
                petal.x = f.baseX;
                petal.y = f.baseY;
                petal.render.x = petal.x;
                petal.render.y = petal.y;
                petal.slowInterpolateDistance = true;
            }
        }

        // positioning petal slots
        const totalGroupedPetalsLength = f.petals.filter(p => p.subStackedId === 0).length;

        const randomAngle = Math.random() * Math.PI * 2;
		let index = 0;
        for(let i = 0; i < f.petals.length; i++){
            if(f.petals[i].subStackedId === 0){
                index++;
            }
            f.petals[i].id = i;
            f.petals[i].angle = index / totalGroupedPetalsLength * Math.PI * 2;
            f.petals[i].render.angle = randomAngle;
            f.petals[i].angleOffset = f.petals[i].angle;
        }

        this.updateSelfFlowerPetalContainers(f);
    }
    updateSelfFlowerPetalContainers(f){
        const pcs = Object.values(menuInventory.topPetalContainers).concat(Object.values(menuInventory.bottomPetalContainers));

        f.petalContainers = pcs.map(p => new PetalContainer(p.petals, {x: 0, y: 0, w: 20, h: 20, originalX: 0, originalY: 0, radius: 100, toRenderText: false, toOscillate: false}, Math.random(), 1, 0));
    }
    startSliderDrag(x){
        this.draggingSlider = true;
        this.updateSliderDrag(x);
    }
    intersectingSlider({x,y}){
        let ind = 0;
        for(let i = 0; i < this.clients.length; i++){
            if(this.clients[i].id === this.selfId){
                ind = i;
                break;
            }
        }
        ind = Math.min(3, ind);

        const playerWidth = (this.w - playerPadding * 3 - outsidePadding * 2) / 4;

        const sbounds = this.isCustomCode === true ? {
            x: canvas.w / 2 - this.w/2 + outsidePadding,
            y: canvas.h / 2 + 30 + outsidePadding,
            w: this.w - outsidePadding * 4.8,
            h: this.h - outsidePadding * 2
        } : {
            x: canvas.w / 2 - this.w/2 + outsidePadding + ind * (playerWidth + playerPadding) + 5,
            y: canvas.h / 2 + 35 + this.h * 0.15 + Math.max(0, this.h * 0.65 - 22),
            w: playerWidth - 5 * 2,
            h: (this.h * 0.03 + 34) * 2 + 6
        }

        const sliderX = interpolate(sbounds.x, sbounds.x + sbounds.w, this.startingWaveSlider);

        const sliderPos = {
            x: sliderX,
            y: sbounds.y + sbounds.h / 2
        }

        return (x - sliderPos.x) ** 2 + (y - sliderPos.y) ** 2 < 15 ** 2;
    }
    intersectingSliderBound({x,y}){
        let ind = 0;
        for(let i = 0; i < this.clients.length; i++){
            if(this.clients[i].id === this.selfId){
                ind = i;
                break;
            }
        }
        ind = Math.min(3, ind);


        const playerWidth = (this.w - playerPadding * 3 - outsidePadding * 2) / 4;

        const sbounds = this.isCustomCode === true ? {
            x: canvas.w / 2 - this.w/2 + outsidePadding,
            y: canvas.h / 2 + 30 + outsidePadding,
            w: this.w - outsidePadding * 4.8,
            h: this.h - outsidePadding * 2
        } : {
            x: canvas.w / 2 - this.w/2 + outsidePadding + ind * (playerWidth + playerPadding) + 5,
            y: canvas.h / 2 + 35 + this.h * 0.15 + Math.max(0, this.h * 0.65 - 22),
            w: playerWidth - 5 * 2,
            h: (this.h * 0.03 + 34) * 2 + 6
        }

        const sliderX = interpolate(sbounds.x, sbounds.x + sbounds.w, this.startingWaveSlider);

        const sliderPos = {
            x: sliderX,
            y: sbounds.y + sbounds.h / 2
        }

        let closestSliderX = x;
        if(closestSliderX < sbounds.x) closestSliderX = sbounds.x;
        if(closestSliderX > sbounds.x + sbounds.w) closestSliderX = sbounds.x + sbounds.w;

        return (x - closestSliderX) ** 2 + (y - sliderPos.y) ** 2 < 15 ** 2;
    }
    updateSliderDrag(x){
        let ind = 0;
        for(let i = 0; i < this.clients.length; i++){
            if(this.clients[i].id === this.selfId){
                ind = i;
                break;
            }
        }
        ind = Math.min(3, ind);


        const playerWidth = (this.w - playerPadding * 3 - outsidePadding * 2) / 4;
        const sbounds = this.isCustomCode === true ? {
            x: canvas.w / 2 - this.w/2 + outsidePadding,
            w: this.w - outsidePadding * 4.8,
        } : {
            x: canvas.w / 2 - this.w/2 + outsidePadding + ind * (playerWidth + playerPadding) + 5,
            w: playerWidth - 5 * 2,
        }
        let difX = x - sbounds.x;
        if(difX < 0){
            difX = 0;
        } else if(difX > sbounds.w){
            difX = sbounds.w;
        }

        this.desiredSWS = difX / sbounds.w;
    }
    endSliderDrag(x){
        if(this.draggingSlider === false) return;
        this.updateSliderDrag(x);
        // send msg
        const startingWave = Math.max(1, Math.ceil(this.desiredSWS * this.maxStartingWave));
        send({sw: startingWave});
        this.draggingSlider = false;

        if(startingWave !== this.maxStartingWave){
            localStorage.setItem('startingWave', startingWave);
            savedStartingWave = startingWave;
        } else {
            localStorage.removeItem('startingWave');
            savedStartingWave = null;
        }
    }
    sendSavedStartingWave(){
        if(savedStartingWave === null) return;
        send({sw: savedStartingWave});
    }
    render(dt){
        this.is1v1 = (biomeManager !== undefined && biomeManager.getCurrentBiome() === '1v1');
        let offset = window.usernames === true ? 20 : 0
        if(this.clients.length === 0){
            this.minimized = true;
            this.baseHeight = this.minimizedHeight;
        } else if(this.isCustomCode === false){
            if(this.minimized === true){
                this.lastUnMinimizedTimer = performance.now();
            }
            this.baseHeight = 280 + offset;
            // this.h = this.minimizedHeight;
            this.minimized = false;
        }
        this.buttonAlpha = 1;
        if(this.initRenderTimer < 180){
            this.initRenderTimer += dt;
            this.h = Math.max(0.01,this.baseHeight * easeOutCubic(this.initRenderTimer / 180));
        }
        if(performance.now() - this.lastUnMinimizedTimer < 160){
            this.h = this.minimizedHeight + offset + (280 - this.minimizedHeight) * easeOutCubic((performance.now() - this.lastUnMinimizedTimer) / 160);
            this.baseHeight = this.h;
        }
        if(window.squadUICloseTime !== undefined){
            if(performance.now() - window.squadUICloseTime < 180){
                this.buttonAlpha = Math.max(0, this.h / this.baseHeight);
                this.h = (1 - easeOutCubic((performance.now() - window.squadUICloseTime) / 180)) * this.baseHeight;
            } else {
                this.buttonAlpha = 0;
                delete window.squadUICloseTime;
                this.initRenderTimer = 0;
                window.squadUIEnabled = false;
            }
        }
        
        ctx.fillStyle = '#689ed6';
        ctx.strokeStyle = '#537fac';
        ctx.lineWidth = 5;
        
        ctx.beginPath();
        ctx.roundRect(canvas.w / 2 - this.w/2, canvas.h / 2 + 30, this.w, this.is1v1 === true ? (this.h-this.minimizedHeight) * (280-72)/280 + this.minimizedHeight : this.h, 0);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        const ratio = Math.max(0,Math.min(1, this.h / this.baseHeight));

        if(this.isCustomCode === true){
            // draw big sw slider
            // if(this.minimized !== true){
                this.startingWaveSlider = interpolate(this.startingWaveSlider, this.desiredSWS, 0.22);
                // ctx.fillStyle = '#689ed6';
                // ctx.strokeStyle = '#537fac';
                ctx.lineWidth = 5;
    
                // const sbounds = {
                //     x: canvas.w / 2 - this.w / 2 * 0.8,
                //     y: canvas.h / 2 + this.h - 18 * this.h / 280,
                //     w: this.w * 0.8,
                //     h: this.h * 0.1
                // };
    
                let ind = 0;
                for(let i = 0; i < this.clients.length; i++){
                    if(this.clients[i].id === this.selfId){
                        ind = i;
                        break;
                    }
                }
                ind = Math.min(3, ind);
    
    
                const sbounds = {
                    x: canvas.w / 2 - this.w/2 + outsidePadding,
                    y: canvas.h / 2 + 30 + outsidePadding,
                    w: this.w - outsidePadding * 4.8,
                    h: this.h - outsidePadding * 2
                }
    
                const sliderX = interpolate(sbounds.x, sbounds.x + sbounds.w, this.startingWaveSlider);
    
                const sliderPos = {
                    x: sliderX,
                    y: sbounds.y + sbounds.h / 2
                }
    
                ctx.fillStyle = '#689ed6';
                ctx.strokeStyle = '#537fac';
                ctx.beginPath();
                ctx.moveTo(sbounds.x, sbounds.y + sbounds.h / 2);
                ctx.lineTo(sbounds.x + sbounds.w, sbounds.y + sbounds.h / 2);
                ctx.stroke();
                ctx.closePath();
    
                ctx.beginPath();
                ctx.arc(sliderX, sbounds.y + sbounds.h / 2, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
    
                // hover effect
                if((mouse.canvasX - sliderPos.x) ** 2 + (mouse.canvasY - sliderPos.y) ** 2 < 15 ** 2){
                    ctx.fillStyle = 'white';
                    ctx.globalAlpha = 0.1;
                    ctx.beginPath();
                    ctx.arc(sliderX, sbounds.y + sbounds.h / 2, 12 + ctx.lineWidth / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                    ctx.globalAlpha = 1;
        
                    this.hoveringOverSlider = true;
                } else if(this.draggingSlider === true){
                    ctx.fillStyle = 'white';
                    ctx.globalAlpha = 0.1;
                    ctx.beginPath();
                    ctx.arc(sliderX, sbounds.y + sbounds.h / 2, 12 + ctx.lineWidth / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                    ctx.globalAlpha = 1;
                }
    
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.letterSpacing = "-.05px";
                ctx.lineWidth = 3;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `900 14px 'Ubuntu'`;
                this.startingWave = Math.max(1, Math.ceil(this.maxStartingWave * this.startingWaveSlider));

                ctx.globalAlpha = this.h / this.baseHeight;
                ctx.strokeText('Starting Wave: ' + this.startingWave, sbounds.x + sbounds.w / 2, sbounds.y + 19.5)
                ctx.fillText('Starting Wave: ' + this.startingWave, sbounds.x + sbounds.w / 2, sbounds.y + 19.5)
                ctx.globalAlpha = 1;
                
                // ctx.beginPath();
                // ctx.roundRect(canvas.w / 2 - this.w/2 * 0.8, canvas.h / 2 + this.h - 18 * this.h / 280, this.w * 0.8, this.h * 0.1);
                // ctx.fill();
                // ctx.stroke();
                // ctx.closePath();
            // }
            
            // x in the corner

            // rectangle
            ctx.fillStyle = '#c1565e';
            ctx.strokeStyle = '#90464b';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30, canvas.h / 2 + 30 + 7.5, 30, 30 * ratio, 3);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // the actual x
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#cccccc';
            ctx.beginPath();
            ctx.moveTo(canvas.w / 2 + this.w / 2 - 7.5 - 30 + 7.5, canvas.h / 2 + 30 + 7.5 * ratio + 7.5);
            ctx.lineTo(canvas.w / 2 + this.w / 2 - 7.5 - 7.5, canvas.h / 2 + 30 + 7.5 * ratio - 7.5 + 15 + 15 * ratio);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(canvas.w / 2 + this.w / 2 - 7.5 - 7.5, canvas.h / 2 + 30 + 7.5 * ratio + 7.5);
            ctx.lineTo(canvas.w / 2 + this.w / 2 - 7.5 - 30 + 7.5, canvas.h / 2 + 7.5 * ratio - 7.5 + 15 + 30 + 15 * ratio);
            ctx.stroke();
            ctx.closePath();

            // hover effect
            this.hoveringOverX = false;
            if(mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 && mouse.canvasY > canvas.h / 2 + 30 + 7.5 && mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 && mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio){
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - ctx.lineWidth/2, canvas.h / 2 + 30 + 7.5 - ctx.lineWidth/2, 30 + ctx.lineWidth, 30 * ratio + ctx.lineWidth, 3);
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;

                this.hoveringOverX = true;
            }
            return;
        }

        if(this.desiredSWS > 1 || this.startingWaveSlider > 1){
            this.desiredSWS = Math.min(1, this.desiredSWS);
            this.startingWaveSlider = Math.min(1, this.startingWaveSlider);
        }

        const playerWidth = (this.w - playerPadding * 3 - outsidePadding * 2) / 4;

        const now = performance.now();

        ctx.globalAlpha = this.buttonAlpha;

        // drawing bg
        if(this.is1v1 === true) ctx.translate(playerWidth + playerPadding, 0);
        for(let i = 0; i < Math.max(this.is1v1 === true ? 2 : 4, this.clients.length); i++){
            if(this.minimized === true)continue;
            ctx.fillStyle = '#689ed6';
            ctx.strokeStyle = '#537fac';
            ctx.lineWidth = 5;// tbd

            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding), canvas.h / 2 + 35 + this.h * 0.15, playerWidth, Math.max(0, this.h * 0.65 - 22), 1);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            if(this.clients[i] !== undefined){
                if(now - this.clients[i].creationTime < 400){
                    ctx.globalAlpha = this.buttonAlpha * easeOutCubic((now - this.clients[i].creationTime) / 400);
                    ctx.translate(0, -(1-easeOutCubic((now - this.clients[i].creationTime) / 400)) * this.h * 0.1);
                }
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.letterSpacing = "-.05px";
                ctx.lineWidth = 3;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `900 ${18 * ratio}px 'Ubuntu'`;
                
                const clientName = this.clients[i].name === '' ? 'Unnamed' : this.clients[i].name;
                let clientUser = this.clients[i].username === '' ? 'undefined' : this.clients[i].username

                let textWidth = ctx.measureText(clientName).width;
                if(textWidth > playerWidth - playerPadding * 2){
                    ctx.font = `900 ${18 * ratio * (playerWidth - playerPadding * 2) / textWidth}px 'Ubuntu'`;
                    ctx.lineWidth = 4 * (playerWidth - playerPadding * 2) / textWidth
                }

                ctx.globalAlpha = this.buttonAlpha * 0.8;
                ctx.strokeText(clientName, canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth / 2, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.05);
                ctx.globalAlpha = this.buttonAlpha * 1;
                ctx.fillText(clientName, canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth / 2, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.05);
                
                if (window.usernames === true) {
                    textWidth = ctx.measureText(clientUser).width;
                    if (textWidth > playerWidth - playerPadding * 2) {
                        ctx.font = `900 ${14 * ratio * (playerWidth - playerPadding * 2) / textWidth}px 'Ubuntu'`;
                        ctx.lineWidth = 4 * (playerWidth - playerPadding * 2) / textWidth
                    }
                    ctx.fillStyle = "#cccccc"

                    ctx.globalAlpha = this.buttonAlpha * 0.8;
                    ctx.strokeText(clientUser, canvas.w / 2 - this.w / 2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth / 2, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.05 + 18);
                    ctx.globalAlpha = this.buttonAlpha * 1;
                    ctx.fillText(clientUser, canvas.w / 2 - this.w / 2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth / 2, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.05 + 18);
                }

                ctx.globalAlpha = this.buttonAlpha * 1;
                if(now - this.clients[i].creationTime < 400){
                    ctx.translate(0, (1 - easeOutCubic((now - this.clients[i].creationTime) / 400)) * this.h * 0.1);
                }
            }
        }

        ctx.globalAlpha = 1;

        window.camera.disableCulling = true;

        // drawing flowers after in a sep loop
        for(let i = 0; i < Math.max(4, this.clients.length); i++){
            if(this.minimized === true || this.clients[i] === undefined)continue;
            const f = this.clients[i].flower;

            // petal boxes
            const bounds = {
                x: canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding),
                y: canvas.h / 2 + 35 + this.h * 0.15 + 22 + offset,
                w: playerWidth,
                h: this.h * 0.6 - 22
            }
            const petalContainersPerRow = 4;

            const petalContainerSize = 20;
            const petalContainerPadding = 2;
            const XEdgePadding = 5;
            const totalVertical = Math.floor((f.petalContainers.length-1) / 4);
            // const lastHorizontalLength = f.petalContainers[i].length - Math.floor(f.petalContainers[i].length / 4) * 4;
            let renderIndex = 0;
            for(let i = 0; i < f.petalContainers.length; i++){
                // not rendering stuff directly under the flower
                while([9,10,13,14,/*17,18*/].includes(renderIndex)){
                    renderIndex++;
                }
                const pc = f.petalContainers[i];

                const verticalIndex = Math.floor(renderIndex / 4);

                pc.y = bounds.y + petalContainerSize / 2 + petalContainerPadding + (petalContainerSize + petalContainerPadding) * verticalIndex;
                pc.x = XEdgePadding + petalContainerSize / 2 + bounds.x + (renderIndex % petalContainersPerRow) * (petalContainerSize + petalContainerPadding);
                pc.render.x = pc.x;
                pc.render.y = pc.y;
                pc.spawnAnimation = 1;

                pc.draw();

                renderIndex++;
            }

            

            f.petalContainers = f.petalContainers.filter(p => p.collectTime === null || performance.now() - p.collectTime < 300);
            
            // flower
            f.render.headX = canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth / 2;
            f.render.headY = canvas.h / 2 + this.h / 2 + 35 - 9 + offset - (window.usernames === true ? 7.5 : 0);;
            f.headX = f.render.headX;
            f.headY = f.render.headY;
            f.x = f.render.headX;
            f.y = f.render.headY;
            f.render.x = f.x;
            f.render.y = f.y;
            f.render.baseX = f.x;
            f.render.baseY = f.y;
            f.baseX = f.x;
            f.baseY = f.y;
            f.petalRotation += petalRotateSpeed / 40 * dt;
            
            ctx.translate(f.render.headX, f.render.headY);
            ctx.scale(.8,.8);
            ctx.translate(-f.render.headX, -f.render.headY);
            if(this.is1v1 === true) f.angle = Math.atan2(mouse.canvasY - f.render.headY, mouse.canvasX - (playerWidth + playerPadding) - f.render.headX);
            else f.angle = Math.atan2(mouse.canvasY - f.render.headY, mouse.canvasX - f.render.headX);
            if(mouseInBox({x: mouse.canvasX - (this.is1v1 ? (playerWidth + playerPadding) : 0), y: mouse.canvasY}, bounds)){
                // f.petalAlpha = .2;
                if(f.petalAlpha === undefined){
                    f.petalAlpha = 1;
                }
                f.petalAlpha -= dt / 300;
                if(f.petalAlpha < 0.37){
                    f.petalAlpha = 0.37;
                }
            } else if (f.petalAlpha !== undefined) {
                f.petalAlpha += dt / 300;
                if(f.petalAlpha > 1){
                    delete f.petalAlpha;
                }
            }
            
            f.draw();
            // delete f.petalAlpha;
            ctx.translate(f.render.headX, f.render.headY);
            ctx.scale(1.25,1.25);
            ctx.translate(-f.render.headX, -f.render.headY);

            // starting waves
            if(this.clients[i].id !== this.selfId && this.is1v1 === false){
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.letterSpacing = "-.05px";
                ctx.lineWidth = 3;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `900 10px 'Ubuntu'`;
                const startingWave = Math.max(1, Math.ceil(this.clients[i].startingWave));
                const swTextPos = {
                    x: canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth / 2,
                    y: canvas.h / 2 + 35 + this.h * 0.15 + Math.max(0, this.h * 0.65 - 22) - 12
                }
                ctx.strokeText('Starting Wave: ' + startingWave, swTextPos.x, swTextPos.y);
                ctx.fillText('Starting Wave: ' + startingWave, swTextPos.x, swTextPos.y);
            }


            // drawing check / ready signal
            if(this.clients[i].ready === true || (now - this.clients[i].lastReadyDisableTime < 600)){
                ctx.beginPath();
                ctx.translate(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth - 15 - 7.5, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.6 - 15 - 7.5 - 12);
                ctx.translate(7.5, 7.5);
                if(now - this.clients[i].lastReadyEnableTime < 600){
                    const animationTime = easeOutCubic((now - this.clients[i].lastReadyEnableTime) / 600);
                    ctx.rotate(Math.PI * 2 * animationTime);
                    ctx.globalAlpha = this.buttonAlpha * animationTime;
                }
                if(now - this.clients[i].lastReadyDisableTime < 600){
                    const animationTime = 1 - easeOutCubic((now - this.clients[i].lastReadyDisableTime) / 600);
                    ctx.rotate(-Math.PI * 2 * animationTime);
                    ctx.globalAlpha = this.buttonAlpha * animationTime;
                }

                ctx.moveTo(-7.5, .5);
                ctx.lineTo(-3.5, 7.5);
                ctx.lineTo(7.5, -7.5);
                
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.strokeStyle = '#1dd129';
                ctx.lineWidth = 2;
                ctx.stroke();

                if(now - this.clients[i].lastReadyDisableTime < 600){
                    const animationTime = 1 - easeOutCubic((now - this.clients[i].lastReadyDisableTime) / 600);
                    ctx.rotate(Math.PI * 2 * animationTime);
                    ctx.globalAlpha = this.buttonAlpha * 1;
                }
                if(now - this.clients[i].lastReadyEnableTime < 600){
                    const animationTime = easeOutCubic((now - this.clients[i].lastReadyEnableTime) / 600);
                    ctx.rotate(-Math.PI * 2 * animationTime);
                    ctx.globalAlpha = this.buttonAlpha * 1;
                }
                ctx.translate(-7.5, -7.5);
                // ctx.moveTo(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth - 30 - 7.5, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.6 - 30 - 7.5 + 15);
                // ctx.lineTo(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth - 30 - 7.5 + 15, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.6 - 30 - 7.5 + 30);
                // ctx.lineTo(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth - 30 - 7.5 - 15, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.6 - 30 - 7.5);

                // ctx.roundRect(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth - 30 - 7.5, canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.6 - 30 - 7.5, 30, 30);
                ctx.translate(-(canvas.w / 2 - this.w/2 + outsidePadding + i * (playerWidth + playerPadding) + playerWidth - 15 - 7.5), -(canvas.h / 2 + 35 + this.h * 0.15 + this.h * 0.6 - 15 - 7.5 - 12));
                ctx.closePath();
            }
        }
        if(this.is1v1 === true) ctx.translate(-playerWidth - playerPadding, 0);

        delete window.camera.disableCulling;

        ctx.globalAlpha = this.buttonAlpha;

        // starting wave
        if(this.minimized !== true && this.is1v1 === false){
            this.startingWaveSlider = interpolate(this.startingWaveSlider, this.desiredSWS, 0.22);
            // ctx.fillStyle = '#689ed6';
            // ctx.strokeStyle = '#537fac';
            ctx.lineWidth = 5;

            // const sbounds = {
            //     x: canvas.w / 2 - this.w / 2 * 0.8,
            //     y: canvas.h / 2 + this.h - 18 * this.h / 280,
            //     w: this.w * 0.8,
            //     h: this.h * 0.1
            // };

            let ind = 0;
            for(let i = 0; i < this.clients.length; i++){
                if(this.clients[i].id === this.selfId){
                    ind = i;
                    break;
                }
            }
            ind = Math.min(3, ind);


            const sbounds = {
                x: canvas.w / 2 - this.w/2 + outsidePadding + ind * (playerWidth + playerPadding) + 5,
                y: canvas.h / 2 + 35 + this.h * 0.15 + Math.max(0, this.h * 0.65 - 22),
                w: playerWidth - 5 * 2,
                h: (this.h * 0.03 + 34) * 2 + 6
            }

            const sliderX = interpolate(sbounds.x, sbounds.x + sbounds.w, this.startingWaveSlider);

            const sliderPos = {
                x: sliderX,
                y: sbounds.y + sbounds.h / 2
            }

            ctx.fillStyle = '#689ed6';
            ctx.strokeStyle = '#537fac';
            ctx.beginPath();
            ctx.moveTo(sbounds.x, sbounds.y + sbounds.h / 2);
            ctx.lineTo(sbounds.x + sbounds.w, sbounds.y + sbounds.h / 2);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(sliderX, sbounds.y + sbounds.h / 2, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            // hover effect
            if((mouse.canvasX - sliderPos.x) ** 2 + (mouse.canvasY - sliderPos.y) ** 2 < 15 ** 2){
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.arc(sliderX, sbounds.y + sbounds.h / 2, 12 + ctx.lineWidth / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.globalAlpha = 1;
    
                this.hoveringOverSlider = true;
            } else if(this.draggingSlider === true){
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.arc(sliderX, sbounds.y + sbounds.h / 2, 12 + ctx.lineWidth / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.globalAlpha = 1;
            }

            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.letterSpacing = "-.05px";
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `900 14px 'Ubuntu'`;
            this.startingWave = Math.max(1, Math.ceil(this.maxStartingWave * this.startingWaveSlider));
            ctx.strokeText('Starting Wave: ' + this.startingWave, sbounds.x + sbounds.w / 2, sbounds.y + 17)
            ctx.fillText('Starting Wave: ' + this.startingWave, sbounds.x + sbounds.w / 2, sbounds.y + 17)
            
            // ctx.beginPath();
            // ctx.roundRect(canvas.w / 2 - this.w/2 * 0.8, canvas.h / 2 + this.h - 18 * this.h / 280, this.w * 0.8, this.h * 0.1);
            // ctx.fill();
            // ctx.stroke();
            // ctx.closePath();
        }

        // x in the corner - rectangle edition
        ctx.fillStyle = '#c1565e';
        ctx.strokeStyle = '#90464b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30, canvas.h / 2 + 30 + 7.5, 30, 30 * ratio, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // the actual x
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#cccccc';
        ctx.beginPath();
        ctx.moveTo(canvas.w / 2 + this.w / 2 - 7.5 - 30 + 7.5, canvas.h / 2 + 30 + 7.5 * ratio + 7.5);
        ctx.lineTo(canvas.w / 2 + this.w / 2 - 7.5 - 7.5, canvas.h / 2 + 30 + 7.5 * ratio - 7.5 + 15 + 15 * ratio);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(canvas.w / 2 + this.w / 2 - 7.5 - 7.5, canvas.h / 2 + 30 + 7.5 * ratio + 7.5);
        ctx.lineTo(canvas.w / 2 + this.w / 2 - 7.5 - 30 + 7.5, canvas.h / 2 + 7.5 * ratio - 7.5 + 15 + 30 + 15 * ratio);
        ctx.stroke();
        ctx.closePath();

        // hover effect
        this.hoveringOverX = false;
        if(mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 && mouse.canvasY > canvas.h / 2 + 30 + 7.5 && mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 && mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio){
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - ctx.lineWidth/2, canvas.h / 2 + 30 + 7.5 - ctx.lineWidth/2, 30 + ctx.lineWidth, 30 * ratio + ctx.lineWidth, 3);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;

            this.hoveringOverX = true;
        }

        // buttons
        ctx.letterSpacing = "-.05px";
        ctx.font = `900 ${16 * ratio}px 'Ubuntu'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const newButtonWidth = ctx.measureText('New').width;

        ctx.fillStyle = '#689ed6';
        ctx.strokeStyle = '#537fac';
        ctx.lineWidth = 5;

        // create new room
        ctx.beginPath();
        ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5, canvas.h / 2 + 30 + 7.5, 30 + newButtonWidth, 30 * ratio, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.fillStyle = '#f0f0f0';
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 4;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = newButtonWidth * 0.08866826452;// 3 at max

        // ctx.globalAlpha = 0.8;
        ctx.strokeText('New', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 7.5 - 30 + (30 + newButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);
        // ctx.globalAlpha = 1;
        ctx.fillText('New', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 7.5 - 30 + (30 + newButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);

        ctx.fillStyle = '#689ed6';
        ctx.strokeStyle = '#537fac';
        ctx.lineWidth = 5;

        // hover
        // console.log(mouse.canvasX, canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5);
        if(
            mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 &&
            mouse.canvasY > canvas.h / 2 + 30 + 7.5 &&
            mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 + 30 + newButtonWidth &&
            mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio
            ){
            ctx.fillStyle = 'white';
            ctx.globalAlpha *= 0.1;
            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - ctx.lineWidth/2, canvas.h / 2 + 30 + 7.5 - ctx.lineWidth/2, 30 + newButtonWidth + ctx.lineWidth, 30 * ratio + ctx.lineWidth, 3);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = this.buttonAlpha * 1;

            this.hoveringOverNew = true;
        } else {
            this.hoveringOverNew = false;
        }

        ctx.fillStyle = '#689ed6';
        ctx.strokeStyle = '#537fac';
        ctx.lineWidth = 5;

        // find public
        const publicButtonWidth = ctx.measureText('Find Public').width;
        ctx.beginPath();
        ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5, canvas.h / 2 + 30 + 7.5, 30 + publicButtonWidth, 30 * ratio, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.fillStyle = '#f0f0f0';
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 4;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.03603260836 * publicButtonWidth;// 3 at max

        // ctx.globalAlpha = 0.8;
        ctx.strokeText('Find Public', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 + (30 + publicButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);
        // ctx.globalAlpha = 1;
        ctx.fillText('Find Public', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 + (30 + publicButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);

        // hovering effect
        ctx.lineWidth = 5;
        if(
            mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 &&
            mouse.canvasY > canvas.h / 2 + 30 + 7.5 &&
            mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 + 30 + publicButtonWidth &&
            mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio
            ){
            ctx.fillStyle = 'white';
            ctx.globalAlpha *= 0.1;
            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - ctx.lineWidth/2, canvas.h / 2 + 30 + 7.5 - ctx.lineWidth / 2, 30 + publicButtonWidth + ctx.lineWidth, 30 * ratio + ctx.lineWidth, 3);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = this.buttonAlpha * 1;

            this.hoveringOverPublic = true;
        } else {
            this.hoveringOverPublic = false;
        }

        ctx.fillStyle = '#689ed6';
        ctx.strokeStyle = '#537fac';
        ctx.lineWidth = 5;

        // TODO: get quickjoin and find private working

        // find private
        const privateButtonWidth = ctx.measureText('Private').width;
        ctx.beginPath();
        ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5, canvas.h / 2 + 30 + 7.5, 30 + privateButtonWidth, 30 * ratio, 3);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.fillStyle = '#f0f0f0';
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 4;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;

        // ctx.globalAlpha = 0.8;
        ctx.strokeText('Private', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 + (30 + privateButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);
        // ctx.globalAlpha = 1;
        ctx.fillText('Private', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 + (30 + privateButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);

        // hovering effect
        ctx.lineWidth = 5;
        if(
            mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) &&
            mouse.canvasY > canvas.h / 2 + 30 + 7.5 &&
            mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 + 30 + privateButtonWidth - (30 + privateButtonWidth) &&
            mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio
            ){
            ctx.fillStyle = 'white';
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - ctx.lineWidth/2, canvas.h / 2 + 30 + 7.5 -ctx.lineWidth/2, 30 + privateButtonWidth + ctx.lineWidth, 30 * ratio + ctx.lineWidth, 3);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;

            this.hoveringOverPrivate = true;
        } else {
            this.hoveringOverPrivate = false;
        }

        
        if(this.is1v1 === true){
            ctx.fillStyle = '#689ed6';
            ctx.strokeStyle = '#537fac';
            ctx.lineWidth = 5;
            // JOIN MAIN -- only for pvp
            // find private
            const joinMainBtnWidth = ctx.measureText('Join Main').width;
            ctx.beginPath();
            ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + joinMainBtnWidth) - 7.5, canvas.h / 2 + 30 + 7.5, 30 + joinMainBtnWidth, 30 * ratio, 3);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            // ctx.fillStyle = '#f0f0f0';
            // ctx.strokeStyle = 'black';
            // ctx.lineWidth = 4;
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            // ctx.globalAlpha = 0.8;
            ctx.strokeText('Join Main', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - (30 + joinMainBtnWidth) - 7.5 - 7.5 + (30 + joinMainBtnWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);
            // ctx.globalAlpha = 1;
            ctx.fillText('Join Main', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - (30 + joinMainBtnWidth) - 7.5 - 7.5 + (30 + joinMainBtnWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);
            // hovering effect
            ctx.lineWidth = 5;
            if(
                mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - (30 + joinMainBtnWidth) - 7.5 &&
                mouse.canvasY > canvas.h / 2 + 30 + 7.5 &&
                mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 + 30 + joinMainBtnWidth - (30 + privateButtonWidth) - (30 + joinMainBtnWidth) - 7.5 &&
                mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio
                ){
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + joinMainBtnWidth) - 7.5, canvas.h / 2 + 30 + 7.5, 30 + joinMainBtnWidth, 30 * ratio, 3);
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;
                this.hoveringOverJoinMainPvp = true;
            } else {
                this.hoveringOverJoinMainPvp = false;
            }
        }

        

        // ctx.fillStyle = "#bf8940"//`hsl(${performance.now()/300},50%,50%)`;//"#1dd129"//'#bf3434' //'#34a82a'//"#37612f"//"#79d669"//"#5D750C";//'#689ed6';
        // ctx.strokeStyle = "#9a6e33"//blendColor(ctx.fillStyle, "#000000", 0.19)//'#942828' //'#25751e'//"#0D5514"//'#537fac';
        // // console.log(ctx.fillStyle, ctx.strokeStyle);
        // ctx.lineWidth = 5;

        // // quick join
        // const quickJoinButtonWidth = ctx.measureText('Quick Join').width;
        // ctx.beginPath();
        // ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + quickJoinButtonWidth) - 7.5, canvas.h / 2 + 30 + 7.5, 30 + quickJoinButtonWidth, 30 * ratio, 3);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();

        // ctx.fillStyle = '#f0f0f0';
        // // ctx.strokeStyle = 'black';
        // // ctx.lineWidth = 4;
        // ctx.fillStyle = 'white';
        // ctx.strokeStyle = 'black';
        // ctx.lineWidth = 3;

        // // ctx.globalAlpha = 0.8;
        // ctx.strokeText('Quick Join', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + quickJoinButtonWidth) - 7.5 + (30 + quickJoinButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);
        // // ctx.globalAlpha = 1;
        // ctx.fillText('Quick Join', canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + quickJoinButtonWidth) - 7.5 + (30 + quickJoinButtonWidth) / 2, canvas.h / 2 + 30 + 7.5 + (30 * ratio)/2);

        // // hovering effect
        // ctx.lineWidth = 5;
        // if(
        //     mouse.canvasX > canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + quickJoinButtonWidth) &&
        //     mouse.canvasY > canvas.h / 2 + 30 + 7.5 &&
        //     mouse.canvasX < canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 + 30 + publicButtonWidth - (30 + privateButtonWidth) - 7.5 - (30 + quickJoinButtonWidth) &&
        //     mouse.canvasY < canvas.h / 2 + 30 + 7.5 + 30 * ratio
        //     ){
        //     ctx.fillStyle = 'white';
        //     ctx.globalAlpha = 0.1;
        //     ctx.beginPath();
        //     ctx.roundRect(canvas.w / 2 + this.w / 2 - 7.5 - 30 - newButtonWidth - 30 - 7.5 - (30 + publicButtonWidth) - 7.5 - (30 + privateButtonWidth) - 7.5 - (30 + quickJoinButtonWidth) - 7.5 - ctx.lineWidth/2, canvas.h / 2 + 30 + 7.5 - ctx.lineWidth / 2, 30 + quickJoinButtonWidth + ctx.lineWidth, 30 * ratio + ctx.lineWidth, 3);
        //     ctx.fill();
        //     ctx.closePath();
        //     ctx.globalAlpha = 1;

        //     this.hoveringOverQuickJoin = true;
        // } else {
        //     this.hoveringOverQuickJoin = false;
        // }

        if(this.public === false){
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;

            // (public)
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.strokeText('(Private)', canvas.w / 2 + this.w/2 - 7.5, canvas.h/2 + this.h - 7.5 + 30);
            ctx.fillText('(Private)', canvas.w / 2 + this.w/2 - 7.5, canvas.h/2 + this.h - 7.5 + 30);
            ctx.textAlign = 'middle';
            ctx.textBaseline = 'center';
        }
        if (this.clients.length > 4 === true) {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.font = `900 12px 'Ubuntu'`;
            ctx.lineWidth = 3;
            ctx.fillStyle = "red";
            ctx.strokeText(`[OVERFULL]`, canvas.w / 2 - this.w / 2 + 7.5, canvas.h / 2 - 7.5 + 58);
            ctx.fillText(`[OVERFULL]`, canvas.w / 2 - this.w / 2 + 7.5, canvas.h / 2 - 7.5 + 58);
            ctx.fillStyle = "white"
            ctx.strokeText(`31% harder mobs`, canvas.w / 2 - this.w / 2 + 7.5, canvas.h / 2 - 7.5 + 72);
            ctx.fillText(`31% harder mobs`, canvas.w / 2 - this.w / 2 + 7.5, canvas.h / 2 - 7.5 + 72);
            ctx.strokeText(`(Lvl150 feature)`, canvas.w / 2 - this.w / 2 + 7.5, canvas.h / 2 - 7.5 + 86);
            ctx.fillText(`(Lvl150 feature)`, canvas.w / 2 - this.w / 2 + 7.5, canvas.h / 2 - 7.5 + 86);
            
            ctx.textAlign = 'middle';
            ctx.textBaseline = 'center';

        }


        ctx.fillStyle = '#689ed6';
        ctx.strokeStyle = '#537fac';
        ctx.lineWidth = 5;
        ctx.globalAlpha = 1;
    }
    createClient(id){
        const c = {creationTime: performance.now(), flower: new Flower(id)};

        const f = c.flower;
        const playerWidth = (this.w - playerPadding * 3 - outsidePadding * 2) / 4;

        f.petalContainers = [];
        f.render.headX = canvas.w / 2 - this.w/2 + outsidePadding + (this.clients.length) * (playerWidth + playerPadding) + playerWidth / 2;
        f.render.headY = canvas.h / 2 + this.h / 2 + 35 - 9;
        f.headX = f.render.headX;
        f.headY = f.render.headY;
        f.x = f.render.headX;
        f.y = f.render.headY;
        f.render.x = f.x;
        f.render.y = f.y;
        f.render.baseX = f.x;
        f.render.baseY = f.y;
        f.baseX = f.x;
        f.baseY = f.y;

        return c;
    }
    addClient(data){
        this.clients.push(this.createClient(data.id));
        const client = this.clients[this.clients.length-1];

        for(let key in data){
            client[key] = data[key];
        }

        client.startingWave = data.sw;
        delete client.sw;

        if(data.petals){
            this.updateFlowerPetals(data.petals, client.id);
        }

        if(data.id === this.selfId){
            this.maxStartingWave = data.maxSW;
            this.desiredSWS = 1;
        }
    }
    updateStartingWave(id, sw, serverSaidSo=false){
        if(id === this.selfId){
            if(serverSaidSo){
                this.maxStartingWave = sw;
                this.desiredSWS = 1;
            } else {
                this.startingWave = sw;
            }
        } else {
            const f = this.findClient(id);
            f.startingWave = sw;
        }
    }
    removeClient(id){
        for(let i = 0; i < this.clients.length; i++){
            if(this.clients[i].id === id){
                this.clients.splice(i,1);
                return;
            }
        }
    }
    findClient(id){
        for(let i = 0; i < this.clients.length; i++){
            if(this.clients[i].id === id){
                return this.clients[i];
            }
        }
        return {};
    }
}
