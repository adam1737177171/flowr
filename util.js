let mouseMovement = localStorage.getItem('mouseMovement');
if (mouseMovement == null) {
	mouseMovement = true;
	localStorage.setItem('mouseMovement', true);
}
else{
    if (mouseMovement == 'true'){
        mouseMovement = true;
    }
    else{
        mouseMovement = false;
    }
}
let damageFlash = localStorage.getItem('damageFlash');
if (damageFlash == null) {
	damageFlash = false;
	localStorage.setItem('damageFlash', false);
}
else{
    if (damageFlash == 'true'){
        damageFlash = true;
    }
    else{
        damageFlash = false;
    }
}
/*
let lowDetail = localStorage.getItem('lowDetail');
if (lowDetail == undefined || lowDetail == "") {
	lowDetail = false;
	localStorage.setItem('lowDetail', false);
}
else{
    if (lowDetail == 'true'){
        lowDetail = true;
    }
    else{
        lowDetail = false;
    }
}
*/
//window.lowDetail = lowDetail;

if(typeof normalEnemyRenderMap !== 'undefined'){
    enemyRenderMap = normalEnemyRenderMap;
}

let statBoxes = localStorage.getItem('statboxes');
if(statBoxes === null){
    statBoxes = true;
    localStorage.setItem('statboxes', true);
} else {
    if(statBoxes == 'true'){
        statBoxes = true;
    } else {
        statBoxes = false;
    }
}
window.statBoxes = statBoxes;

let damageCounter = localStorage.getItem('damageCounter');
if(damageCounter === null){
    damageCounter = false;
    localStorage.setItem('damageCounter', false);
} else {
    if(damageCounter == 'true'){
        damageCounter = true;
    } else {
        damageCounter = false;
    }
}
window.damageCounter = damageCounter;

let petalRain = localStorage.getItem('petalRain');
if(petalRain == null){
    petalRain = false;
    localStorage.setItem('petalRain', false);
} else {
    if(petalRain == 'true'){
        petalRain = true;
    } else {
        petalRain = false;
    }
}
window.petalRain = petalRain;

let usernames = localStorage.getItem('usernames');
if(usernames == null){
    usernames = false;
    localStorage.setItem('usernames', false);
} else {
    if(usernames == 'true'){
        usernames = true;
    } else {
        usernames = false;
    }
}
window.usernames = usernames;


let showCommunityBiomes = localStorage.getItem('showCommunityBiomes');
if(showCommunityBiomes == null){
    showCommunityBiomes = false;
    localStorage.setItem('showCommunityBiomes', false);
} else {
    if(showCommunityBiomes == 'true'){
        showCommunityBiomes = true;
    } else {
        showCommunityBiomes = false;
    }
}
window.showCommunityBiomes = showCommunityBiomes;




function changeToggleElVal(el, restore = false) {
	const trueIf = el.getAttribute("ev-enabled-if");
	if (trueIf) {
		try {
			if (eval(trueIf)) {
				el.innerHTML = el.getAttribute("ev-enabled-val");
				el.classList.contains("enabled") || el.classList.add("enabled");
			} else {
				el.innerHTML = el.getAttribute("ev-disabled-val");
				el.classList.contains("enabled") && el.classList.remove("enabled");
			}
		} catch (err) {
			console.warn("failed settings element load!", err)
		}
		return;
	}
	const toggled = el.getAttribute("ev-enabled-option");
	if (toggled != null) {
		let i = parseInt(eval(toggled));
		let ni = restore ? i : i + 1;

		let oc = el.getAttribute(`ev-option-${i}-class`)
		let nextAtt = el.getAttribute(`ev-option-${ni}-val`);

		if (!nextAtt) {
			ni = 0;
			nextAtt = el.getAttribute(`ev-option-${ni}-val`);
		}

		let nc = el.getAttribute(`ev-option-${ni}-class`);

		el.innerHTML = nextAtt;
		el.classList.contains(oc) && el.classList.remove(oc);
		el.classList.contains(nc) || el.classList.add(nc);
		return ni;
	}
}

