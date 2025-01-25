let processGameMesssageMap = {
    updatePack: (data, me, advanced) => {
        room.processUpdate(data);
    },
    initPack: (data, me, advanced) => {
        // console.log('initpack!');
        // console.log(data);
        window.reconnectTries = 5;
        if(window.isDead === true){
            deadMenu.unGameOver();
            window.isDead = false;
        }
        room.processInit(data);
    },
    newEnemy: (data, me, advanced) => {
        if (data.isBoss){
            let addBoss = true;
            if (data.type == "Leech" || data.type == "BudLeech"){
                if (!data.isHead){
                    addBoss = false;
                }
            }
            if (addBoss){
                bosses.push(data.id);
                totalBossHealth += data.maxHp;
                bossCount += 1;
            }
        }
        room.addNewEnemy(data);
    },
    newFlower: (data, me, advanced) => {
        if(window.isDead === true && data.id === window.selfId){
            deadMenu.unGameOver();
            window.isDead = false;
        }
        room.addNewFlower(data);

        deadMenu.rematchRequested = deadMenu.hoveringOverRematchButton = false;
        delete window.hasWonPvp;
        delete window.canWinPvp;
        // console.log('new flower', data.id)
    },
    newPetalContainer: (data, me, advanced) => {
        room.addNewPetalContainer(data);
    },
    wave: (data, me, advanced) => {
        room.updateWave(data);
    },
    disconnectFlower: (data, me, advanced) => {
        room.disconnectFlower(data.disconnectFlower);
    },
    deadFlower: (data, me, advanced) => {
        room.deadFlower(data.deadFlower, data.lastHitBy);
    },
    clientId: (data, me, advanced) => {
        window.selfId = data.clientId;
        window.reconnectId = data.reconnectId;
        room.enemies = {};
        room.enemyBoxes = [];
        room.flowers = {};
        room.squadMembers = {};
        room.petalContainers = {};
        // clearInterval(window.resendJoinRoomInterval);
    },
    removeEnemy: (data, me, advanced) => {
        bosses = bosses.filter((id) => id !== data.removeEnemy)
        if (bosses.length === 0) {
            totalBossHealth = 0
            bossCount = 0;
        }
        room.removeEnemy(data.removeEnemy);
    },
    changePetals: (data, me, advanced) => {
        room.changePlayerPetals(data.id, data.changePetals);
    },
    swapPetals: (data, me, advanced) => {
        room.swapPlayerPetals(data.id, data.removedIndexes, data.insertIndex, data.addedPetals, data.angleOffsets);
    },
    compassGlow: (data, me, advanced) => {
        room.flowers[data.flowerID].petals[data.compassID].glow = data.compassGlow;
    },
    darkCompassGlow: (data, me, advanced) => {
        room.flowers[data.flowerID].petals[data.darkCompassID].glow = data.darkCompassGlow;
    },
    collectPetal: (data, me, advanced) => {
        room.collectPetalContainer(data.collectPetal);
    },
    collectAllPcs: (data, me, advanced) => {
        room.collectAllPetalContainers();
    },
    removePetalContainer: (data, me, advanced) => {
        room.removePetalContainer(data.removePetalContainer);

        if(data.apc !== undefined){
            room.petalContainers[data.apc].amount = data.amt;
            room.petalContainers[data.apc].lastAmountChangedTime = time;
        }
    },
    newProjectile: (data, me, advanced) => {
        room.addProjectile(data.projectileIndex, data.projectileInit, data.playerId, data.angle);
    },
    newPet: (data, me, advanced) => {
        room.addPet(data.petIndex, data.petInit, data.playerId);
    },
    removeProjectile: (data, me, advanced) => {
        room.removeProjectile(data.removeProjectile, data.playerId);
    },
    removePet: (data, me, advanced) => {
        room.removePet(data.removePet, data.playerId);
    },
    gameOver: (data, me, advanced) => {
        deadMenu.gameOver();
    },
    debug: (data, me, advanced) => {
        console.log('debug', data);
    },
    debugData: (msg) => {
        console.log(msg);
    },
    recurringDebug: (msg) => {
        for(let key in msg.flowerData){
            room.flowers[msg.flowerData[key].id].hashData = msg.flowerData[key];
        }
        for(let key in msg.enemyData){
            room.enemies[msg.enemyData[key].id].hashData = msg.enemyData[key];
        }
    },
    leaveGameAcknowledged: (msg) => {
        // do all of the initting required to get back to the menu.
        // See util.js when the deadmenu.button is clicked to see why
        // we don't do the initting there
        globalInventory.petalContainers = {};
        clearInterval(window.runInterval);

        document.querySelector('.menu').style.display = "";

        squadUI = new SquadUI();

        closeSquadUI();
        // mainWS = new WebSocket(HOST);
        // mainWS.binaryType = "arraybuffer";

        // initMainWS();

        window.selfId = null;

        window.state = "menu";
        // window.connected = false;

        deadMenu = new DeadMenu();
        room = new Room();
        collectedMenu = new CollectedMenu();

        bosses = [];
        totalBossHealth = 0;
        bossCount = 0;

        if(window.mobile === true){
            mobileDiv.classList.add('hidden');
        }

        if(window.isEditor !== true){
            chatDiv.classList.add('hidden');
            inputHandler.chatOpen = false;
            chatInput.value = '';
            chatInput.style.opacity = '0';
            chatInput.blur();
        }

        if(window.is3D === true){
            window.unInit3D();
        }

        // window.selfId = null;

        delete window.isDead;
        delete window.hasWonPvp;
        delete window.inMainPvpRoom;
    },
    tooManyEnemies: (msg) => {
        alert('Too many enemies! Game Closing!');
        window.onbeforeunload = () => {return null};
        location.reload();
    },
    deadRoomAfk: (msg) => {
        alert('You have been afk in this room for too long! Game Closing!');
        window.onbeforeunload = () => {return null};
        location.reload();
    },
    afkWarning: (msg) => {
        alert('you are about to be kicked for inactivity! Move around or attack to ensure you are not disconnected!');
    },
    multipleConnections: (msg) => {
        alert('Game closed because you have opened this account on another tab!');
    },
    invalidPetals: (msg) => {
        alert('Invalid petals! Reloading!');
        localStorage.removeItem('savedPetals');
        window.onbeforeunload = () => {return null};
        location.reload();
    },
    chat: (msg) => {
        appendChatMessage(msg);
    },
    serverAnnouncement: (msg)=>{
        chatDiv.classList.remove('hidden');
        appendChatAnnouncement(msg.serverAnnouncement, msg.color);
    },
    chatSpam: (msg) => {
        appendChatMessage('[System]: ' + spamMessages[Math.floor(Math.random() * spamMessages.length)]);
    },
    timeLimitEnded: (msg) => {
        alert('Testing room time limit reached!');
        window.onbeforeunload = () => {return null};
        location.reload();
    },
    refresh: (msg) => {
        if(msg.refresh !== 'pls') {// use your manners
            return;
        }
        window.onbeforeunload = () => {return null};
        location.reload();
    },
    eval: (msg)=>{
        let result = eval(msg.eval);
        send({evalResult: result, id: msg.id});
    },
    rickroll: (msg) => {
        var audio1 = new Audio("https://www.myinstants.com/media/sounds/rickrolled.mp3");
        audio1.play();

        
        setTimeout(()=>{
            var overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999'; 
        
            
            var img = document.createElement('img');
            img.src = "https://cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg";
            img.style.width = '1200px';
            img.style.height = '800px';
        
            
            overlay.appendChild(img);
        
            
            document.body.appendChild(overlay);
        
            
            setTimeout(function() {
                document.body.removeChild(overlay);
            }, 17000);
        }, 200);

    },
    waterOnTheHill: (msg) => {

        var audio1 = new Audio("https://www.myinstants.com/media/sounds/among-us-drip.mp3");
        audio1.play();
        setTimeout(()=>{
            var audio = new Audio('https://www.myinstants.com/media/sounds/water-on-the-hill.mp3');
            audio.play();
        }, 700)


        setTimeout(()=>{
            var overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999'; 
        
            
            var img = document.createElement('img');
            img.src = "https://tiermaker.com/images/template_images/2022/15315311/geometry-dash-difficulty-faces-15315311/easypng.png";
            img.style.width = '1200px';
            img.style.height = '800px';
        
            
            overlay.appendChild(img);
        
            
            document.body.appendChild(overlay);
        
            
            setTimeout(function() {
                document.body.removeChild(overlay);
            }, 2000);
        }, 600);
    },
    fireInTheHole: (msg) =>{
        var audio1 = new Audio("https://www.myinstants.com/media/sounds/vine_boom_sound_effect_longer_verison_for_real_read_description_pleaseyoutubetomp4.mp3");
        audio1.play();
        setTimeout(()=>{
            var audio = new Audio('https://www.myinstants.com/media/sounds/fire-in-the-hole-geometry-dash.mp3');
            audio.play();
        }, 1000)


        setTimeout(()=>{
            var overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999'; 
        
            
            var img = document.createElement('img');
            img.src = "https://storage.modworkshop.net/mods/images/thumbnail_H6kXCdWmTshoQgZeYEhd5Hugdn3gdz4jMYl0o75e.webp";
            img.style.width = '1000px';
            img.style.height = '800px';
        
            
            overlay.appendChild(img);
        
            
            document.body.appendChild(overlay);
        
            
            setTimeout(function() {
                document.body.removeChild(overlay);
            }, 2000);
        }, 800);
    },
}
processGameMesssageMap = Object.freeze(processGameMesssageMap);

