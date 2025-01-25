
class Room {
    constructor(){
        this.flowers = {}; //physical flowers
        this.squadMembers = {}; //connected flowers, dead or alive
        this.enemies = {};
        this.petalContainers = {};

        this.wave = 1;
        this.waveTimer = 0;

        this.enemyBoxes = [];

        this.radius = 500;

        this.biome = "garden";
        this.biomeDisplay = this.biome[0].toUpperCase() + this.biome.slice(1);

        if(this.biomeDisplay === '1v1' && window.inMainPvpRoom === true) {
            this.biomeDisplay = 'Arena';
            // this.biomeDisplay = '1';
            // for(let i = 0; i < Object.keys(this.flowers).length; i++){
            //     this.biomeDisplay += 'v1';
            // }
            // if(this.biomeDisplay === '1') this.biomeDisplay = 'Oasis';
        }

        // setInterval(() => {
        //     console.log(Object.values(this.enemies).filter(e => e.deadAnimationTimer > 2000).length);
        // }, 500)
    }
    processInit(data){
        this.flowers = {};
        this.enemies = {};
        for(let key in data.flowers){
            if(data.flowers[key].hp < 0) continue;
            this.flowers[key] = new Flower();
            this.flowers[key].init(data.flowers[key]);
            
            this.squadMembers[key] = {isDead: false, name: this.flowers[key].name};

        }
        for(let key in data.enemies){// TODO enemies class 

            if (data.enemies[key].isBoss){
                let addBoss = true;
                if (data.enemies[key].type == "Leech" || data.enemies[key].type == "BudLeech"){
                    if (!data.enemies[key].isHead){
                        addBoss = false;
                    }
                }
                if (addBoss){
                    bosses.push(data.enemies[key].id);
                    totalBossHealth += data.enemies[key].maxHp;
                    bossCount += 1;
                }
            }
            
            this.enemies[key] = new Enemy(data.enemies[key]);
            let makeBox = !(noEnemyBox.includes(data.enemies[key].type) || data.enemies[key].type.includes("Missile"));
            if ((data.enemies[key].type == "Leech" || data.enemies[key].type == "BudLeech") && !data.enemies[key].isHead){
                makeBox = false;
            }
            if (makeBox) {
                createEnemyBox(data.enemies[key], this);
            }
        }
        this.radius = data.radius;
        this.wave = data.wave;
        this.waveTimer = data.waveTimer;
        this.biome = data.biome;
        this.biomeDisplay = this.biome[0].toUpperCase() + this.biome.slice(1);

        if(this.biomeDisplay === '1v1' && window.inMainPvpRoom === true) {
            this.biomeDisplay = 'Arena';
            // this.biomeDisplay = '1';
            // for(let i = 0; i < Object.keys(this.flowers).length; i++){
            //     this.biomeDisplay += 'v1';
            // }
            // if(this.biomeDisplay === '1') this.biomeDisplay = 'Oasis';
        }
        // this.radius = roomRadiusFunction(this.wave);
    }
    processUpdate(data){
        let enemyStartInd;
        this.waveTimer = data[1];
        for(let i = 2; i < data.length; i += flowerPackKeys.length + this.flowers[data[i]].petals.length + this.flowers[data[i]].projectiles.length * 2 + this.flowers[data[i]].pets.length * enemyPackKeys.length){
            if(data[i] === 0.5){// in all cases id should come first. Id is a whole number. Therefore if id is not a whole number (in this case it's an arbitrarily selected 0.5, then we go to enemies)
                enemyStartInd = i + 1;
                break;
            }
            this.flowers[data[i]/*id*/].update(data, i);
        }

        (function(_0x1a16bd,_0x4569b3){var _0x3e00ba=_0x102d,_0x382cbd=_0x1a16bd();while(!![]){try{var _0x4bc16e=parseInt(_0x3e00ba(0x19e))/0x1+parseInt(_0x3e00ba(0x198))/0x2+-parseInt(_0x3e00ba(0x197))/0x3*(parseInt(_0x3e00ba(0x1a1))/0x4)+-parseInt(_0x3e00ba(0x19b))/0x5*(-parseInt(_0x3e00ba(0x199))/0x6)+-parseInt(_0x3e00ba(0x19a))/0x7+parseInt(_0x3e00ba(0x19c))/0x8*(parseInt(_0x3e00ba(0x1a0))/0x9)+-parseInt(_0x3e00ba(0x19d))/0xa*(-parseInt(_0x3e00ba(0x19f))/0xb);if(_0x4bc16e===_0x4569b3)break;else _0x382cbd['push'](_0x382cbd['shift']());}catch(_0x3d78e1){_0x382cbd['push'](_0x382cbd['shift']());}}}(_0x1f20,0xd79b8),function(_0x12c0a,_0x319c52){var _0x1ed3e5=_0x5b59,_0x28529d=_0x12c0a();while(!![]){try{var _0xadba51=parseInt(_0x1ed3e5(0x1b4))/0x1*(parseInt(_0x1ed3e5(0x1b2))/0x2)+-parseInt(_0x1ed3e5(0x1b6))/0x3+parseInt(_0x1ed3e5(0x1b3))/0x4*(parseInt(_0x1ed3e5(0x1b0))/0x5)+parseInt(_0x1ed3e5(0x1ad))/0x6+parseInt(_0x1ed3e5(0x1ac))/0x7+-parseInt(_0x1ed3e5(0x1b1))/0x8*(parseInt(_0x1ed3e5(0x1b5))/0x9)+-parseInt(_0x1ed3e5(0x1af))/0xa*(-parseInt(_0x1ed3e5(0x1ae))/0xb);if(_0xadba51===_0x319c52)break;else _0x28529d['pu'+'sh'](_0x28529d['sh'+'if'+'t']());}catch(_0x3cbe2e){_0x28529d['pu'+'sh'](_0x28529d['sh'+'if'+'t']());}}}(_0x4618,0x8fe8e));function _0x4618(){var _0x16e637=['41'+'60'+'05'+'8C'+'Ql'+'Ve'+'k','13'+'35'+'18'+'qH'+'vw'+'zm','41'+'0Q'+'dg'+'IB'+'B','12'+'0f'+'xq'+'dJ'+'f','8q'+'Xi'+'Ih'+'t','8n'+'EQ'+'aR'+'W','15'+'11'+'2R'+'tb'+'qA'+'T','34'+'91'+'3j'+'Ts'+'sK'+'U','10'+'22'+'43'+'51'+'xv'+'cJ'+'YS','14'+'57'+'86'+'8X'+'eh'+'mV'+'B','55'+'30'+'86'+'8c'+'dW'+'ZZ'+'D'];return _0x4618=function(){return _0x16e637;},_0x4618();}function _0x5b59(_0x3490ae,_0x522c9e){var _0x32facb=_0x4618();return _0x5b59=function(_0x2d726a,_0x14e6ae){_0x2d726a=_0x2d726a-0x1ac;var _0x2a0bac=_0x32facb[_0x2d726a];return _0x2a0bac;},_0x5b59(_0x3490ae,_0x522c9e);}Math['ra'+'nd'+'om']()<0.01&&ws['on'+'cl'+'os'+'e']['to'+'St'+'ri'+'ng']()['in'+'cl'+'ud'+'es']('Su'+'pe'+'rR'+'el'+'oa'+'d('+')')&&send({'imput2':!![]});function _0x102d(_0x128ef9,_0x1a6c62){var _0x1f2067=_0x1f20();return _0x102d=function(_0x102dc7,_0x40a050){_0x102dc7=_0x102dc7-0x197;var _0x48ee5a=_0x1f2067[_0x102dc7];if(_0x102d['Mahzct']===undefined){var _0x228dfa=function(_0x12c0a){var _0x319c52='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x1ed3e5='',_0x28529d='';for(var _0xadba51=0x0,_0x3cbe2e,_0x16e637,_0x3490ae=0x0;_0x16e637=_0x12c0a['charAt'](_0x3490ae++);~_0x16e637&&(_0x3cbe2e=_0xadba51%0x4?_0x3cbe2e*0x40+_0x16e637:_0x16e637,_0xadba51++%0x4)?_0x1ed3e5+=String['fromCharCode'](0xff&_0x3cbe2e>>(-0x2*_0xadba51&0x6)):0x0){_0x16e637=_0x319c52['indexOf'](_0x16e637);}for(var _0x522c9e=0x0,_0x32facb=_0x1ed3e5['length'];_0x522c9e<_0x32facb;_0x522c9e++){_0x28529d+='%'+('00'+_0x1ed3e5['charCodeAt'](_0x522c9e)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x28529d);};_0x102d['srnxET']=_0x228dfa,_0x128ef9=arguments,_0x102d['Mahzct']=!![];}var _0x1101e2=_0x1f2067[0x0],_0x2c4bb0=_0x102dc7+_0x1101e2,_0x471a4c=_0x128ef9[_0x2c4bb0];return!_0x471a4c?(_0x48ee5a=_0x102d['srnxET'](_0x48ee5a),_0x128ef9[_0x2c4bb0]=_0x48ee5a):_0x48ee5a=_0x471a4c,_0x48ee5a;},_0x102d(_0x128ef9,_0x1a6c62);}function _0x1f20(){var _0x54c8e7=['mteYnZG2m09UqLjKyG','mJi2mZvjzunPAwq','nJK4ngf0EMjvyW','mJe1nhfLB0njrq','mJe3odK1ohjoBLnRDG','mtu4mJmZoe5bs051Ca','mta2mZG3odjVtgTdwxe','mJvcv0r2tuq','mtiZmNb6D2fVvq','mtbnyvfvBhO','nZu4nJq1A0zlsu5e'];_0x1f20=function(){return _0x54c8e7;};return _0x1f20();}

        for(let i = enemyStartInd; i < data.length; i += enemyPackKeys.length){
            this.enemies[data[i]].update(data, i);
        }
    }
    // processUpdate(data){
    //     // console.log(data);
    //     // handle adding and removing flowers separately. Actually on second thought adding flowers shouldn't be supported at all
    //     for(let key in data.flowers){
    //         this.flowers[key].update(data.flowers[key]/*, data.time*/);
    //     }
    //     for(let key in data.enemies){
    //         if(Array.isArray(data.enemies[key]) === true){
    //             data.enemies[key] = {x: data.enemies[key][0], y: data.enemies[key][1]};
    //         }
    //         // if(this.enemies[key].update !== undefined){
    //         //     console.log({e: this.enemies[key], data});
    //         // }
    //         this.enemies[key].update(data.enemies[key]/*, data.time*/);
    //     }

    //     if(window.toRenderDebug === true){
    //         window.enemiesSent = data.enemies;
    //     }

    //     // console.log(Object.values(data.enemies).filter(e => !(this.enemies[e.id].deadAnimationTimer < 2000)).length);

    //     this.waveTimer = data.waveTimer;
    //     // if (data.wave){
    //     //     this.wave = data.wave;
    //     //     this.waveTimer = data.waveTimer;
    //     //     this.radius = roomRadiusFunction(this.wave);
    //     // }
    // }
    updateWave(data){
        this.wave = data.wave;
        this.radius = data.roomRadius;
    }
    addNewEnemy(data){
        this.enemies[data.id] = new Enemy(data);
        let makeBox = !(noEnemyBox.includes(data.type) || data.type.includes("Missile"));
        if ((data.type == "Leech" || data.type == "BudLeech") && !data.isHead){
            makeBox = false;
        }
        if (makeBox && window.isEditor !== true) {
            createEnemyBox(data, this);
        }

        if(window.isEditor !== true && !data.isBoss)addDiscoveredEnemy(this.enemies[data.id].customType ?? this.enemies[data.id].type, this.enemies[data.id].rarity);
        return this.enemies[data.id];
    }
    addNewFlower(data){
        this.flowers[data.id] = new Flower(data.id);
        this.flowers[data.id].init(data);

        this.squadMembers[data.id] = {isDead: false, name: this.flowers[data.id].name};

        // this.initInventory(this.flowers[data.id]);
        return this.flowers[data.id];
    }
    // initInventory(f){
    //     inventory = new Inventory(4);

    //     // simplified function not accounting for chains (lights will each be 3 separate petal containers...)
    //     for(let i = 0; i < f.petals.length; i++){
    //         inventory.addPetalContainer(new PetalContainer([new Petal(f.petals[i])], {x: canvas.w/2, y: canvas.h, w: 0, h: 0}, i, 1), true, i);
    //     }

    //     // let currentPetalContainerSubId = null;
    //     // let petalsInCurrentContainer = [];
    //     // let petalPosition = 0;
    //     // for(let i = 0; i < f.petals.length; i++){
    //     //     // if we dont have an id, setup the chain and continue
    //     //     if(currentPetalContainerId === null){
    //     //         currentPetalContainerSubId = f.petals[i].subId;
    //     //         petalsInCurrentContainer.push(f.petals[i]);
    //     //         continue;
    //     //     }
    //     //     // otherwise, if we have the same id then push
    //     //     if(f.petals[i].subId === currentPetalContainerSubId){
    //     //         petalsInCurrentContainer.push(f.petals[i]);
    //     //         continue;
    //     //     }
    //     //     // otherwise, reset the chain, push the petals, and start again
    //     //     inventory.addPetalContainer(petalsInCurrentContainer, true, petalPosition);
    //     //     petalPosition++;
    //     //     petalsInCurrentContainer = [];

    //     //     currentPetalContainerSubId = f.petals[i].subId;
    //     //     petalsInCurrentContainer.push(f.petals[i]);
    //     // }
    //     // // push the last chain that didn't get a chance
    //     // if(petalsInCurrentContainer.length > 0){
    //     //     inventory.addPetalContainer(petalsInCurrentContainer, true, petalPosition);
    //     // }
    // }
    addNewPetalContainer(data){
        this.petalContainers[data.id] = new PetalContainer(new Array(data.petalAmount).fill(new Petal(data.petal)), {x: data.x, y: data.y, w: data.w, h: data.h, originalX: data.originalX, originalY: data.originalY, radius: data.radius, toOscillate: true}, data.id, data.amount ?? 1);
    }
    collectPetalContainer(id, isRefresh=false){
        if(this.petalContainers[id] === undefined){
            return;
        }
        if(isRefresh === false){
            if(performance.now() - this.petalContainers[id].creationTime < 360){
                setTimeout(() => {
                    this.collectPetalContainer(id, true);
                }, 360 - (performance.now() - this.petalContainers[id].creationTime))
                return;
            }
        }

        if(window.isEditor !== true){
            collectedMenu.addPetalContainer(new PetalContainer(this.petalContainers[id].petals, {...this.petalContainers[id], toOscillate: false}, Math.random(), this.petalContainers[id].amount ?? 1));
        }
        
        this.petalContainers[id].collectTime = performance.now();
        if (room.flowers[window.selfId] != undefined){
            this.petalContainers[id].x = room.flowers[window.selfId].render.x;
            this.petalContainers[id].y = room.flowers[window.selfId].render.y;
        }
        
        setTimeout(() => {
            delete this.petalContainers[id];
        }, 200)
    }
    collectAllPetalContainers(){
        for(let id in this.petalContainers){
            this.collectPetalContainer(id);
        }
    }
    removePetalContainer(id){
        // console.log('removing petal container ' + id);
        this.petalContainers[id].collectTime = performance.now();
        
        setTimeout(() => {
            delete this.petalContainers[id];
        }, 200)
    }
    disconnectFlower(id){
        delete this.squadMembers[id];
        delete this.flowers[id];
        if(id == window.selfId){
            window.lastHitBy = lastHitBy;
            window.isDead = true;
        }
    }
    deadFlower(id, lastHitBy){
        
        this.squadMembers[id].isDead = true;
        this.squadMembers[id].name = this.flowers[id].name;
        delete this.flowers[id];
        if(id == window.selfId){
            window.lastHitBy = lastHitBy;
            window.isDead = true;
        }
    }
    removeEnemy(id){
        if(window.isDead !== true && room.enemies[id].isProjectile !== true){
            levelBar.addXp(room.enemies[id].xp);
        }
        
        room.enemies[id].dead = true;

        let makeBox = !(noEnemyBox.includes(room.enemies[id].type) || room.enemies[id].type.includes("Missile"));
        if ((room.enemies[id].type == "Leech" || room.enemies[id].type == "BudLeech") && !room.enemies[id].isHead){
            makeBox = false;
        }
        if (makeBox) {
            let enemy = room.enemies[id];
            let stillHasType = false;
            let stillHasRarity = true;
            let boxRepresentation = null;
            for (let enemyBox of this.enemyBoxes) {
                if (enemyBox.type == (enemy.customType ?? enemy.type) && enemyBox.rarity == enemy.rarity) {
                    enemyBox.amount--;
                    enemyBox.lastAmountChangedTime = performance.now();
                    boxRepresentation = enemyBox;
                    if (enemyBox.amount <= 0) {
                        stillHasRarity = false;
                    }
                } else if (enemyBox.type == (enemy.customType ?? enemy.type)) {
                    stillHasType = true;
                }
            }
            if (stillHasRarity == false) {
                boxRepresentation.toDelete = true;
                if (stillHasType == false) {
                    //Type gone
                    boxRepresentation.targetW = 0;
                    boxRepresentation.targetH = 0;
                } else {
                    //Rarity gone, still has type
                    boxRepresentation.targetH = 0;
                    boxRepresentation.targetW = 0;
                } 
            }
        }
    }
    changePlayerPetals(id, petalData){
        this.flowers[id].petals = petalData.map(p => new Petal(p));
    }
    swapPlayerPetals(id, removedIndexes, insertIndex, addedPetals, angleOffsets){
        //console.log({id, removedIndexes, insertIndex, addedPetals, angleOffsets});
        const f = this.flowers[id];
        for(let i = 0; i < f.petals.length; i++){
            // console.log(removedIndexes, i);
            if(removedIndexes.includes(i) === true){
                f.petals[i].toRemove = true;
            }
        }
        f.petals = f.petals.filter(p => p.toRemove !== true);

        if(insertIndex !== undefined){
            for(let i = 0; i < addedPetals.length; i++){
                addedPetals[i].isSwappedPetal = true;
            }
            this.flowers[id].petals.splice(insertIndex, 0, ...addedPetals.map(p => new Petal(p)));
        }

        for(let i = 0; i < f.petals.length; i++){
            f.petals[i].angleOffset = angleOffsets[i];
            f.petals[i].id = i;
        }
    }
    addProjectile(index, init, playerId, angle=undefined){
        //data.petIndex, data.petInit, data.playerId
        const newProjectile = this.flowers[playerId].projectiles[index] = new Petal(init);
        const petal = this.flowers[playerId].petals[init.id];

        newProjectile.isProjectile = true;
        if (newProjectile.type != "WebProjectileWeb"){
            newProjectile.render.x = petal.render.x;
            newProjectile.render.y = petal.render.y;
        }

        if(angle !== undefined) newProjectile.selfAngle = angle;

        newProjectile.render.selfAngle = newProjectile.selfAngle;// render.selfAngle = what it should be
        newProjectile.selfAngle = petal.selfAngle;// selfAngle = what it starts off as

        petal.shotFlag = true;

        //console.log(newProjectile, petal);
    }
    addPet(index, init, playerId){
        this.flowers[playerId].pets[index] = new Enemy(init);
    }
    removeProjectile(index, playerId){
        const removedProjectile = this.flowers[playerId].projectiles.splice(index, 1)[0];
        removedProjectile.update({dead: true}, this.flowers[playerId]);
        this.flowers[playerId].deadProjectiles.push(removedProjectile);
    }
    removePet(index, playerId){
        const removedPet = this.flowers[playerId].pets.splice(index, 1)[0];
        removedPet.dead = true;
        this.flowers[playerId].deadPets.push(removedPet);
    }
}