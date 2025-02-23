const savedSlotAmount = localStorage.getItem("savedSlotAmount") ?? 5;

let petalReloadData = {};
let petalHpData = {};
let bosses = [];
let totalBossHealth = 0;
let bossCount = 0;

let inventory = new Inventory(savedSlotAmount);
let deadMenu = new DeadMenu();
let mobileControls = new MobileControls();
let draggingPetalContainer = null;
let waveBarY = 85;

let enemyBoxSize = 75;
let enemyBoxBoundSize = 80;
let enemyBoxOverlapSize = 20
let enemyBoxBaseX = 0;
let enemyBoxBaseY = 105

function waveLengthFunc(x) { // in seconds
	if (x < 10) {
		return x ** 0.2 * 18.9287 + 30;
	} else {
		return 60;
	}
}

function drawEnemySprite(enemy, type, x, y, baseRadius) {
	// enemy.x = x;
	// enemy.y = y;// render.x, render.y also but i wanna see how this looks because it'll be funny
	if (enemyBoxOffsets[type] !== undefined) {
		x += enemyBoxOffsets[type].x * baseRadius;
		y += enemyBoxOffsets[type].y * baseRadius;
	}
	enemy.x = x;
	enemy.render.x = x;
	enemy.y = y;
	enemy.render.y = y;

	enemy.angle = enemy.render.angle = -3 * Math.PI / 4;
	enemy.isBox = true;

	enemy.radius = baseRadius / (enemyBoxSizeMults[type] ?? 1);

	enemy.draw();

	// switch(type){
	// 	default: {
	// 		ctx.beginPath();
	// 		ctx.fillStyle = "black";
	// 		ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
	// 		ctx.fill();
	//         ctx.lineWidth = 4;
	// 		ctx.font = "15px 'Ubuntu'";
	// 		ctx.textAlign = "center";
	// 		ctx.textBaseline = "middle";
	// 		ctx.fillStyle = "white";
	// 		ctx.strokeStyle = "black";
	// 		ctx.strokeText(type, x, y)
	// 		ctx.fillText(type, x, y)
	// 		break;
	// 	}
	// }
}

// const chatMsgTime = 30 * 1000;
// const chatMsgFadeTime = chatMsgTime + 3 * 1000;
// function renderChatMessages(){
// 	const textHeight = 15;
// 	let currentHeight = canvas.h - 30;
// 	for(let i = window.chatMessages.length-1; i >= 0; i--){
// 		const text = window.chatMessages[i];

// 		ctx.font = `900 14px 'Ubuntu`;
// 		ctx.fillStyle = '#f0f0f0';
// 		ctx.strokeStyle = 'black'//"#1c8c54";
// 		ctx.lineWidth = 1.5;
// 		ctx.textAlign = 'left';
// 		ctx.textBaseline = 'bottom';

// 		const fadeTime = window.chatMsgFadeTimes[i];

// 		if(fadeTime > chatMsgTime){
// 			const alpha = (chatMsgFadeTime - fadeTime) / (chatMsgFadeTime - chatMsgTime);
// 			if(alpha < 0){
// 				window.chatMessages.splice(i,1);
// 				window.chatMsgFadeTimes.splice(i,1);
// 				continue;
// 			} else {
// 				ctx.globalAlpha = alpha;
// 			}
// 		}
// 		window.chatMsgFadeTimes[i] += dt;

// 		ctx.strokeText(text, 3, currentHeight);
// 		ctx.fillText(text, 3, currentHeight);

// 		ctx.globalAlpha = 1;
// 		currentHeight -= textHeight;
// 	}
// }

