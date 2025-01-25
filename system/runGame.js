let collectedPetalContainers = [];
function runGame(){
    // const me = room.flowers[window.selfId];
    // if(me === undefined){
    //     return;
    // }
    
    // for(let id in room.flowers){
    //     // room.flowers[id].predictMovement();
    //     room.flowers[id].simulate(room);
    // }

    for(let id in room.enemies){
        // room.enemies[id].simulate(room);
        if(room.enemies[id].dead === true && room.enemies[id].deadAnimationTimer > 166){
            delete room.enemies[id];
        }
    }

    if(window.isDead === true && window.automaticallyLeaveFlag === true){
        delete window.automaticallyLeaveFlag;
        petalReloadData = {};
        petalHpData = {};
        send({leaveGame: true, real: true});
    }

    const me = room.flowers[window.selfId];
    if(me === undefined){
        return;
    }
    
    collectedPetalContainers = [];
    for(let id in room.petalContainers){
        const pc = room.petalContainers[id];
        if(Math.sqrt((pc.x - me.headX) ** 2 + (pc.y - me.headY) ** 2) < me.radius - 25 + 25*me.pickupRadiusMultiplier + pc.radius){
            if(pc.clientCollected !== undefined){
                pc.clientCollected++;
                if(pc.clientCollected > 15){//.2s
                    delete pc.clientCollected;
                }
                continue;
            }
            collectedPetalContainers.push(pc.id);
            pc.clientCollected = 0;
        }
    }
    if(collectedPetalContainers.length > 0){
        collectedPetalContainers.unshift('cpc');
        send(collectedPetalContainers);
    }
    //let pack = {pack: true, ...me.pack()};
    //console.log(pack);
    //sendGame(pack);
}