document.querySelectorAll(".toggleEl").forEach((el) => {
	changeToggleElVal(el, true);
});

function closeSquadUI(){
    window.squadUICloseTime = performance.now();
    changeReady(false);
    document.querySelector('.play-text').setAttribute("stroke", "Play");
    document.querySelector('.play-btn').style.backgroundColor = "#1dd129";
    send({leaveRoom: true});
}

function sendRoomRequest(msg){
    if(msg !== undefined)send(msg);
    send({name: document.querySelector('.nickname').value});
    send({updatePetals: menuInventory.pack()});
    window.lastRoomSentTime = performance.now();
    changeReady(false);
    squadUI.removeAllClients();
    menuInventory.sendQueuedChangedPetalsImmediately();
    squadUI.sendSavedStartingWave();
}

window.lastRoomSentTime = 0;
window.onmousedown = (e) => {
	if(window.mobile && !e.mobile){
        return;
    }
    mouse.clickPosition = 'down';
    mouse.lastDownData = {time: performance.now(), x: e.pageX, y: e.pageY};

    if(typeof squadUI === 'undefined'){
        return;
    }

    if(squadUI.hoveringOverX === true && e.button === 0){
        closeSquadUI();
    }

    const mouseX = mouse.x * canvas.w / window.innerWidth;
    const mouseY = mouse.y * canvas.h / window.innerHeight;

    if(window.state === "menu" && e.button === 0 && squadUI.intersectingSliderBound({x: mouseX, y: mouseY})){
        squadUI.startSliderDrag(mouseX);
    }

    // ready: true, name: [username], findPublic: true, newSquad: true
    if(window.connected === true){
        if(performance.now() - window.lastRoomSentTime > 300){
            if(squadUI.hoveringOverPublic === true && e.button === 0){
                sendRoomRequest({findPublic: true, biome: biomeManager.getCurrentBiomeData().current});
            } else if(squadUI.hoveringOverNew === true && e.button === 0){
                sendRoomRequest({newSquad: true, biome: biomeManager.getCurrentBiomeData().current});
            } else if(squadUI.hoveringOverPrivate === true && e.button === 0){
                const squadCode = prompt('Enter Private Squad Code');
                if(squadCode !== null){
                    sendRoomRequest({findPrivate: true, biome: biomeManager.getCurrentBiomeData().current, squadCode});
                }
            } else if(squadUI.hoveringOverJoinMainPvp === true && e.button === 0){
                sendRoomRequest({newSquad: true, biome: biomeManager.getCurrentBiomeData().current});
                send({joinMainPvp: true});
                window.inMainPvpRoom = true;
            }// else if(squadUI.hoveringOverQuickJoin === true && e.button === 0){
            //     sendRoomRequest({quickJoin: true, biome: biomeManager.getCurrentBiomeData().current});
            // }
        }

        if((globalInventory.hoveringOverButton === true || globalInventory.hoveringOverX) && e.button === 0){
            globalInventory.toggleMenu();
        } else if((craftingMenu.hoveringOverButton === true || craftingMenu.hoveringOverX) && e.button === 0){
            craftingMenu.toggleMenu();
        } else if((changelog.hoveringOverX) && e.button === 0){
            changelog.toggle();
        }

        settingsMenu.mouseDown({mouseX, mouseY, x: mouseX, y: mouseY});

        menuInventory.mouseDown({mouseX, mouseY, menuInventory}, menuInventory);

        mobGallery.mouseDown({x: mouseX, y: mouseY});

        if(changelog.active === true){
            changelog.mouseDown({mouseX, mouseY});
        }

        if(globalInventory.menuActive === true && draggingPetalContainer === null){
            globalInventory.mouseDown({mouseX, mouseY}, menuInventory);
        } else if(craftingMenu.menuActive === true){
            craftingMenu.mouseDown({mouseX, mouseY}, e);
        }
    }

    // requestAnimationFrame(() => {
    //     ctx.beginPath();
    //     ctx.fillStyle = 'red';
    //     ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
    //     ctx.fill();
    //     ctx.closePath();
    // })

    if(window.state === "menu"){
        biomeManager.mouseDown({mouseX, mouseY}, e);
        for(let i = 0; i < menuEnemies.length; i++){
            const e = menuEnemies[i];
            if(Math.sqrt((mouseX - e.render.x) ** 2 + (mouseY - e.render.y) ** 2) < e.radius && e.dead !== true){
                if(e.hp <= 0){
                    e.dead = true;
                } else {
                    e.hp -= (1 + Math.min(10,maxRarityObtained));
                    e.updateRenderDamage();
                }
            }
        }

        streakMenu.mouseDown({mouseX, mouseY});
    }
    

    if(room !== undefined && selfId !== null && window.isDead === true){
        if(deadMenu.hoveringOverButton === true){
            // if(window.tutorial === true){
            //     // delete window.tutorial;
            //     // const MenuEl = document.querySelector('.menu');
            //     // MenuEl.classList.remove('hidden');
            //     location.reload();
            // } else {
                deadMenu.rematchRequested = false;
                if (deadMenu.acceptedDeath === true || window.is3D === true){
                    send({leaveGame: true, real: true});
                }
                else{
                    deadMenu.acceptedDeath = true;
                }
                // we don't do any initting back to the menu just yet.
                // We have to wait until the server acknowledges that we left
                // the game (through the acknowledgeleavegame message) and then
                // we can reset everything.
            // }
        } else if(deadMenu.hoveringOverRematchButton === true){
            deadMenu.rematchRequested = true;
            send({rematchRequested: true});
        }
    }
    else if(room !== undefined && selfId !== null && window.isDead !== true){
        // if(globalInventory.menuActive === true){
        //     // handling intersecting petals in globalInventory. This can probably be done much more efficiently with % operations but idc
        //     for(let i = 0; i < numberOfRarities; i++){
        //         if(globalInventory.petalContainers[i] === undefined){
        //             continue;
        //         }
        //         for(let j = 0; j < globalInventory.petalContainers[i].length; j++){
        //             const petalContainer = globalInventory.petalContainers[i][j];
        //             if(mouseX > petalContainer.x - petalContainer.w/2 && mouseX < petalContainer.x + petalContainer.w/2 && mouseY > petalContainer.y - petalContainer.h/2 && mouseY < petalContainer.y + petalContainer.h/2){
        //                 // for now we'll just equip the petal, but in the future we would want to start a petal drag
        //                 let position = -1;
        //                 for(let i = 0; i < inventory.bottomPetalSlots.length; i++){
        //                     if(inventory.bottomPetalContainers[i] === undefined){
        //                         position = i;
        //                         break;
        //                     }
        //                 }
        //                 if(position === -1){
        //                     return;
        //                 }
        //                 inventory.addPetalContainer(new PetalContainer(petalContainer.petals, petalContainer, petalContainer.id, 1), false, position);
                        
        //                 globalInventory.removePetalContainer(petalContainer);
        //                 return;
        //             }
        //         }
        //     }
        //     // intersecting globalinventory
        //     if(mouseX > 130 && mouseY > canvas.h - 700 - 20 && mouseX < 130 + 510 && mouseY < canvas.h - 20){
        //         return;
        //     }
        // }
        // intersecting globalInventory button
        // if(mouseX > 20 + 15 && mouseX < 20 + 15 + 80 - 15 * 2 && mouseY > canvas.h - 20 - 80 + 15 && mouseY < canvas.h - 20 - 80 + 15 + 80 - 15 * 2){//20 + 15, canvas.h - 20 - 80 + 15, 80 - 15 * 2, 80 - 15 * 2
        //     return;
        // }
        if(window.mobile){
            mobileControls.handleMousePress(e);
        }else{
            if(e.button == 0){
                // sendGame({attack: true});
                send(['a', true]);
                // room.flowers[selfId].attacking = true;
            } else if(e.button == 2){
                // sendGame({defend: true});
                send(['d', true]);
                // room.flowers[selfId].defending = true;
            }
            if(window.state === "game")inputHandler.updateChat();
        }
    }
}

