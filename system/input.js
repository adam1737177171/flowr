const mouse = {x: 0, y: 0, canvasX: 0, canvasY: 0, clickPosition: 'up', lastDownData: {time: -Infinity, x: 0, y: 0}};
const keyCodes = {
    KeyW: 'up',
    KeyA: 'left',
    KeyS: 'down',
    KeyD: 'right',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowRight: 'right',
}

const directionToIdMap = {
    'up': 0,
    'left': 1,
    'down': 2,
    'right': 3
}
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

let latestInput = [];
let previousInput = null;
let lastSentInput = window.performance.now();
let minimumInputTime = 1000 / 35 * 2;

const chatCommandMap = {
    // 'reset': (handler, { client }) => {
    //     client.send({changeMap: 'Hub'});
    //     client.game.lastRequestedMapTime = performance.now();
    // },
    // 'devmodeoN': (handler, { client }) => {
    //     client.me().dev = !client.me().dev;
    // },
    // 'export': (handler, { client }) => {
    //     navigator.clipboard.writeText(JSON.stringify({...handler.map.initPack(), players: undefined}));
    // }
}

class InputHandler {
    constructor(client){
        this.client = client;

        this.chatOpen = false;
    }
    start() {
        window.onkeydown = (e) => this.handleKey(e);
        window.onkeyup = (e) => this.handleKey(e);
        window.onmousemove = (e) => this.handleMouse(e);

        // prevent right click
        window.addEventListener("contextmenu", e => e.preventDefault());

        // make current keys pressed stop if user navigates out of tab
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                for(let key in this.input){
                    this.input[key] = false;
                }
            }
        });
    }
    updateChat(){
        if(document.activeElement === chatInput){
            if(this.chatOpen === false){
                chatDiv.classList.remove('hidden');
                chatInput.focus();
            }
            this.chatOpen = true;
            chatInput.style.opacity = "1";
        } else {
            if(this.chatOpen === true){
                // chatDiv.classList.add('hidden');
                chatInput.blur();
            }
            this.chatOpen = false;
            chatInput.style.opacity = "0";
        }
    }
    handleKey(e){
        if(e.code === undefined){
            return;
        }
        //console.log(e.code, e.key);
        // make sure the user hasn't selected / deselected the chat between inputs
        this.updateChat();

        // handling enter inputs
        if(window.state !== 'game'){
            this.chatOpen = false;
        } else if (e.code === 'Enter' && window.isEditor !== true) {
            if (this.chatOpen === true && e.type === 'keydown') {
                // send chat message
                const text = chatInput.value.trim();
                // if(text[0] === '/'){
                //     for(let key in chatCommandMap){
                //         if(text.startsWith(key) === true){
                //             chatCommandMap[key](this, { client: this.client });
                //             this.chatOpen = false;
                //             chatInput.value = '';
                //             chatInput.blur();
                //             return;
                //         }
                //     }
                // }
                if(text.length !== 0){
                    send(['c', text]);
                }
                
                this.chatOpen = false;
                chatInput.value = '';
                chatInput.blur();

                chatInput.style.opacity = "0";

                // reset inputs to prevent ghosting
                // for(let key in this.input){
                //     this.input[key] = false;
                // }
            } else if (e.type === 'keydown') {
                // focus chat
                this.chatOpen = true;
                chatDiv.classList.remove('hidden');
                chatInput.focus();

                chatInput.style.opacity = "1";

                if(!arrayEquals(latestInput, [0,0,0,0])){
                    latestInput = [0,0,0,0];
                    send(latestInput);
                }
                const me = room.flowers[window.selfId];
                if(me.attacking === true){
                    me.attacking = false;
                    send({attack: false});
                }
                if(me.defending === true){
                    me.defending = false;
                    send({defend: false});
                }
            }
            return e.preventDefault();
        }

        // if we're typing, return
        // if(this.chatOpen === true)return;

        // if we're not typing and we repeat keys, return
        if (e.repeat && this.chatOpen === false) return e.preventDefault();
        if(this.chatOpen === true) return;

        if(e.code === "Semicolon" && e.repeat === false && e.type === 'keydown'){
            window.toRenderDebug = !window.toRenderDebug;
            window.fps = 0;
            window.framesRendered = 0;
            window.lastFramesRenderedResetTime = performance.now();
        }

        // swapping petals
        if(e.code.startsWith("Digit") === true && e.repeat === false && e.type === 'keydown' && document.activeElement.tagName !== 'INPUT'){
            const petalIndex = e.code === "Digit0" ? 9 : e.code[5] - 1;
            if(petalIndex === undefined)return;
            if(window.state === 'menu'){
                menuInventory.swapPetals(petalIndex);
            } else {
                inventory.swapPetals(petalIndex);   
            }
        }
        else if (e.code === "KeyR" && e.repeat === false && e.type === 'keydown' && document.activeElement.tagName !== 'INPUT'){
            for(let i = 0; i < 10; i++){
                inventory.swapPetals(i);
            }
        }
        // else if (e.key === "f" && e.repeat === false && e.type === 'keydown' && document.activeElement.tagName !== 'INPUT'){
        //     window.toRenderHitboxes = !window.toRenderHitboxes;
        // }

        // otherwise, set inputs in this.inputs as they're mapped by keyCodes
        const me = room.flowers[window.selfId];
        if (window.connected === true && me !== undefined){
            if (!mouseMovement){
                /*
                const me = room.flowers[window.selfId];
                if(me !== undefined){
                    me.input[keyCodes[e.code]] = e.type === 'keydown';
                }
                */
            if (keyCodes[e.code]){
                    // let type = e.type === 'keydown';
                    //sendGame({key: keyCodes[e.code], type})
                    if (latestInput.length != 4){
                        latestInput = [0, 0, 0, 0];
                    }
                    if (e.type === 'keydown'){
                        latestInput[directionToIdMap[keyCodes[e.code]]] = 1;
                    }
                    else{
                        latestInput[directionToIdMap[keyCodes[e.code]]] = 0;
                    }

                    // if(time - lastSentInput < minimumInputTime){
                    //     setTimeout(() => {
                    //         this.handleKey(e);
                    //     }, minimumInputTime)
                    //     return;
                    // }

                    if (/*time - lastSentInput > minimumInputTime &&*/ !arrayEquals(latestInput, previousInput)){
                        send(latestInput);
                        previousInput = window.structuredClone(latestInput);
                        lastSentInput = time;// wtf this is way more complicated then it needs to e
                    }
                    
                    
                    me.input[keyCodes[e.code]] = e.type === 'keydown'

                    let velX = 0;
                    let velY = 0;
                    if (me.input["up"]){
                        velY -= 1;
                    }
                    if (me.input["down"]){
                        velY += 1;
                    }
                    if (me.input["left"]){
                        velX -= 1;
                    }
                    if (me.input["right"]){
                        velX += 1;
                    }
                    let angle = Math.atan2(velY, velX);
                    if (velY != 0 || velX != 0){
                        me.angle = angle;
                        me.magnitude = 999;
                    }
            }
            }
            if(e.key == " "){
                send({attack: e.type === 'keydown'});
                room.flowers[window.selfId].attacking = e.type === 'keydown';
            }
            if (e.key == "Shift"){
                send({defend: e.type === 'keydown'});
                room.flowers[window.selfId].defending = e.type === 'keydown';
            }
            if (e.key == "["&& e.type === 'keydown'){
                fov = 1;
            }
            if (e.code == "Equal" && e.type === 'keydown'){
                fov *= (1 + 1/5);
                if (fov < 0.2) {
                    fov = 0.2;
                }
                if (fov > 3) {
                    fov = 3;
                }
                        
            }
            if (e.code == "Minus" && e.type === 'keydown'){
                fov *= (1 - 1/5);
                if (fov < 0.2) {
                    fov = 0.2;
                }
                if (fov > 3) {
                    fov = 3;
                }
                
            }
        }
        if(window.state === 'menu' && e.type === 'keydown' && document.activeElement.tagName !== 'INPUT'){
            if(e.key.toLowerCase() === 'x'){
                globalInventory.toggleMenu();
            } else if(e.key.toLowerCase() === 'c'){
                craftingMenu.toggleMenu();
            } else if(e.key.toLowerCase() === 'v'){
                mobGallery.toggleMenu();
            }
        }
    }
    sendInitialInput(){
        if(mouseMovement){
            const dX = mouse.x - window.innerWidth / 2;
            const dY = mouse.y - window.innerHeight / 2;
            let magnitude = Math.sqrt(dY**2+dX**2);
            if(magnitude >= 220){
                magnitude = 220;
            } else {
                magnitude = ((magnitude / 220) ** 0.9) * 220;
            }

            if (latestInput.length != 2){
                latestInput = [0, 0];
            }
            const angle = Math.atan2(dY, dX);
            latestInput[0] = Math.round(angle * 1000)/1000;
            latestInput[1] = Math.round(magnitude * 10) / 10;

            // removing 220 from the array if its not needed
            if(latestInput[1] === 220) latestInput.length = 1;

            send(latestInput);
        }
    }
    handleMouse(e) {
        const dX = e.x - window.innerWidth / 2;
        const dY = e.y - window.innerHeight / 2;
        const me = room.flowers[window.selfId];
        if(window.connected === true && me !== undefined && mouseMovement){
            if(window.mobile){
                mobileControls.handleMouseMove(e);

            }else{
                let magnitude = Math.sqrt(dY**2+dX**2);
                if(magnitude >= 220){
                    magnitude = 220;
                } else {
                    magnitude = ((magnitude / 220) ** 0.9) * 220;
                }
                me.angle = Math.atan2(dY, dX);
                me.magnitude = magnitude;
    
                if (latestInput.length != 2){
                    latestInput = [0, 0];
                }
                latestInput[0] = Math.round(me.angle * 1000)/1000;
                latestInput[1] = Math.round(magnitude * 10) / 10;
    
                // removing 220 from the array if its not needed
                if(latestInput[1] === 220) latestInput.length = 1;
    
                if ((time-lastSentInput) > minimumInputTime && !arrayEquals(latestInput, previousInput)){
                    send(latestInput);
                    previousInput = window.structuredClone(latestInput);
                    lastSentInput = time;
                }
            }
            
        }
        
        // const me = room.flowers[window.selfId];
        // if(me !== undefined){
        //     me.angle = Math.atan2(dY, dX);
        //     me.magnitude = Math.min(220, Math.sqrt(dY**2 + dX**2));
        //     if(me.magnitude < 220){
        //         me.magnitude = ((me.magnitude / 220) ** 0.9) * 220;
        //     }
        // }
        // console.log(dY, dX);

        // for menu
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        mouse.canvasX = mouse.x / window.innerWidth * canvas.w;
        mouse.canvasY = mouse.y / window.innerHeight * canvas.h; 

        if(typeof draggingPetalContainer !== 'undefined'){
            if(draggingPetalContainer !== null){
                simulatedraggingPetalContainer(mouse.canvasX, mouse.canvasY);
            }
        }

        if(window.state === "menu"){
            const mouseX = mouse.canvasX;
            const mouseY = mouse.canvasY;
            biomeManager.mouseMove({mouseX, mouseY}, e);

            if(squadUI.hoveringOverSlider === true && e.button === 0 && squadUI.draggingSlider === true){
                squadUI.updateSliderDrag(mouse.canvasX);
            }

            settingsMenu.mouseMove({x: mouseX, y: mouseY});
        }

        if(typeof globalInventory !== 'undefined'){
            globalInventory.mouseMove({mouseX: mouse.canvasX, mouseY: mouse.canvasY})
            changelog.mouseMove({mouseX: mouse.canvasX, mouseY: mouse.canvasY})
            craftingMenu.mouseMove({mouseX: mouse.canvasX, mouseY: mouse.canvasY});
            mobGallery.mouseMove({x: mouse.canvasX, y: mouse.canvasY});
        }
    }
}


