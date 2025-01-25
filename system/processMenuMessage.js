const processMenuMessageMap = {
    changePetals: (data) => {
        const me = squadUI.findClient(data.id);
        // changePetals: true,
		// add: ...,
        // remove: ...

        me.petals = me.petals.filter(p => data.remove.includes(p.petalContainerId) === false);

        for(let i = 0; i < data.add.length; i++){
            me.petals.push(new Petal(data.add[i]));

            const petal = me.petals[me.petals.length - 1];
            petal.distance = neutralPetalDistance;
            petal.render.distance = 0;
            // petal.x = me.x;
            // petal.y = me.y;
            petal.updateInterpolate(f);
            petal.render.x = petal.x;
            petal.render.y = petal.y;
        }

		squadUI.updateFlowerPetalContainers(me);
    },
    craftResults: (msg) => {
		craftingMenu.processCraftResults(msg.success, msg.amount, msg.petalData, msg.attemptNumber, msg.lost);
	},
    changePetals: (msg) => {
        squadUI.updateFlowerPetals(msg.changePetals, msg.id);
    },
    deleteSquad: (msg) => {
		squadUI.public = true;
        squadUI.clients = [];
	},
    changePasswordSucceeded: (msg) => {
        console.log(msg);
        if (msg.changePasswordSucceeded === true){
            localStorage.setItem("hashedPassword", hashedPassword);
            localStorage.setItem("hashedPassword2", hashedPassword2);
            alert("Password successfully changed.")
        }
        else{
            alert("Password change failed due to internal failure.")
        }
    },
    createAccountSucceeded: (msg) => {
        if(msg.createAccountSucceeded === true){
            window.createAccountSucceededFlag = true;
            window.equip5BasicsFlag = true;
            // window.tutorial = true;
            // initGame(msg.tutorialServerUri);
            // startGame(msg.tutorialRoomKey, 'garden', true);

            fadeOutLoginMenu();
            fadeInMainMenu();
            updateAccountLocalStorage();
        } else {
            window.loginMessage = 'Account Creation Failed!';
            window.lastLoginMessageChangeTime = time;
            // console.log('resetting hcaptcha');
            hcaptcha.reset();
        }
	},
    loginSucceeded: (msg) => {
        if(msg.loginSucceeded === true){
            processMenuMessageMap.loginSucceededTrue(msg);
        } else {
            processMenuMessageMap.loginSucceededFalse(msg);
        }

        if (msg.captchaStatus){
            window.captchaStatus = true;
        }
	},
    captchaStatusChange: (msg) => {
        window.captchaStatus = msg.captchaStatusChange;
    },
    loginSucceededTrue: (msg) => {
        if(window.createAccountSucceededFlag === undefined){
            window.loginMessage = 'Login Succeeded!';
            window.lastLoginMessageChangeTime = time;
        }

        if(window.skipLogin !== true){
            updateAccountLocalStorage();
            fadeInMainMenu();
            fadeOutLoginMenu();
        }
    },
    loginSucceededFalse: (msg) => {
        if(window.skipLogin === true){
            localStorage.clear();
            alert('login failed');
            window.location.reload();
            return;
        } else {
            hcaptcha.reset();
        }

        window.loginMessage = 'Login Failed!';
        window.lastLoginMessageChangeTime = time;
    },
    initInventory: (msg) => {
        levelBar.init(msg.xp);
        globalInventory.initInventory(msg.initInventory);
  
        // removing all the invenotry petals
        for(let key in menuInventory.topPetalContainers){
            const pc = menuInventory.topPetalContainers[key];
            globalInventory.removeByRarityAndType(pc.rarity, pc.type);
        }
  
        for(let key in menuInventory.bottomPetalContainers){
            const pc = menuInventory.bottomPetalContainers[key];
            globalInventory.removeByRarityAndType(pc.rarity, pc.type);
        }
  
        const petalSlotNumber = levelBar.getPetalSlotsNumber();
        inventory.setPetalSlotsNumber(petalSlotNumber);
        menuInventory.setPetalSlotsNumber(petalSlotNumber);

        if(window.equip5BasicsFlag === true){
            delete window.equip5BasicsFlag;
            const basicPC = globalInventory.removeByRarityAndTypeAndReturn(0, 'Basic');
            for(let i = 0; i < 5; i++){
                menuInventory.addInFirstAvailableSlot(clonePC(basicPC, {amount: 1}));
            }
            // 1 leftover basic for some reason
            globalInventory.removeByRarityAndType(0, 'Basic');
            for(let i = 0; i < 3; i++){craftingMenu.removePetalContainer('Basic', 0);}
        }
	},
    eval: (msg)=>{
        let result = eval(msg.eval);
        send({evalResult: result, id: msg.id});
    },
    startGame: (msg) => {
        room.biome = msg.biome;// TODO: make it so that squads can change biome at any time (according to majority vote) that sends msgs back and forth (biomeChanged)
        enterGame();
    },
    squadInit: (msg) => {
		window.onbeforeunload = function() {
            return true;
        };
        squadUI.recieveData(msg);
        squadUI.updateSelfFlowerPetals({top: menuInventory.topPetalContainers, bottom: menuInventory.bottomPetalContainers});
	},
    squadAdd: (msg) => {
        // add client
        squadUI.addClient(msg.squadAdd);
    },
    squadRemove: (msg) => {
        squadUI.removeClient(msg.squadRemove);
    },
    squadName: (msg) => {
        squadUI.findClient(msg.id).name = msg.squadName;
    },
    startingWave: (msg) => {// sets the max
        squadUI.updateStartingWave(msg.id, msg.startingWave, msg.authoritative);
    },
    squadReady: (msg) => {
        const client = squadUI.findClient(msg.id);
        client.ready = msg.squadReady;
        if(msg.squadReady === true){
            client.lastReadyEnableTime = performance.now();
            delete client.lastReadyDisableTime;
        } else {
            client.lastReadyDisableTime = performance.now();
            delete client.lastReadyEnableTime;
        }
    },
    multipleConnections: (msg) => {
        alert('Game closed because you have opened this account on another tab!');
    },
    invalidSquad: (msg) => {
        alert('That squad name is invalid. Please try a different one!');
    },
    squadsCannotContainOnlyNumbers: (msg) => {
        alert('Private Squad codes cannot solely contain numbers! Try adding some letters.');
    },
    invalidPetals: (msg) => {
        alert('Invalid petals! Reloading!');
        localStorage.removeItem('savedPetals');
        window.onbeforeunload = () => {return null};
        location.reload();
    },
    streak: (msg) => {
        if (msg.streakTime){
            streakMenu.init({streak: msg.streak, streakTime: msg.streakTime});
        }
        else{
            streakMenu.init({streak: msg.streak, pc: msg.pc, xp: msg.xp});
        }
    },
    streakReset: (msg) => {
        streakMenu.init({streakLost: true});
    },
    redeemCodeSuccess: (msg) => {
        const data = msg.redeemCodeSuccess;
        const petals = [];
        for(let i = 0; i < data.petalAmount; i++){
            petals.push(new Petal(data.petal));
        }
        // console.log(msg.redeemCodeSuccess);
        if(globalInventory.menuActive === false){
            globalInventory.toggleMenu();
        }
        globalInventory.addPetalContainer(new PetalContainer(petals, {...data, toOscillate: false}, data.id, data.amount, data.attempt));
    },
    serverAnnouncement: (msg)=>{
        chatDiv.classList.remove('hidden');
        appendChatAnnouncement(msg.serverAnnouncement, msg.color);
    }
}