window.onmouseout = (e) => {
    if(window.state === 'menu'){
        inputHandler.handleMouse({...e, button: 0, x: -1E99, y: -1E99, pageX: -1E99, pageY: -1E99});
    }
}

let fov = 1;
let renderFov = fov;
document.addEventListener("wheel", (e) => {
    if(window.state === 'game'){
        fov /= 1 / (1 - e.deltaY / 700);
        if (fov < 0.2) {
            fov = 0.2;
        }
        if (fov > 3) {
            fov = 3;
        }
    }

    const mouseX = mouse.x * canvas.w / window.innerWidth;
    const mouseY = mouse.y * canvas.h / window.innerHeight;
    globalInventory.updateScroll({x: e.deltaX, y: e.deltaY}, {mouseX, mouseY});
    craftingMenu.updateScroll({x: e.deltaX, y: e.deltaY}, {mouseX, mouseY});
    mobGallery.updateScroll({x: e.deltaX, y: e.deltaY}, {mouseX, mouseY});
    changelog.updateScroll({x: e.deltaX, y: e.deltaY}, {mouseX, mouseY});

});

window.onmouseup = (e) => {
	if(window.mobile && !e.mobile){
        return;
    }
    mouse.clickPosition = 'up';

    // const mouseX = mouse.x * canvas.width / canvas.w;
    // const mouseY = mouse.y * canvas.height / canvas.h;

    if(typeof room !== "undefined" && selfId !== null && window.isDead !== true){
        if(window.mobile){
            mobileControls.releaseControls(e);
        }else{
            if(e.button == 0){
                // sendGame({attack: false});
                send(['a', false]);
                // room.flowers[selfId].attacking = false;
            } else if(e.button == 2){
                // sendGame({defend: false});
                send(['d', false]);
                // room.flowers[selfId].defending = false;
            }
        }
    }

    const mouseX = mouse.x * canvas.w / window.innerWidth;
    const mouseY = mouse.y * canvas.h / window.innerHeight;

    if(window.state === "menu" && squadUI.hoveringOverSlider === true && e.button === 0){
        squadUI.endSliderDrag(mouseX);
    }

    if(window.connected === true){
        // if(globalInventory.menuActive === true){
            globalInventory.mouseUp({mouseX, mouseY}, menuInventory);
        // }
        mobGallery.mouseUp({mouseX, mouseY});
        if(craftingMenu.menuActive === true){
            craftingMenu.mouseUp({mouseX, mouseY});
        }
        if(changelog.active === true){
            changelog.mouseUp({mouseX, mouseY});
        }
        
    }

    if(window.state === "game")inputHandler.updateChat();
}