function renderConnectingText() {
	connectingTextSizeMult *= 1.003;
	if (connectingTextSizeMult > 4.2) {
		connectingTextSizeMult = 1;
	}
	ctx.font = `900 ${38 * connectingTextSizeMult}px 'Ubuntu`;
	ctx.fillStyle = '#f0f0f0';
	ctx.strokeStyle = 'black' //"#1c8c54";
	ctx.lineWidth = 6 * connectingTextSizeMult;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.translate(canvas.w / 2, canvas.h / 2);
	const now = time;
	ctx.globalAlpha = 1;
	ctx.rotate(Math.sin(now / 300) * 0.18);
	ctx.strokeText("Connecting...", 0, 0);
	ctx.fillText("Connecting...", 0, 0);
	ctx.rotate(-Math.sin(now / 300) * 0.18);
	ctx.translate(-canvas.w / 2, -canvas.h / 2);

	// ctx.font = "600 64px Fredoka One";
	// ctx.fillStyle = '#f0f0f0';
	// ctx.strokeStyle = 'black'//"#1c8c54";
	// ctx.lineWidth = 8;
	// ctx.textAlign = 'center';
	// ctx.textBaseline = 'middle';
	// for(let i = 0; i < 5; i++){
	// 	const angle = Math.PI * 2 * i / 5 + time / 2200;
	// 	const pos = {
	// 		x: canvas.w / 2 + Math.cos(angle) * 3 * (120 * Math.sin(time / 1100)),
	// 		y: canvas.h / 2 + Math.sin(angle) * 3 * (120 * Math.sin(time / 1100))
	// 	}
	// 	ctx.translate(pos.x, pos.y);
	// 	const now = (time) / 10 + angle * 100;
	// 	ctx.rotate(Math.sin(now / 300) * 0.18);
	// 	ctx.strokeText("Connecting...", 0,0);
	// 	ctx.fillText("Connecting...", 0,0);
	// 	ctx.rotate(-Math.sin(now / 300) * 0.18);
	// 	ctx.translate(-pos.x, -pos.y);
	// }
}

let disconnectedText;

function renderDisconnectedText() {
	ctx.font = '900 46px Ubuntu';
	if (disconnectedText === undefined) {
		disconnectedText = {
			x: Math.random() * canvas.w,
			y: Math.random() * canvas.h,
		};
		const angle = Math.random() * Math.PI * 2;
		disconnectedText.xv = Math.cos(angle) * 3 * 165 / 60;
		disconnectedText.yv = Math.sin(angle) * 3 * 165 / 60;
		const measurements = ctx.measureText('Disconnected');
		disconnectedText.w = measurements.width;
		disconnectedText.h = measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent;
	}
	disconnectedText.x += disconnectedText.xv;
	disconnectedText.y += disconnectedText.yv;
	if (disconnectedText.x < 0) {
		disconnectedText.x = 0;
		disconnectedText.xv *= -1;
	} else if (disconnectedText.x + disconnectedText.w > canvas.w) {
		disconnectedText.x = canvas.w - disconnectedText.w;
		disconnectedText.xv *= -1;
	}
	if (disconnectedText.y < 0) {
		disconnectedText.y = 0;
		disconnectedText.yv *= -1;
	} else if (disconnectedText.y + disconnectedText.h > canvas.h) {
		disconnectedText.y = canvas.h - disconnectedText.h;
		disconnectedText.yv *= -1;
	}

	ctx.fillStyle = '#f0f0f0';
	ctx.strokeStyle = 'black' //"#1c8c54";
	ctx.lineWidth = 2;

	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText("Disconnected", disconnectedText.x, disconnectedText.y);
	ctx.strokeText("Disconnected", disconnectedText.x, disconnectedText.y);
}

window.camera = {
	x: 'pass',
	y: 0
}; //the first parameter being pass means that the culling function will automatically allow everything to be drawn
// let dandelionMissileEnemies = [];
let connectingTextSizeMult = 1;