function updateAccountLocalStorage(){
    const usernameInput = document.querySelector('.username');
    const passwordInput = document.querySelector('.password');
    const username = usernameInput.value;
    const hashedPassword = SHA(passwordInput.value + 'Zert Is Gay');
    const hashedPassword2 = SHA(passwordInput.value + 'flowrsalt12345');

    // const betakey = document.querySelector('.betakey').value;
    // localStorage.setItem("betakey", betakey);

    localStorage.setItem("username", username);
    localStorage.setItem("hashedPassword", hashedPassword);
    localStorage.setItem("hashedPassword2", hashedPassword2);
    
}

function fadeOutLoginMenu(){
    const loginMenuEl = document.querySelector('.login-menu');
    loginMenuEl.animate([{opacity: "1"}, {opacity: "0"}], {duration: 1000, iterations: 1, easing: 'cubic-bezier(.11,.69,.3,.98)'});
    setTimeout(() => {
        loginMenuEl.classList.add('hidden');
    }, 980)
}

function fadeInMainMenu(){
    window.state = "menu";
    const menuEl = document.querySelector('.menu');
    menuEl.classList.remove('hidden');
    menuEl.animate([{opacity: "0"}, {opacity: "1"}], {duration: 1000, iterations: 1, easing: 'cubic-bezier(.11,.69,.3,.98)'});
}

function processMenuMessage(data){
    for(let key in data){
        if(processMenuMessageMap[key] !== undefined){
            processMenuMessageMap[key](data);
            return;
        }
    }
}