document.onvisibilitychange = (e) => {
    if(typeof room !== "undefined" && selfId !== null){
        if(window.isDead !== true){
            if(room.flowers[selfId].attacking === true)send(['a', false]);//sendGame({attack: false});
            if(room.flowers[selfId].defending === true)send(['d', false]);//sendGame({defend: false});
            // room.flowers[selfId].defending = false;
            // room.flowers[selfId].attacking = false;
        }
    }
}

const nickname = localStorage.getItem("nickname");
if(typeof nickname === "string"){
    document.querySelector('.nickname').value = nickname;
}

document.querySelector('.nickname').oninput = (e) => {
    send({name: document.querySelector('.nickname').value});
    localStorage.setItem("nickname", document.querySelector('.nickname').value);
}

window.ready = false;
function changeReady(state, toSend=true){
    if(toSend) {
        // we're the last one ready, send petals just in case we didn't earlier
        if(state === true && squadUI.clients.filter(c => c.ready === false).length === 1){
            send({changePetals: true, ...menuInventory.pack()});
        }
        send({ready: state});
    }
    window.ready = state;
    document.querySelector('.play-btn').style.backgroundColor = window.ready ? "#1dd129" : "#d11d1d";
}


// const typeToNumber = {
// 	Basic: 0,
// 	Light: 1,
// 	Stinger: 2,
// 	Sand: 3,
// 	Leaf: 4,
// 	Rock: 5,
// 	Faster: 6
// }