class MobileControls{
    constructor(){
        this.joystickpad = {
            x: canvas.w * 1/10,
            y: canvas.h  - canvas.w * 1/10,
            r: canvas.w / 15
        }
        this.joystick = {
            r: canvas.w / 40,
            magnitude: 0,
            angle: 0,
        }
        this.currentlyHolding = false;
        this.attacking = false;
        this.defending = false;

    }

    draw(){
        const me = room.flowers[window.selfId];
        if(!(window.mobile && me !== undefined && window.connected === true)) return;
        //draw joystick
        this.joystickpad = {
            x: canvas.w * 1/10,
            y: canvas.h  - canvas.w * 1/10,
            r: canvas.w / 15
        }
        this.joystick.r = canvas.w/40;
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.joystickpad.x, this.joystickpad.y, this.joystickpad.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        this.joystick.dx = Math.cos(this.joystick.angle) * this.joystick.magnitude;
        this.joystick.dy = Math.sin(this.joystick.angle) * this.joystick.magnitude;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.joystickpad.x + this.joystick.dx, this.joystickpad.y + this.joystick.dy, this.joystick.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        //draw Attack/ Defend

        this.attackButton = {
            x: canvas.w * 8.4/10,
            y: canvas.h  - canvas.w * 1.4/10,
            r: canvas.w / 20
        }
        this.defendButton = {
            x: canvas.w * 9.3/10,
            y: canvas.h  - canvas.w * 0.5/10,
            r: canvas.w / 25
        }

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.attackButton.x, this.attackButton.y, this.attackButton.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.defendButton.x, this.defendButton.y, this.defendButton.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        //draw + / - for fov
        this.plusButton = {
            x: canvas.w * 8.6/10,
            y: canvas.h  - canvas.w * 0.5/10,
            r: canvas.w / 70
        }
        this.minusButton = {
            x: canvas.w * 8.2/10,
            y: canvas.h  - canvas.w * 0.5/10,
            r: canvas.w / 70
        }

        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(this.plusButton.x - this.plusButton.r, this.plusButton.y);
        ctx.lineTo(this.plusButton.x + this.plusButton.r, this.plusButton.y)
        ctx.moveTo(this.plusButton.x, this.plusButton.y - this.plusButton.r);
        ctx.lineTo(this.plusButton.x, this.plusButton.y + this.plusButton.r)
        ctx.lineWidth = 15;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(this.minusButton.x - this.minusButton.r, this.minusButton.y);
        ctx.lineTo(this.minusButton.x + this.minusButton.r, this.minusButton.y)
        ctx.lineWidth = 15;
        ctx.stroke();
        ctx.globalAlpha = 1;



    }
    handleMousePress(e){
        //convert to canvas loc

        const cX = e.x / window.innerWidth * canvas.w;
        const cY = e.y / window.innerHeight * canvas.h; 
        //console.log(cX, cY);
        //console.log(this.joystickpad);
        if(this.inCircleBounds(cX,cY, this.joystickpad)){
            this.currentlyHolding = true;
        }
        if(this.inCircleBounds(cX, cY, this.attackButton)){
            send(['a', true]);
            this.attacking = true;
        }
        if(this.inCircleBounds(cX, cY, this.defendButton)){
            send(['d', true]);
            this.defending = true;
        }
        if(this.inCircleBounds(cX, cY, this.plusButton)){
            fov *= (1 + 1/5);
            if (fov < 0.2) {
                fov = 0.2;
            }
            if (fov > 3) {
                fov = 3;
            }
        }
        if(this.inCircleBounds(cX, cY, this.minusButton)){
            fov *= (1 - 1/5);
            if (fov < 0.2) {
                fov = 0.2;
            }
            if (fov > 3) {
                fov = 3;
            }
        }
    }
    handleMouseMove(e){
        //convert to canvas loc
        if(this.currentlyHolding === false) return;
        const cX = e.x / window.innerWidth * canvas.w;
        const cY = e.y / window.innerHeight * canvas.h; 
        //console.log(cX, cY);
        //console.log(this.joystickpad);
        if(cX > canvas.w/2){
            return;
            //other side
        }

        //handle joystick position
        this.joystick = {
            r: canvas.w / 40,
            magnitude: 0,
            angle: 0,
        }
        const sensitiveDistance = 3/5 * this.joystickpad.r;
        const dX = cX - this.joystickpad.x;
        const dY = cY - this.joystickpad.y;

        const me = room.flowers[window.selfId];

        let magnitude = Math.sqrt(dY**2+dX**2);
        if(magnitude >= sensitiveDistance){
            this.joystick.magnitude = sensitiveDistance;
            magnitude = 220;
        }else if(magnitude < sensitiveDistance/5){
            this.joystick.magnitude = 0;
            magnitude = 0;
        } else {
            this.joystick.magnitude = ((magnitude / sensitiveDistance) ** 0.9) * sensitiveDistance;
            magnitude = ((magnitude / sensitiveDistance) ** 0.9) * 220;
        }
        me.angle = Math.atan2(dY, dX);
        this.joystick.angle = me.angle;
        me.magnitude = magnitude;

        if (latestInput.length != 2){
            latestInput = [0, 0];
        }
        latestInput[0] = Math.round(me.angle * 1000)/1000;
        latestInput[1] = Math.round(magnitude * 10) / 10;

        if ((time-lastSentInput) > minimumInputTime && !arrayEquals(latestInput, previousInput)){
            send(latestInput);
            previousInput = window.structuredClone(latestInput);
            lastSentInput = time;
        }


    }
    releaseControls(e){
        const cX = e.x / window.innerWidth * canvas.w;
        const cY = e.y / window.innerHeight * canvas.h; 

        //on JOYSTICK SIDE
        if(cX < canvas.w/2){
            this.currentlyHolding = false;
            if (latestInput.length != 2){
                latestInput = [0, 0];
            }
            latestInput[0] = 0;
            latestInput[1] = 0;
            this.joystick.angle = 0;
            this.joystick.magnitude = 0;
            if ((time-lastSentInput) > minimumInputTime && !arrayEquals(latestInput, previousInput)){
                send(latestInput);
                previousInput = window.structuredClone(latestInput);
                lastSentInput = time;
            }
        }


        //on ATTACK/DEFEND SIDE
        if(cX > canvas.w/2){
            if(this.attacking){
                send(['a', false]);
                this.attacking = false;
            }
            if(this.defending){
                send(['d', false]);
                this.defending = false;
            }
        }

    }
    inCircleBounds(x, y, obj){
        return x < obj.x + obj.r && x > obj.x - obj.r && y < obj.y + obj.r && y > obj.y- obj.r;
    }
}