let room = new Room();
const inputHandler = new InputHandler();
inputHandler.start();

window.selfId = null;

function enterGame(){
    window.state = "game";
    document.querySelector('.menu').style.display = "none";

    globalInventory.fadeOut();
    mobGallery.fadeOut();

    inventory.copy(menuInventory);

    inputHandler.sendInitialInput();

    squadUI.startGame();


    if(window.isEditor !== true){
        chatDiv.classList.remove('hidden');
    }
    
    window.runInterval = setInterval(runGame, 1000 / 30);

    craftingMenu.enterGame();

    if(window.is3D === true) init3DScene();
}

// window.lastSentTime = performance.now();

// let reconnectTries = 5;

// just connects to the server. Reason that this isn't the same as startGame
// is because it would take more time to connect and send an initial message
// than it would just to send the initial message
// async function initGame(gameServerPort){
//     console.log('attempting to connect to server at port', {gameServerPort});

//     const ws = new WebSocket(gameServerPort);
//     ws.binaryType = "arraybuffer";
//     window.gameWS = ws;

//     fov = 1;
//     renderFov = .1;
    
//     ws.addEventListener("message", function (data) {
//         // console.log('MESSAGE RECIEVED');
//         try {
//             let msg = msgpackr.unpack(data.data);//msgpack.decode(new Uint8Array(data.data));
//             processMsg(msg);
//         } catch(e){
//             const decoded = new Float32Array(data.data);
//             // console.log({[decoded[0]]: decoded});
//             processRawMessage[/*type*/decoded[0]](decoded);
//             return;
//         }
//     });

//     const reconnectInterval = setTimeout(() => {
//         ws.close();
//         initGame(gameServerPort);
//         console.log('reconnecting');
//         reconnectTries--;
//         if(reconnectTries === 0){
//             clearInterval(reconnectInterval);
//         }
//     }, 1000 + 100 * 2 ** (5-reconnectTries));
    
//     ws.onopen = (e) => {
//         clearInterval(reconnectInterval);
//         window.gameConnected = true;

//         sendGame = (msg) => {
//             ws.send(/*msgpack.encode(msg)*/msgpackr.pack(msg));
//             window.lastSentTime = performance.now();
//         }

//         // TODO: Uncomment
//         // window.pingInterval = setInterval(() => {
//         //     if(performance.now() - window.lastSentTime > 20000){
//         //         sendGame({ping: true});
//         //     }
//         // }, 20000)

//         if(msgQueue.length < 100){
//             for(let i = 0; i < msgQueue.length; i++){
//                 sendGame(msgQueue[i]);
//                 msgQueue = [];
//             }
//         }

//         // TODO: circular in animation like in florr and hornex where there's a grey circle that grows until not visible anymore as an intro to the game
//     }

//     window.gameServerPort = gameServerPort;
// }

// function startGame(roomKey, biome, isTutorial=false){
//     if(window.pingInterval !== undefined){
//         clearInterval(window.pingInterval);
//     }

//     window.state = "game";
//     mainWS.close();
//     document.querySelector('.menu').style.display = "none";

//     globalInventory.fadeOut();

//     inventory.copy(menuInventory);

//     let angle;
//     let magnitude;
//     if (mouseMovement){
//         angle = Math.atan2(mouse.y - window.innerHeight / 2, mouse.x - window.innerWidth / 2);
//         magnitude = Math.min(220,Math.sqrt((mouse.y - window.innerHeight / 2)**2 + (mouse.x - window.innerWidth / 2)**2))
//     }
//     else{
//         angle = 0;
//         magnitude = 0;
//     }
    
//     sendGame({joinRoom: roomKey, username, hashedPassword, name: document.querySelector('.nickname').value, petals: menuInventory.pack(), biome, tutorial: isTutorial, angle, magnitude});

//     if(location.origin !== 'http://localhost:3000'){
//         let tries = 5;
//         window.resendJoinRoomInterval = setInterval(() => {
//             sendGame({joinRoom: roomKey, username, hashedPassword, name: document.querySelector('.nickname').value, petals: menuInventory.pack(), biome, tutorial: isTutorial, angle, magnitude});
//             tries--;
//             if(tries < 0){
//                 clearInterval(window.resendJoinRoomInterval);
//             }
//         }, 7000)
    
//         let gameReconnectTries = 5;
//         window.gameWS.onclose = (e) => {
//             if(window.gameConnected === true){
//                 clearInterval(window.resendJoinRoomInterval);
    
//                 // try to reconnect
//                 if(gameReconnectTries > 0){
//                     console.log('RECONNECTING TO GAME SERVER');
//                     gameReconnectTries--;
    
//                     initGame(window.gameServerPort);
//                     startGame(roomKey, biome, isTutorial);
//                 }
//             }
//             window.gameConnected = false;
//         }
//     }

//     squadUI.startGame();

//     // let lastTime = Date.now();
//     // let delta = 0;
//     // let accum = 0;
//     // setInterval(() => {
//     //     const now = Date.now();
//     //     delta = now - lastTime;
//     //     lastTime = now;

//     //     // accum += delta;

//     //     // while(accum > 1000 / 30){
//     //     //     accum -= 1000 / 30;
//     //         runGame();
//     //     // }
//     // }, 1000 / 30)

//     function run(){
//         // const now = Date.now();
//         // delta = now - lastTime;
//         // lastTime = now;

//         // accum += delta;

//         // while(accum > 1000 / 30){
//         //     accum -= 1000 / 30;
//             runGame();
//         // }
//         // console.log(delta);

        
//         // setTimeout(run, 1000 / 30/* * 2 - delta*/);
//     }

//     // if the last frame took a long time, then run this one faster, so that errors dont compound
//     // client is optimized for rendering, so it wants to run what looks smooth to the pc (which is just normal setInterval)
//     // however, the server is a different machine so the best we can do is update at fixed time which looks a bit different then this.
//     window.runInterval = setInterval(run, 1000 / 30);

//     craftingMenu.enterGame();
// }