let renderGame = (dt) => {
	if ((window.selfId === null || room.flowers[window.selfId] === undefined) && window.isDead !== true) {
		if (window.state === 'disconnected' && typeof biomeManager !== 'undefined') {
			const {
				ratio,
				last,
				current,
				direction
			} = biomeManager.getCurrentBiomeData();

			ctx.fillStyle = Colors.biomes[current].background;
			ctx.strokeStyle = Colors.biomes[current].grid;
		} else if (room && typeof Colors !== 'undefined') {
			ctx.fillStyle = Colors.biomes[room.biome].background;
			ctx.strokeStyle = Colors.biomes[room.biome].grid;
		} else {
			ctx.fillStyle = "white";
			ctx.strokeStyle = "#1c8c54"
		}
		ctx.fillRect(0, 0, canvas.w, canvas.h);

		// tiles
		const timeOffset = (-time / 20) % 50;

		ctx.lineWidth = 2;
		ctx.globalAlpha = 0.6;
		for (let x = timeOffset - ctx.lineWidth; x <= canvas.w + ctx.lineWidth; x += tileSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.h);
			ctx.stroke();
			ctx.closePath();
		}

		for (let y = -timeOffset - ctx.lineWidth; y <= canvas.h + ctx.lineWidth; y += tileSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.w, y);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.globalAlpha = 1;

		renderMenuEnemies();

		// renderChatMessages();

		renderConnectingText();
		return;
	} else {
		menuEnemies = [];
		connectingTextSizeMult = 1;
	}

	ctx.fillStyle = Colors.biomes[room.biome].background;
	ctx.fillRect(0, 0, canvas.w, canvas.h);

	const me = window.isDead ? (() => {
		let closestFlower = null;
		let lowestId = 1E99;
		for (let id in room.flowers) {
			if (id < lowestId) {
				lowestId = id;
				closestFlower = room.flowers[id];
			}
		}
		return closestFlower === null ? {
			render: {
				headX: 0,
				headY: 0,
				x: 0,
				y: 0
			}
		} : closestFlower;
	})() : room.flowers[window.selfId];

	if (window.isDead !== true) {
		me.updateInterpolate();
	} else {
		petalReloadData = {};
		petalHpData = {};
	}

	// wtf we already do this in input.js??
	// if (time > lastSentInput + minimumInputTime){
	// 	if (!arrayEquals(latestInput, previousInput)){
	// 		send(latestInput);
	// 		previousInput = window.structuredClone(latestInput);
	// 		lastSentInput = time;// window.structuredclone
	// 	}
	// }

	renderFov = interpolate(renderFov, fov, 0.04);

	//window.camera = {x: (room.flowers[window.selfId] ?? {render: {headX: 'pass'}}).render.headX, y: (room.flowers[window.selfId] ?? {render: {headY: 0}}).render.headY};
	window.camera = {
		x: me.render.headX,
		y: me.render.headY - (window.isDead === true ? 24 / renderFov : 0)
	}

	ctx.lineWidth = canvas.w * 2 + canvas.h * 2;
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.globalAlpha = 0.08;
	ctx.arc(canvas.w / 2 - me.render.headX * renderFov, canvas.h / 2 - me.render.headY * renderFov, room.radius * renderFov + ctx.lineWidth / 2, 0, Math.PI * 2);
	ctx.stroke();
	ctx.closePath();

	ctx.globalAlpha = 1;

	const tileOffset = {
		x: (-me.render.headX + canvas.w / 2 / renderFov) % tileSize,
		y: (-me.render.headY + canvas.h / 2 / renderFov) % tileSize
	};
	ctx.strokeStyle = Colors.biomes[room.biome].grid;
	ctx.lineWidth = renderFov;
	ctx.globalAlpha = 1;
	for (let x = (tileOffset.x - ctx.lineWidth) * renderFov; x <= canvas.w + ctx.lineWidth; x += tileSize * renderFov) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.h);
		ctx.stroke();
		ctx.closePath();
	}

	for (let y = (tileOffset.y - ctx.lineWidth) * renderFov; y <= canvas.h + ctx.lineWidth; y += tileSize * renderFov) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.w, y);
		ctx.stroke();
		ctx.closePath();
	}

	ctx.globalAlpha = 1;

	// const camera = {x: canvas.w/2-me.render.headX, y: canvas.h/2-me.render.headY};

	if (window.camera.x !== 'pass') {
		ctx.translate(canvas.w / 2 - camera.x * renderFov, canvas.h / 2 - camera.y * renderFov);
	}
	ctx.scale(renderFov, renderFov);

	if(biomeManager !== undefined && biomeManager.getCurrentBiome() === '1v1' && window.inMainPvpRoom !== true){
		if(Object.keys(room.flowers).length >= 2) {
			window.canWinPvp = true;
		}
		else if(Object.keys(room.flowers).length === 1 && window.isDead !== true && window.canWinPvp){
			window.hasWonPvp = true;
			delete window.canWinPvp;
		}
	}
	if(window.hasWonPvp === true){
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.globalAlpha = 0.3;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.lineWidth = room.radius * 1.55 / 20;
		ctx.font = `600 ${room.radius * 1.55}px Ubuntu`;
		const metrics = ctx.measureText('W');
		const yOff = (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2;
		ctx.fillText('W', 0, -yOff);
		ctx.strokeText('W', 0, -yOff);
		ctx.globalAlpha = 1;
	}
	
	// if(window.arenaGradient === undefined){
	//     window.arenaGradient = ctx.createRadialGradient(0, 0, room.radius- 20, 0, 0, room.radius+20);

	//     // Add three color stops
	//     window.arenaGradient.addColorStop(0, "rgba(0,0,0,0)");
	//     window.arenaGradient.addColorStop(1, "rgba(0,0,0,.22)");
	// }

	// ctx.fillStyle = window.arenaGradient;

	// ctx.fillRect(-(canvas.w/2-me.x), -(canvas.h/2-me.y), canvas.w, canvas.h);


	// ctx.font = "600 124px Fredoka One";
	// ctx.fillStyle = '#f0f0f0';
	// ctx.strokeStyle = 'black'//"#1c8c54";
	// ctx.lineWidth = 8;
	// ctx.textAlign = 'center';
	// ctx.textBaseline = 'middle';
	// ctx.strokeText("Game is being rendered!", canvas.w / 2 + Math.sin(time / 1000) * 100, canvas.h / 2);
	// ctx.fillText("Game is being rendered!", canvas.w / 2+ Math.sin(time / 1000) * 100, canvas.h / 2);

	// drawing all the entities
	for (let id in room.petalContainers) {
		room.petalContainers[id].draw();
	}
	for (let id in room.flowers) {
		room.flowers[id].drawProjectiles();
	}
	for (let id in room.flowers) {
		room.flowers[id].drawPets();
	}
	// for(let i = 0; i < dandelionMissileEnemies.length; i++){
	// 	dandelionMissileEnemies[i].draw();
	// }
	// dandelionMissileEnemies = [];


	for (let id in room.enemies) {
		// if(room.enemies[id].type === "DandelionMissile"){
		// 	dandelionMissileEnemies.push(room.enemies[id]);
		// 	continue;
		// }
		room.enemies[id].draw();
	}

	for (let id in room.flowers) {
		room.flowers[id].draw();
	}
	

	// if(window.toRenderHitboxes === true){
	// 	for(let id in room.flowers){
	// 		renderHitbox({x: room.flowers[id].render.headX, y: room.flowers[id].render.headY, radius: room.flowers[id].render.radius, rarity: 0})

	// 		for(let i = 0; i < room.flowers[id].petals.length; i++){
	// 			if(room.flowers[id].petals[i].dead === true)continue;
	// 			renderHitbox({x: room.flowers[id].petals[i].render.x, y: room.flowers[id].petals[i].render.y, radius: room.flowers[id].petals[i].radius, rarity: room.flowers[id].petals[i].rarity});
	// 		}

	// 		for(let i = 0; i < room.flowers[id].projectiles.length; i++){
	// 			renderHitbox({x: room.flowers[id].projectiles[i].render.x, y: room.flowers[id].projectiles[i].render.y, radius: room.flowers[id].projectiles[i].radius, rarity: room.flowers[id].projectiles[i].rarity});
	// 		}

	// 		for(let i = 0; i < room.flowers[id].pets.length; i++){
	// 			room.flowers[id].pets[i].render.rarity = room.flowers[id].pets[i].rarity;
	// 			renderHitbox(room.flowers[id].pets[i].render);
	// 		}
	// 	}
	// 	for(let id in room.enemies){
	// 		room.enemies[id].render.rarity = room.enemies[id].rarity;
	// 		renderHitbox(room.enemies[id].render);
	// 	}
	// }

	ctx.scale(1 / renderFov, 1 / renderFov)
	if (window.camera.x !== 'pass') {
		ctx.translate(-(canvas.w / 2 - camera.x * renderFov), -(canvas.h / 2 - camera.y * renderFov));
	}
	ctx.globalAlpha = 1;

	ctx.translate(canvas.w / 2, 0);
	// if(window.tutorial === true){
	// 	ctx.translate(0, -canvas.h/11.2);
	// }
	for (let i = 0; i < room.enemyBoxes.length; i++) {
		let enemyBox = room.enemyBoxes[i];
		enemyBox.update();
		
		if (enemyBox.isBoss){
			ctx.fillStyle = `hsl(${(time/10) % 360}, 50%, 40%)`
		}
		else{
			ctx.fillStyle = Colors.rarities[enemyBox.rarity].border;
			if(Colors.rarities[enemyBox.rarity].fancy !== undefined) ctx.fillStyle = Colors.rarities[enemyBox.rarity].fancy.border;
		}
		ctx.beginPath();
		ctx.roundRect(enemyBox.x - enemyBox.w / 2, enemyBox.y, enemyBox.w, enemyBox.h, 10);
		ctx.fill();

		if (enemyBox.isBoss){
			ctx.fillStyle = `hsl(${(time/10) % 360}, 30%, 60%)`
		}
		else{
			ctx.fillStyle = Colors.rarities[enemyBox.rarity].color;
			if (Colors.rarities[enemyBox.rarity].fancy !== undefined){
				const gradientFill = ctx.createLinearGradient(enemyBox.x - enemyBox.w / 2, enemyBox.y, enemyBox.x + enemyBox.w / 2, enemyBox.y + enemyBox.h);
			
				createFancyGradient(gradientFill, enemyBox.rarity);
					//ctx.fillStyle = `hsl(${Math.cos(Date.now()/400)*35 + 285}, 100%, 15%)`
				ctx.fillStyle = gradientFill;
				
                      
	        }
		}
		ctx.beginPath();
		let coef = 0.87;
		let miniCoef = (1 - coef) / 2;
		ctx.roundRect(enemyBox.x - enemyBox.w / 2 + enemyBox.w * miniCoef, enemyBox.y + enemyBox.h * miniCoef, enemyBox.w * coef, enemyBox.h * coef, 10);
		ctx.fill();




		if(Colors.rarities[enemyBox.rarity].fancy !== undefined && Colors.rarities[enemyBox.rarity].fancy.stars !== undefined){
            ctx.save();
			ctx.translate(enemyBox.x, enemyBox.y + enemyBox.h/2);
			//scale to size of enemyBox (originally 50, now enemyBox.w)
			ctx.scale(enemyBox.w/50,enemyBox.w/50);
            //shiny stars & stuff
            if(!enemyBox.stars){
                enemyBox.stars = [];
                for(let starnum = 0; starnum < Colors.rarities[enemyBox.rarity].fancy.stars; starnum++){
                    enemyBox.stars.push({x: Math.random()*50 - 25, y: Math.random()*50 - 25})
                }
            }
            ctx.shadowBlur = 20;
            ctx.shadowColor = "white";
            ctx.fillStyle = "#ffffff";
            for(let star of enemyBox.stars){
                star.x+=0.1;
                star.y+=0.1;
                if(star.x >30 || star.y >30){
                    star.x = Math.random()*800 - 20 - 30;
                    star.y = -30;
                    
                }
                
                if(star.x < -30 || star.x > 30 || star.y < -30 || star.y > 30){
                    //don't draw;
                    continue;
                }
                ctx.beginPath();
        
                var grad = ctx.createRadialGradient(star.x, star.y,15,star.x, star.y,0);
                grad.addColorStop(0,"transparent");
                grad.addColorStop(0.8,`rgba(255,255,255,${(Math.cos(Date.now()/600+ star.x/30 + star.y/30) + 1)*0.8})`);
                grad.addColorStop(1,"white");
        
                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.3;
                
                ctx.fillRect(-20.5, -20.5, 41,41);
                ctx.globalAlpha = 1;
                if(star.x < 20.5 && star.x > -20.5 && star.y < 20.5 && star.y > -20.5){
                    
                    ctx.fillStyle = "#fff";
                
                    ctx.arc(star.x, star.y, 1, 0, 2*Math.PI);
                    ctx.fill();
                }
                ctx.closePath(); 
            }
            ctx.restore();
        }
		
		drawEnemySprite(enemyBox.enemy, enemyBox.type, enemyBox.x, enemyBox.y + enemyBox.h / 2, Math.min(enemyBox.w, enemyBox.h) * 0.38);


		


		
		if (enemyBox.amount > 1) {
			if (time - enemyBox.lastAmountChangedTime < 100) {
				ctx.globalAlpha = smoothstep((time - enemyBox.lastAmountChangedTime) / 100)
			}
			ctx.lineWidth = 3;
			ctx.font = "900 16px 'Ubuntu'";
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "white";
			ctx.strokeStyle = "black";
			ctx.translate(enemyBox.x + enemyBox.w / 2 - 7, enemyBox.y + 18);
			ctx.rotate(0.34);
			ctx.strokeText("x" + enemyBox.amount, 0, 0)
			ctx.fillText("x" + enemyBox.amount, 0, 0)
			ctx.rotate(-0.34);
			ctx.translate(-(enemyBox.x + enemyBox.w / 2 - 7), -(enemyBox.y + 18))
			ctx.globalAlpha = 1;
		}

		if (enemyBox.delete == true) {
			let typeStillExists = false;
			for (let j = 0; j < room.enemyBoxes.length; j++) {
				let otherBox = room.enemyBoxes[j];
				if (otherBox.type == enemyBox.type && otherBox.rarity != enemyBox.rarity) {
					typeStillExists = true;
				}
			}
			if (typeStillExists) {
				for (let j = 0; j < room.enemyBoxes.length; j++) {
					let otherBox = room.enemyBoxes[j];
					if (otherBox.type == enemyBox.type) {
						if (otherBox.rarity > enemyBox.rarity) {
							otherBox.targetY -= enemyBoxOverlapSize;
						}
					}
				}
			} else {
				alignEnemyBoxes(enemyBox);
			}

		}
	}

	ctx.translate(-canvas.w / 2, 0);
	// if(window.tutorial === true){
	// 	ctx.translate(0, canvas.h/11.2);
	// }
	room.enemyBoxes = room.enemyBoxes.filter((e) => !e.delete)

	//if(window.tutorial !== true){
	//room.waveTimer ++;

	
	let text = (biomeManager !== undefined && biomeManager.getCurrentBiome() === '1v1') ? "Fight!" : "Wave " + room.wave;

	if (bosses.length > 0) {
		let health = 1;
		for(let i of bosses){
			if (!room.enemies[i]){
				health -= 1/bossCount;
			}
			else{
				health -= Math.max(Math.min((room.enemies[i].maxHp - room.enemies[i].render.hp)/room.enemies[i].maxHp, 1), 0)/bossCount;
			}
		}
		health -= (bossCount - bosses.length)/bossCount;

		let firstDivide = 1;
		let secondDivide = 1;
		let end = "";

		if (totalBossHealth < 1e3){

		}
		else if (totalBossHealth < 1e4){
			firstDivide = 10;
			secondDivide = 100;
			end = "k"
		}
		else if (totalBossHealth < 1e5){
			firstDivide = 100;
			secondDivide = 10;
			end = "k"
		}
		else if (totalBossHealth < 1e6){
			firstDivide = 1000;
			secondDivide = 1;
			end = "k"
		}
		else if (totalBossHealth < 1e7){
			firstDivide = 10000;
			secondDivide = 100;
			end = "m"
		}
		else if (totalBossHealth < 1e8){
			firstDivide = 100000;
			secondDivide = 10;
			end = "m"
		}
		else if (totalBossHealth < 1e9){
			firstDivide = 1000000;
			secondDivide = 1;
			end = "m"
		}
		else if (totalBossHealth < 1e10){
			firstDivide = 10000000;
			secondDivide = 100;
			end = "b"
		}
		else if (totalBossHealth < 1e11){
			firstDivide = 100000000;
			secondDivide = 10;
			end = "b"
		}
		else if (totalBossHealth < 1e12){
			firstDivide = 1000000000;
			secondDivide = 1;
			end = "b"
		}
		
		text += " • "+Math.round(totalBossHealth*health/firstDivide)/secondDivide+end+"/"+Math.round(totalBossHealth/firstDivide)/secondDivide+end;
		ctx.lineWidth = 24;
		ctx.lineCap = "round";
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.lineTo(canvas.w / 2 - 140, waveBarY);
		ctx.lineTo(canvas.w / 2 + 140, waveBarY);
		ctx.stroke();
		if (health > 0){
			ctx.lineWidth = 18;
			ctx.lineCap = "round";
			ctx.strokeStyle = "#75dd34";
			ctx.beginPath();
			ctx.lineTo(canvas.w / 2 - 140, waveBarY);
			ctx.lineTo(canvas.w / 2 - 140 + 280 * (health), waveBarY);
			ctx.stroke();
		}
	} else {
		let maxSpawnTime = waveLengthFunc(room.wave) * 30;
		if (room.waveTimer < maxSpawnTime) {
			ctx.lineWidth = 24;
			ctx.lineCap = "round";
			ctx.strokeStyle = "black";
			ctx.beginPath();
			ctx.lineTo(canvas.w / 2 - 140, waveBarY);
			ctx.lineTo(canvas.w / 2 + 140, waveBarY);
			ctx.stroke();
			ctx.lineWidth = 18;
			ctx.lineCap = "round";
			if (biomeManager === undefined || biomeManager.getCurrentBiome() !== '1v1'){
				ctx.strokeStyle = "#57bc89";
				ctx.beginPath();
				ctx.lineTo(canvas.w / 2 - 140, waveBarY);
				ctx.lineTo(canvas.w / 2 - 140 + 280 * (room.waveTimer / maxSpawnTime), waveBarY);
				ctx.stroke();
			}
		} else {
			ctx.lineWidth = 24;
			ctx.lineCap = "round";
			ctx.strokeStyle = "black";
			ctx.beginPath();
			ctx.lineTo(canvas.w / 2 - 140, waveBarY);
			ctx.lineTo(canvas.w / 2 + 140, waveBarY);
			ctx.stroke();
			ctx.lineWidth = 18;
			if(biomeManager === undefined || biomeManager.getCurrentBiome() !== '1v1'){
				ctx.strokeStyle = "#57bc89";
				ctx.beginPath();
				ctx.lineTo(canvas.w / 2 - 140, waveBarY);
				ctx.lineTo(canvas.w / 2 + 140, waveBarY);
				ctx.stroke();
				ctx.lineWidth = 15.5;
				ctx.globalAlpha = Math.min((room.waveTimer / maxSpawnTime) / 1.5, 1);
				ctx.strokeStyle = "red";
				ctx.beginPath();
				ctx.lineTo(canvas.w / 2 - 140, waveBarY);
				ctx.lineTo(canvas.w / 2 - 140 + 280 * Math.min(1, ((room.waveTimer - maxSpawnTime) / (maxSpawnTime * 2))), waveBarY);
				ctx.stroke();
			}
			ctx.globalAlpha = 1;
		}
	}
	
	ctx.letterSpacing = "1px";
	ctx.strokeStyle = "black";
	ctx.fillStyle = "white";
	ctx.lineWidth = 6;
	ctx.font = "900 37px 'Ubuntu'";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.strokeText(room.biomeDisplay, canvas.w / 2, 50)
	ctx.fillText(room.biomeDisplay, canvas.w / 2, 50)
	ctx.lineWidth = 3;
	ctx.letterSpacing = "0.5px";
	ctx.font = "900 17px 'Ubuntu'";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.strokeText(text, canvas.w / 2, waveBarY - 8)
	ctx.fillText(text, canvas.w / 2, waveBarY - 8)
	ctx.letterSpacing = "0px";
	ctx.textBaseline = "middle";

	let globalIndicationY = 100;
	let globalIndicationX = 65;

	let self = room.flowers[window.selfId];
	let indicationY = globalIndicationY;

	for (let id in room.squadMembers) {
		let flower;
		if(room.flowers[id]){
			flower = room.flowers[id];
		}else{

			//dead flower
			flower = room.squadMembers[id];
			flower.render = {hp:0, shield:0, beforeStreakHp: 0};
			flower.maxHp = 100;
			flower.drawFlower = Flower.drawDeadFlower;
		}

		if (id == window.selfId) {
			let indicationSize = 35;
			renderHpBar({
				x: globalIndicationX + indicationSize * 4,
				y: globalIndicationY - indicationSize * 3.6,
				radius: indicationSize * 1.8,
				hp: flower.render.hp,
				maxHp: flower.maxHp,
				shield: flower.render.shield,
				beforeStreakHp: flower.render.beforeStreakHp,
				givenAlpha: 1
			}, flower);
			flower.drawFlower(globalIndicationX, globalIndicationY, indicationSize);
			ctx.font = `900 ${indicationSize * 0.75}px Ubuntu`;
			ctx.strokeStyle = "black";
			ctx.fillStyle = "white";
			ctx.textBaseline = "middle";
			ctx.strokeText(flower.name, globalIndicationX + indicationSize * 4, globalIndicationY);
			ctx.fillText(flower.name, globalIndicationX + indicationSize * 4, globalIndicationY);
		} else {
			let indicationSize = 30;
			indicationY += 90;
			renderHpBar({
				x: globalIndicationX + indicationSize * 4,
				y: indicationY - indicationSize * 3.6,
				radius: indicationSize * 1.8,
				hp: flower.render.hp,
				maxHp: flower.maxHp,
				shield: flower.render.shield,
				beforeStreakHp: flower.render.beforeStreakHp,
				givenAlpha: 1
			}, flower);
			flower.drawFlower(globalIndicationX, indicationY, indicationSize);
			ctx.font = `900 ${indicationSize * 0.75}px Ubuntu`;
			ctx.strokeStyle = "black";
			ctx.fillStyle = "white";
			ctx.textBaseline = "middle";
			ctx.strokeText(flower.name, globalIndicationX + indicationSize * 4, indicationY);
			ctx.fillText(flower.name, globalIndicationX + indicationSize * 4, indicationY);

			if (self && room.flowers[id]) {
				ctx.lineWidth = indicationSize / 7;
				let angle = Math.atan2(flower.render.headY - self.render.headY, flower.render.headX - self.render.headX);
				ctx.translate(globalIndicationX, indicationY);
				ctx.strokeStyle = "black";
				ctx.fillStyle = "white";
				ctx.rotate(angle);
				ctx.beginPath();
				ctx.lineTo(indicationSize * 1.15, -indicationSize * 0.4);
				ctx.lineTo(indicationSize * 1.45, 0);
				ctx.lineTo(indicationSize * 1.15, indicationSize * 0.4);
				ctx.lineTo(indicationSize * 1.15, -indicationSize * 0.4);
				ctx.stroke();
				ctx.fill();
				ctx.rotate(-angle);
				ctx.translate(-globalIndicationX, -indicationY);
			}
		}
	}

	if (globalInventory.fadingOut === true) {
		globalInventory.draw();
	}
	if (mobGallery.fadingOut === true) {
		mobGallery.draw();
	}

	inventory.draw();
	if(window.mobile){
		mobileControls.draw();
	}


	levelBar.draw();
	//}

	// renderChatMessages();

	if (window.isDead === true) {
		window.deadMenuTime += dt;
		deadMenu.draw();
	}
	else{
		window.deadMenuTime = 0;
	}
}

function renderHitbox({
	x,
	y,
	radius,
	rarity = 0
}) {
	ctx.strokeStyle = Colors.rarities[rarity].color;
	ctx.lineWidth = 1 / renderFov;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.stroke();
	ctx.closePath();
}