// const numberToType = {};
// for(let key in typeToNumber){
// 	numberToType[typeToNumber[key]] = key;
// }

// function encodePetals(petals=[{rarity: 'common', type: 'Basic', amount: 5, attempt: 0}]){
// 	let encoded = [];
// 	for(let i = 0; i < petals.length; i++){
// 		encoded.push(petals[i].rarity);
// 		encoded.push(typeToNumber[petals[i].type]);
// 		if(typeToNumber[petals[i].type] === undefined){
// 			console.error('TypeToNumber for petal type ' + petals[i].type + ' not defined. client/util.js');
// 		}
// 		encoded.push(petals[i].amount);
//         if (petals[i].attempt){
//             encoded.push(petals[i].attempt);
//         }
//         else{
//             encoded.push(0);
//         }
// 	}
// 	return encoded;
// 	// basic will return [0, 0, 5]
// }

// function decodePetals(data=[0, 0, 5, 0]){// 5 common basics
// 	let decoded = [];
// 	for(let i = 0; i < data.length; i += 4){
// 		decoded.push({
// 			rarity: data[i],
// 			type: numberToType[data[i+1]],
// 			amount: data[i+2],
//             attempt: data[i+3]
// 		})
// 	}
//   return decoded;
// }

document.getElementById("settingsButton").onclick = () => {
    settingsMenu.toggle();
}
document.getElementById("changelogButton").onclick = () => {
    changelog.toggle();
}

// CanvasRenderingContext2D.prototype.translate = function(a) {
//     return function(x,y) {
//       a.call(this, Math.round(x),Math.round(y));
//     };
// }(CanvasRenderingContext2D.prototype.translate);

// CanvasRenderingContext2D.prototype.scale = function(a) {
//     return function(x,y) {
//       a.call(this, x, y);
//     };
// }(CanvasRenderingContext2D.prototype.scale);

// CanvasRenderingContext2D.prototype.strokeText = function(a) {
//     return function(t, x,y) {
//       a.call(this, t, Math.floor(x),Math.floor(y));
//     };
// }(CanvasRenderingContext2D.prototype.strokeText);

// CanvasRenderingContext2D.prototype.fillText = function(a) {
//     return function(t, x,y) {
//       a.call(this, t, Math.floor(x),Math.floor(y));
//     };
// }(CanvasRenderingContext2D.prototype.fillText);

// ctx._lineWidth = ctx._lineWidth;
// Object.defineProperty(ctx, 'lineWidth', {
//     get(){
//         return ctx._lineWidth;
//     },
//     set(v){
//         ctx._lineWidth = Math.floor(v);
//     },
//     writable: true,
//     enumerable: true,
//     configurable: true
// })

// note: these should only be petals that are not attached (ex. light) and not ones that are like stinger
// also if petals like dandelion are sometimes single (at lower rarities) that's ok and is handled in code.
const multiPetals = {
    Light: true,
    Pollen: true,
    Dandelion: true
}

// this exists server side stats.js as well. If you modify anything here then make sure to update it in stats.js server side as well.
function levelPerXp(xp) {
    // returns level (should be decimal)
   return 11.18213 * Math.log(0.000480827337943866 * (2080 + xp));
}
function xpPerLevel(level) {
    return (Math.exp(level / 11.18213) / 0.000480827337943866) - 2080
}


const basePetalSlots = 5;
const petalSlotThresholds = [15, 30, 45, 60, 75, 1000];

// document.body.style.cursor = 'auto';

window.cursorResetTimeout = null;
function setCursor(v){
    if(window.cursorResetTimeout !== null){
        clearTimeout(window.cursorResetTimeout);
    }
    if(v !== "auto"){
        window.cursorResetTimeout = setTimeout(() => {
            document.body.style.cursor = 'auto';
        }, 50)
    }
    document.body.style.cursor = v;
}