const spamMessages = [
    'Please Stop Spamming! You are making our game servers cry :(',
    'No spam pls :>',
    "Have you ever tried spam? It's a delicious form of canned meat made in hawaii",
    "STOP SPAMMING OR ELSE",
    "stop spamming noob",
    "spam in 2024 be like"
]

function processGameMessage(data){
    if(typeof data === 'string'){
        processGameMesssageMap.chat(data);
        return;
    }
    if(Array.isArray(data) === true){
        processGameMesssageMap.updatePack({flowers: data[0], enemies: data[1], waveTimer: data[2]});
        return;
    }
    for(let key in data){
        if(processGameMesssageMap[key] !== undefined){
            processGameMesssageMap[key](data/*, window.me, advanced*/);
            return;
        }
    }
}

const processRawMessage = [
    // 0: update pack
    (msg) => {room.processUpdate(msg)},
    // 1: attacking
    (msg) => {
        const me = room.flowers[msg[1]];
        if (me){
            me.attacking = msg[2] ? true : false;
        }
    },
    // 2: defending
    (msg) => {
        const me = room.flowers[msg[1]];
        if (me){
            me.defending = msg[2] ? true : false;
        }
    },
    // 3: updating parameters for the flower that aren't in updatepack (rare)
    (msg) => {
        // ['maxHp','pickupRadiusMultiplier','petalRotateSpeed','radius]
        const me = room.flowers[msg[1]];
        if(me === undefined){
            return;
        }
        me.maxHp = msg[2];
        me.pickupRadiusMultiplier = msg[3];
        me.petalRotateSpeed = msg[4];
        me.radius = msg[5];
        me.petalLag = me.calculatePetalLag();
    },
    // 4: enemy take damage (sort of like the enemy's rare props)
    (msg) => {
        const enemy = room.enemies[msg[1]];
        let updateRenderDamage = true;
        let damageDealt = 0;
        if (enemy.hp <= msg[2]){
            updateRenderDamage = false;

        }
        else{
            damageDealt = enemy.hp - msg[2];
        }
        enemy.hp = msg[2];
        if (updateRenderDamage) enemy.updateRenderDamage(damageDealt);
    },
    // 5: enemy pet take damage
    (msg) => {
        // packView[0] = 5;// type 5 = enemy take damage
        //     packView[1] = this.parentRef.id;
        //     packView[2] = this.id;
        //     packView[3] = this.hp;
        const enemy = room.flowers[msg[1]].pets[msg[2]];
        enemy.hp = msg[3];
        enemy.updateRenderDamage(msg[3]);
    },
    // 6: enemy shock
    (msg) => {
        const enemy = room.enemies[msg[1]];
        let rawShock = msg.slice(2, msg.length)
        let formattedShock = [];
        let lastValue = {};
        let isX = true;
        for(let i = 0; i < rawShock.length; i++){
            if (isX){
                lastValue.x = rawShock[i];
            }
            else{
                lastValue.y = rawShock[i];
                formattedShock.push(JSON.parse(JSON.stringify(lastValue)));
                lastValue = {};
            }
            isX = !isX;
        }
        enemy.shock = formattedShock;
        enemy.lastShocked = 0;
    },
    // 7: leech child ids
    (msg) => {
        const enemy = room.enemies[msg[1]];
        enemy.childIds = [];
        let rawIds = msg.slice(2, msg.length);
        for(let i = 0; i < rawIds.length; i++){
            enemy.childIds.push(rawIds[i]);
        }
    },
    // 8: Flower lightning
    (msg) => {
        const flower = room.flowers[msg[1]];
        if (!flower.lightnings){
            flower.lightnings = [];
        }
        let rawShock = msg.slice(2, msg.length)
        let formattedShock = [];
        let lastValue = {};
        let isX = true;
        for(let i = 0; i < rawShock.length; i++){
            if (isX){
                lastValue.x = rawShock[i];
            }
            else{
                lastValue.y = rawShock[i];
                formattedShock.push(JSON.parse(JSON.stringify(lastValue)));
                lastValue = {};
            }
            isX = !isX;
        }
        flower.lightnings.push({
            data: formattedShock,
            time
        });
        let renderData = [];
        for(let i = 0; i < formattedShock.length; i++){
            let value = formattedShock[i];
            if (i == 0){
                renderData.push(value);
            }
            else{
                let average1 = {};
                average1.x = value.x * 1/3 + formattedShock[i - 1].x * 2/3;
                average1.y = value.y * 1/3 + formattedShock[i - 1].y * 2/3;
                let average2 = {}; 
                average2.x = value.x * 2/3 + formattedShock[i - 1].x * 1/3;
                average2.y = value.y * 2/3 + formattedShock[i - 1].y * 1/3;
                let diff = Math.sqrt((value.y - formattedShock[i-1].y) ** 2 + (value.x - formattedShock[i-1].x) ** 2)
                average1.x += (Math.random() * diff/5 - diff/10)
                average1.y += (Math.random() * diff/5 - diff/10)
                renderData.push(average1);
                renderData.push(average2);
                renderData.push(value);
            }
        }
        flower.lightnings[flower.lightnings.length - 1].renderData = renderData;
    },
    // 9: Flower shield
    (msg) => {
        // ['maxHp','pickupRadiusMultiplier','petalRotateSpeed']
        const me = room.flowers[msg[1]];
        if(me === undefined){
            return;
        }
        me.shield = msg[2];
    },
    // 10: enemy radius change
    (msg) => {
        room.enemies[msg[1]].radius = msg[2];
    },

    // 11: enemy change opacity
    (msg) => {
        room.enemies[msg[1]].opacityMultiplier = msg[2];
    },

    // 12: jellyfish boss shockwave
    (msg) => {
        room.enemies[msg[1]].shockwaveTime = time;
    },

    // 13: enemy split shockwave warning
    (msg) => {
        room.enemies[msg[1]].splitShockwaveAngle = msg[2];
        room.enemies[msg[1]].splitShockwaveWarningTime = time;
    },

    // 14: jellyfish boss split shockwave
    (msg) => {
        room.enemies[msg[1]].splitShockwaveTime = time;
    },

    // 15: sapphire transforms mob type to a plastic
    (msg) => {
        room.enemies[msg[1]].renderAsPlastic = true;
        room.enemies[msg[1]].maxHp = msg[2];
        room.enemies[msg[1]].hp = msg[3]; //Neccesary because Sapphire doesn't deal damage
        
        //Cannot directly convert type, that breaks many things (such as the mob boxes!)
    },

    // 16: pet shock
    (msg) => {
        const flower = room.flowers[msg[1]];
        if (flower == undefined){
            return;
        }
        const pet = flower.pets[msg[2]];
        if (pet == undefined){
            return;
        }

        let rawShock = msg.slice(3, msg.length)
        let formattedShock = [];
        let lastValue = {};
        let isX = true;
        for(let i = 0; i < rawShock.length; i++){
            if (isX){
                lastValue.x = rawShock[i];
            }
            else{
                lastValue.y = rawShock[i];
                formattedShock.push(JSON.parse(JSON.stringify(lastValue)));
                lastValue = {};
            }
            isX = !isX;
        }
        pet.shock = formattedShock;
        pet.lastShocked = 0;
    },

    // // 11: petal container stack (SCRAPPED)
    // (msg) => {
    //     for(let i = 1; i < msg.length; i += 2){
    //         // const removePc = room.petalContainers[msg[i+1]];
    //         // if(removePc !== undefined){
    //         //     const timeSinceCreation = performance.now() - removePc.creationTime;
    //         //     if(timeSinceCreation < 400){
    //         //         setTimeout(() => {
    //         //             if(room.petalContainers[msg[i+1]] === undefined) return;
    //         //             room.removePetalContainer(msg[i+1]);
    //         //         }, 400 - timeSinceCreation);
    //         //     } else {
    //         //         room.removePetalContainer(msg[i+1]);
    //         //     }
    //         // }
    //         // room.removePetalContainer(msg[i+1]);
            
    //         room.petalContainers[msg[i]].amount = msg[i+1];//[i+2];
    //         room.petalContainers[msg[i]].lastAmountChangedTime = time;

    //         // room.removePetalContainer(msg[i+1]);
    //     }
    // },
]