// const closeTab = () => window.close(``, `_parent`, ``);
// localStorage.openpages = Date.now();
// window.addEventListener('storage', function(e){
//     if(e.key == "openpages"){
//         // Listen if anybody else is opening the same page!
//         localStorage.page_available = Date.now();
//     }
//     if(e.key == "page_available"){
//         // alert("Multiboxing detected! Please do not have more than one game tab open!");
//         closeTab();
//     }
// }, false);


const mobileDiv = document.querySelector('.mobile');
const chatDiv = document.querySelector('.chatContainer');
const chatMsgContainer = document.querySelector('.chat-div');
const chatInput = document.querySelector('.chat');

let mobileAttackingState = false;
let mobileDefendingState = false;

window.mobile = false;

if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    window.mobile = true;
}

document.addEventListener("touchmove" /*touch move, touch take*/, (e) => {
    //console.log(e);
    const touch = e.changedTouches[0];
    inputHandler.handleMouse({
        x: touch.pageX,
        y: touch.pageY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        button: 0
    });
})

document.addEventListener("touchstart", (e) => {
    const touch = e.changedTouches[0];
    inputHandler.handleMouse({
        x: touch.pageX,
        y: touch.pageY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        button: 0
    });
   //wait a bit so all menus can process new "hovers"
   setTimeout(()=>{
    window.onmousedown({...e, x: touch.pageX, y: touch.pageY, pageX: touch.pageX, pageY: touch.pageY, button: 0, mobile: true});

   }, 10);
})

document.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    inputHandler.handleMouse({
        x: touch.pageX,
        y: touch.pageY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        button: 0
    });
    //wait a bit so all menus can process new "hovers"
    setTimeout(()=>{
        window.onmouseup({...e, x: touch.pageX, y: touch.pageY, pageX: touch.pageX, pageY: touch.pageY, button: 0, mobile: true});

    }, 100);
})


window.chatMessages = [];
window.chatMsgFadeTimes = [];
function appendChatMessage(msg){
    window.chatMessages.push(msg);
    window.chatMsgFadeTimes.push(0);
}
function appendChatMessage(msg){
    const chatMessage = document.createElement('div');
    chatMessage.innerText = msg;
    chatMessage.className = "chat-message";
    chatMsgContainer.prepend(chatMessage);
    setTimeout(() => {
        // animating fadeout after 5s
        chatMessage.animate([
            {
                opacity: 1,
            },
            {
                transform: 'rotateZ(2deg)',
                'font-size': '0rem',
                opacity: 0,
            },
        ], {
            duration: 1000,
            iterations: 1
        });
        
        setTimeout(() => {
            chatMessage.remove();
        }, 950);
    }, 30000);
}
function appendChatAnnouncement(msg, color){
    const chatMessage = document.createElement('div');
    chatMessage.innerText = msg;
    chatMessage.className = "chat-announcement";
    chatMessage.style.color = color;
    chatMsgContainer.prepend(chatMessage);
    setTimeout(() => {
        // animating fadeout after 5s
        chatMessage.animate([
            {
                opacity: 1,
            },
            {
                transform: 'rotateZ(2deg)',
                'font-size': '0rem',
                opacity: 0,
            },
        ], {
            duration: 1000,
            iterations: 1
        });
        
        setTimeout(() => {
            chatMessage.remove();
        }, 950);
    }, 30000);
}

if(window.mobile){
    chatInput.addEventListener("click", ()=>{
        chatDiv.classList.remove('hidden');
        chatInput.focus();
        
        inputHandler.chatOpen = true;
        chatInput.style.opacity = "1";

        let text = prompt("Send a chat message");
        if(text.length !== 0){
            send(['c', text]);
        }
        
        inputHandler.chatOpen = false;
        chatInput.value = '';
        chatInput.blur();

        chatInput.style.opacity = "0";
    })
}