let hasGeneratedPVPStats = false;
let pregeneratedPvpStats = undefined;
function generatePvpStats(){
    var oldRarityStats = Stats.rarities;
    Stats.rarities = [Stats.rarities[0]];
    for(let i = 1; i < oldRarityStats.length; i++){
        Stats.rarities[i] = {}
        for(let key in oldRarityStats[i]){
            Stats.rarities[i][key] = Stats.rarities[i-1][key] * 1.15;
        }
        Stats.rarities[i].name = oldRarityStats[i].name;
    } 
    BaseStats.rarities = Stats.rarities;
    window.calculateStats(true);

    pregeneratedPvpStats = structuredClone({petals: Stats.petals, enemies: Stats.enemies});
    hasGeneratedPVPStats = true;

    Stats.rarities = BaseStats.rarities = oldRarityStats;
    window.calculateStats(false);
}

class StatsBox {
    constructor(fields=[{}], {x, y, w, h}, regenData){
        this.fields = fields;

        this.x = x;
        this.y = y;
        this.w = w;

        if(h === undefined){
            this.h = 1000;
            ctx.globalAlpha = 0;
            this.draw();
            this.h = this.currentHeight + 10;
            ctx.globalAlpha = 1;
        } else {
            this.h = h;
        }
        
        this.pc = {};

        this.is1v1Stats = false;//biomeManager !== undefined && biomeManager.getCurrentBiome() === '1v1';
        this.regenData = regenData;
    }
    draw(){
        
        if(this.regenData !== undefined && this.is1v1Stats !== (biomeManager !== undefined && biomeManager.getCurrentBiome() === '1v1')){
            const new1v1Stats = this.is1v1Stats = !this.is1v1Stats;
            if(this.is1v1Stats === true){
                if(hasGeneratedPVPStats === false) generatePvpStats();
            }
            if(this.regenData[0] !== undefined && (pregeneratedPvpStats.petals[this.regenData[0].type] !== undefined || pregeneratedPvpStats.enemies[this.regenData[0].type] !== undefined)) {
                if(pregeneratedPvpStats.petals[this.regenData[0].type] !== undefined) this.regenData[0].petalStats = pregeneratedPvpStats.petals[this.regenData[0].type][this.regenData[0].rarity];
                else this.regenData[0].petalStats = pregeneratedPvpStats.enemies[this.regenData[0].type][this.regenData[0].rarity];

                this.regenData[0].petalStats = structuredClone(this.regenData[0].petalStats);

                const petalStats = this.regenData[0].petalStats;
                delete petalStats.override;
                delete petalStats.pvpOverride;
                

                
                delete petalStats.petalLayout;
                delete petalStats.damageScalers;
                delete petalStats.healthScalers;
                delete petalStats.healScalers;
                delete petalStats.stickParentRotation;
                delete petalStats.attackDistanceMult;
                delete petalStats.defendDistanceMult;
                delete petalStats.neutralDistanceMult;
                delete petalStats.radius;
                //delete petalStats.spawnSystem;
                delete petalStats.petalType;
                delete petalStats.killOnShoot;
                delete petalStats.homingCorrection;
                delete petalStats.killOnSummon;
                delete petalStats.raritiesBelow;
                delete petalStats.killPetsOnDie;
                delete petalStats.customBiome;
                delete petalStats.poisonDamage;
                delete petalStats.poisonTime;

                delete petalStats.detectionDistance;
                delete petalStats.personality;
                if(petalStats.knockback === 0.1) delete petalStats.knockback;
            }
            this.regenData[0].is1v1Stats = this.is1v1Stats;
            const statsBox = generateStatsBox(...this.regenData);
            for(let key in statsBox){
                this[key] = statsBox[key];
            }
            this.is1v1Stats = new1v1Stats;
            this.shouldRegenPC = true;
        }
        ctx.textAlign = 'left';
        ctx.textBaseline = 'center';
        ctx.fontKerning = "none";
        ctx.letterSpacing = "-.1px";
        ctx.font = '900 16px Ubuntu';
        ctx.translate(this.x, this.y);

        this.drawBackground();

        this.currentHeight = 0;
        for(let i = 0; i < this.fields.length; i++){
            this.drawField(this.fields[i]);
        }

        ctx.translate(-this.x, -this.y);
    }
    drawBackground(){
        const lastGA = ctx.globalAlpha;
        ctx.globalAlpha *= 0.55;
        ctx.fillStyle = 'black';

        ctx.beginPath();
        ctx.roundRect(0, 0, this.w, this.h, 6);
        ctx.fill();
        ctx.closePath();

        ctx.globalAlpha = lastGA;
    }
    drawField(field){
        if(this['draw' + field.type] === undefined) return; 
        this['draw' + field.type](field);
    }
    drawTitle(field){
        ctx.font = '900 28px Ubuntu';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;

        ctx.strokeText(field.value, 16, this.currentHeight + 28);
        ctx.fillText(field.value, 16, this.currentHeight + 28);
        
        this.currentHeight += 40;
    }
    drawMargin(field){
        this.currentHeight += field.value;
    }
    drawRarity(field){
        ctx.font = '900 16px Ubuntu';
        ctx.fillStyle = Colors.rarities[field.value].color;
        ctx.strokeStyle = 'black';//rarityToColor[field.value].border;
        ctx.lineWidth = 2;

        ctx.strokeText(Colors.rarities[field.value].name, 16, this.currentHeight + 20); 
        ctx.fillText(Colors.rarities[field.value].name, 16, this.currentHeight + 20); 

        this.currentHeight += 40;
    }
    drawDescription(field){
        ctx.font = '900 14px Ubuntu';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        const wrappedText = wrapText(field.value, 16, this.currentHeight + 10, this.w - 20 - 10, 15);
        for(let i = 0; i < wrappedText.length; i++){
            ctx.strokeText(wrappedText[i][0], wrappedText[i][1], wrappedText[i][2]); 
            ctx.fillText(wrappedText[i][0], wrappedText[i][1], wrappedText[i][2]); 
        }
        this.currentHeight = wrappedText[wrappedText.length-1][2] + 10;
    }
    drawStat(field){
        ctx.font = '900 13px Ubuntu';
        ctx.fillStyle = field.color;
        
        if(field.name === 'petals') ctx.fillStyle = `hsl(${Date.now()/6.5}, 50%, 50%)`;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        if(Array.isArray(field.value)){
            let statValue = field.value.join(", ");
            if (field.name == "poison"){
                statValue = formatAmountHighPrecision(field.value[0]) + " total, "+formatAmountHighPrecision(field.value[1]) +"/s";
            }
            const wrappedText = wrapText(`${this.formatName(field.name)}: ${statValue}`, 12, this.currentHeight + 10, this.w - 20 - 10, 15);
            
            for(let i = 0; i < wrappedText.length; i++){
                ctx.strokeText(wrappedText[i][0], wrappedText[i][1], wrappedText[i][2]); 
                ctx.fillText(wrappedText[i][0], wrappedText[i][1], wrappedText[i][2]); 
            }
            this.currentHeight = wrappedText[wrappedText.length-1][2] + 10;
            return;
        }

        const statText = `${this.formatName(field.name)}: ${Number.isFinite(field.value) ? Math.round(field.value * 100) / 100 : field.value}`;
        ctx.strokeText(statText, 12, this.currentHeight + 9); 
        ctx.fillText(statText, 12, this.currentHeight + 9);
        

        this.currentHeight += 16;
    }
    formatName(name){
        if(name.length > 1){
            name = name[0].toUpperCase() + name.slice(1);
        }
        
        for(let i = 0; i < name.length; i++){
            if(name[i].toUpperCase() === name[i]){
                name = name.slice(0, i) + ' ' + name[i].toUpperCase() + name.slice(i+1);
                i += 2;
            }
        }
        return name;
    }
    drawPetalContainer({pc}){
        this.pc = pc;
        pc.x = pc.render.x = this.w - 18 - pc.w / 2;
        pc.y = pc.render.y = 13 + pc.h / 2;

        const ga = ctx.globalAlpha;
        pc.draw();
        ctx.globalAlpha = ga;
    }
    drawDropsPetalContainer(field){
        let {data, rarity} = field;
        if(data === null) return;

        // generate petal containers
        if(field.pcs === undefined){
            // get our rarity out of all rarities
            data = data[rarity];
            // console.log(data);

            field.pcs = [];
            for(let key in data){
                const type = key;
                const rarities = data[key];
                for(let i = 0; i < rarities.length; i++){
                    if(rarities[i] !== 0){
                        let petalStats = Stats.petals[type][i];

                        let is1v1 = false;
                        if (biomeManager !== undefined && biomeManager.getCurrentBiome() === '1v1'){
                            is1v1 = true;
                        }

                        if (is1v1){
                            var oldRarityStats = Stats.rarities;
                            Stats.rarities = [Stats.rarities[0]];
                            for(let i = 1; i < oldRarityStats.length; i++){
                                Stats.rarities[i] = {}
                                for(let key in oldRarityStats[i]){
                                    Stats.rarities[i][key] = Stats.rarities[i-1][key] * 1.15;
                                }
                                Stats.rarities[i].name = oldRarityStats[i].name;
                            } 
                            BaseStats.rarities = Stats.rarities;
                            window.calculateStats(true);
                        }


                        // console.log(Stats.petals[type]);

                        let petalAmount = 0;

                        const petalLayout = petalStats.petalLayout;
                        for(let j = 0; j < petalLayout.length; j++){
                            for(let k = 0; k < petalLayout[j].length; k++){
                                petalAmount++;
                            }
                        }

                        if (is1v1){
                            Stats.rarities = BaseStats.rarities = oldRarityStats;
                            window.calculateStats(false);
                        }

                        const petalArray = [];
                        for(let j = 0; j < petalAmount; j++){
                            petalArray.push(new Petal({
                                x: 0,
                                y: 0,
                                angle: 0,
                                radius: petalStats.radius,
                                type: type,
                                rarity: i,
                                damage: 0,
                                offset: 0,
                                distance: 0,
                                dv: 0,
                                id: Math.random(),
                                subId: 0,
                                subStackedId: 0,
                                dead: false,
                                hp: 1,
                                maxHp: 1,
                                reload: 1,
                                maxReload: 1,
                                angleOffset: 0,
                                petalContainerId: -1
                            }));
                        }

                        field.pcs.push(new PetalContainer(petalArray, {x: 0, y: 0, w: 50, h: 50, toOscillate: false, radius: 0}, Math.random(), 1, 0));
                        if (rarities[i] > 10){
                            field.pcs[field.pcs.length-1].dropPercent = Math.ceil(rarities[i] * 10) / 10;
                        }
                        else{
                            field.pcs[field.pcs.length-1].dropPercent = Math.ceil(rarities[i] * 100) / 100;
                        }
                        if (rarities[i] < 0.05){
                            field.pcs[field.pcs.length-1].dropPercent = Math.ceil(rarities[i] * 1000) / 1000;
                        }
                    }
                }
            }
        }

        this.currentHeight += 36;

        let wOffset = 0;

        for(let i = 0; i < field.pcs.length; i++){
            const pc = field.pcs[i];

            pc.render.x = pc.x = 18 + pc.w / 2 + wOffset;
            pc.render.y = pc.y = this.currentHeight;

            const ga = ctx.globalAlpha;
        pc.draw();
        ctx.globalAlpha = ga;

            // if(wOffset + pc.w / 2 > this.w) {console.log('xd'); this.w = wOffset + pc.w / 2;}
            this.w = Math.max(pc.w + 16 + pc.w / 2 + wOffset, this.w);

            const lastLetterSpacing = ctx.letterSpacing;
            ctx.font = '900 11px Ubuntu';
            ctx.letterSpacing = "-.05px";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            ctx.strokeText(pc.dropPercent + '%', pc.render.x, pc.render.y + pc.h / 2 + 11);
            ctx.fillText(pc.dropPercent + '%', pc.render.x, pc.render.y + pc.h / 2 + 11);
            // mk
            ctx.letterSpacing = lastLetterSpacing;

            if(field.pcs[i+1] === undefined || field.pcs[i+1].type !== pc.type){
                this.currentHeight += pc.h + 24;
                wOffset = 0;
            } else {
                wOffset += pc.w + 16;
            }
        }

        this.currentHeight -= 38;
    }
}

// const rarityToColor = {};
// for(let i = 0; i < Colors.rarities.length; i++){
//     rarityToColor[Colors.rarities[i].name] = {
//         color: Colors.rarities[i].color,
//         border: Colors.rarities[i].border
//     };
// }

const wrapText = function(text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineArray = [];

    for(var n = 0; n < words.length; n++) {
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lineArray.push([line, x, y]);
            y += lineHeight;
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            line += `${words[n]} `;
        }
        if(n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    return lineArray;
}

function generateStatsBox(pc, isPetal=true/*false = is enemy*/, {x,y}){
    const stats = [];
    let dropsData = null;
    for(let key in pc.petalStats){
        let data = pc.petalStats[key];
        if (key == "period"){
            console.log(data)
        }
        if (typeof data == "number"){
            data = formatAmountHighPrecision(data);
        }
        if (key == "reload"){
            data += "s";
            if (pc.type == "Sapphire"){
                stats.push({
                    type: 'Stat',
                    name: "MaxConversionRarity",
                    value: Colors.rarities[Math.max(pc.rarity+2, 0)].name,
                    color: Colors.rarities[Math.max(pc.rarity+2, 0)].color
                })
            }
            if (pc.type == "Emerald"){
                stats.push({
                    type: 'Stat',
                    name: "MaxDuplicationRarity",
                    value: Colors.rarities[Math.max(pc.rarity+2, 0)].name,
                    color: Colors.rarities[Math.max(pc.rarity+2, 0)].color
                })
            }
            
        }

        if (key == "period"){
            data += "s";
        }
        if (key == "lifespan"){
            data += "s";
        }
        else if(key === "petalNum"){
            key = "petals";
        }
        else if (key == "hatchTime"){
            /*
            if (pc.type == "Egg"){
                stats.push({
                    type: 'Stat',
                    name: "SpawnRarity",
                    value: enemyRarityScalars[Math.max(pc.rarity - 1, 0)].name,
                    color: Colors.rarities[Math.max(pc.rarity - 1, 0)].color
                })
            }
            */
            data += "s";
        }
        else if (key == "spawnRarity"){
            stats.push({
                type: 'Stat',
                name: "SpawnRarity",
                value: enemyRarityScalars[Math.max(data, 0)].name,
                color: Colors.rarities[Math.max(data, 0)].color
            })
            continue;
        }
        else if (key == "highestRarity"){
            stats.push({
                type: 'Stat',
                name: "HighestRarity",
                value: enemyRarityScalars[Math.max(data, 0)].name,
                color: Colors.rarities[Math.max(data, 0)].color
            })
            continue;
        }
        
        if (key == "petLifespan"){
            if (pc.type == "Ruby"){
                stats.push({
                    type: 'Stat',
                    name: "MaxSpawnRarity",
                    value: enemyRarityScalars[Math.max(pc.rarity, 0)].name,
                    color: Colors.rarities[Math.max(pc.rarity, 0)].color
                })
            }
            data += "s";
        }
        if (key == "reviveHealth"){
            data *= 100;
            data += "%";
        }
        else if (key == "spawnSystem"){
            stats.push({
                type: 'Stat',
                name: "SpawnTime",
                value: data[1]+'s',
                color: '#d4d4d4'
            })
            stats.push({
                type: 'Stat',
                name: "SpawnRarity",
                value: enemyRarityScalars[data[0]].name,
                color: Colors.rarities[data[0]].color
            })
            stats.push({
                type: 'Stat',
                name: "MaxSpawnsPerPetal",
                value: data[2],
                color: '#59d4c1'
            })
            continue;
        }
        if (key == "slowdown"){
            if (data === undefined) continue;
            
            let rarityRender = pc.rarity;
            let rangeUp = 2;
            if (pc){
                if (pc.is1v1Stats == true){
                    rarityRender = 2;
                    rangeUp = 4;
                }
            }
            let max = rarityRender + rangeUp;
            if (max < 4){
                max = 4;
            }
            stats.push({
                type: 'Stat',
                name: "> Slowdown",
                value: "",
                color: '#d4d4d4'
            })
            for(let i = rarityRender-2; i<max; i++){
                if (enemyRarityScalars[i]){
                    stats.push({
                        type: 'Stat',
                        name: enemyRarityScalars[i].name,
                        value: data[i]+"%",
                        color: key.includes('Buff') ? "#ff9944" : statColors[enemyRarityScalars[i].name] ?? 'white'
                    })
                }
            }
            stats.push({
                type: 'Stat',
                name: "-:-:-:-",
                value: "",
                color: '#d4d4d4'
            })
            continue;
        }
        if (key == "pvpOverride"){
            continue;
        }
        if (key == "damageHeal"){
            stats.push({
                type: 'Stat',
                name: "Lifesteal",
                value: Math.round(pc.petalStats[key]/pc.petalStats["damage"] * 10000)/100 + "%",
                color: '#d4d4d4'
            })
            continue;
        }
        if (key == "knockbackMass" || key == "bodyKnockback"){
            stats.push({
                type: 'Stat',
                name: "Knockback",
                value: data,
                color: '#d4d4d4'
            })
            continue;
        }
        if (key == "percentDamagePerDeadFlower"){
            stats.push({
                type: 'Stat',
                name: "ExtraDmg",
                value: data +"% / dead flower",
                color: '#d4d4d4'
            })
            continue;
        }
        if (key == "salt"){
            stats.push({
                type: 'Stat',
                name: "DamageReflected",
                value: data +"%",
                color: '#d4d4d4'
            })
            continue;
        }
        if (key == "inflation"){
            stats.push({
                type: 'Stat',
                name: "Inflation",
                value: data +"%",
                color: '#d4d4d4'
            })
            continue;
        }
        if (key == "damagePercent"){
            stats.push({
                type: 'Stat',
                name: "damagePercent",
                value: data +"%",
                color: '#e3c59d'
            })
            continue;
        }
        
        if (key == "waveSpeed"){
            stats.push({
                type: 'Stat',
                name: "WaveSpawningSpeed",
                value: data +"s",
                color: '#a4ffa4'
            })
            continue;
        }
        if (key === "drops"){
            dropsData = data;
            continue;
        }
        stats.push({
            type: 'Stat',
            name: key,
            value: data,
            color: key.includes('Buff') ? "#ff9944" : statColors[key] ?? 'white'
        })
    }
    let description = 
    {
        type: 'Description',
        value: (isPetal ? Descriptions.petals[pc.type] : Descriptions.enemies[pc.type]) ?? (isPetal ? 'A Mysterious Custom Petal...' : 'A Mysterious Custom Enemy...')
    };

    let title = pc.type;

    if (pc.type == "Third Eye" && pc.rarity == 11){
        description.value = "Something lofdjf will never get."
    }
    if (pc.type == "Oranges" && pc.rarity >= 12){
        title = "Orange";
        description.value = "So powerful that the Oranges fused together into one heavy blob. It's too heavy to be extended further than usual, but it packs extra damage."
    }
    
    if (pc.type == "Honey" && pc.rarity >= 8){
        description.value = "A rocket-powered decoy that attracts mobs away from flowers. Press shift to slow it down to a stop! Works weakly on enemies one rarity higher."
    }

    return new StatsBox([
        {
            type: 'Title',
            value: title
        },
        {
            type: 'Rarity',
            value: pc.rarity
        },
        description,
        {
            type: 'Margin',
            value: 5
        },
        ...stats,
        {
            type: 'DropsPetalContainer',
            data: dropsData,
            rarity: pc.rarity
        },
        {
            type: 'PetalContainer',
            pc: isPetal ? clonePC(pc) : cloneEnemyPC(pc)
        }
    ],
    {x,y,w: 216 + Math.max(0, (pc.type.length-8) * 18 + 2)},
    [clonePC(pc),isPetal,{x,y}])
}

// const testBox = generateStatsBox({
//     "petals": [
//         {
//             "x": 0,
//             "y": 0,
//             "angle": 0,
//             "radius": 10,
//             "type": "Salt",
//             "rarity": 3,
//             "damage": 29,
//             "offset": {
//                 "angle": 0,
//                 "distance": 0
//             },
//             "distance": 0,
//             "dv": 0,
//             "id": 0,
//             "subId": 0,
//             "subStackedId": 0,
//             "dead": false,
//             "hp": 19,
//             "maxHp": 19,
//             "reload": 2.5,
//             "maxReload": 2.5,
//             "angleOffset": 0,
//             "render": {
//                 "distance": 0,
//                 "angle": 0,
//                 "x": 0,
//                 "y": 0
//             },
//             "selfAngle": 0,
//             "dying": false,
//             "deadAnimationTimer": 9999,
//             "ticksSinceLastDamaged": 9999,
//             "insidePetalContainer": true,
//             "isProjectile": false
//         }
//     ],
//     "petalStats": {
//         "radius": 10,
//         "knockback": 0.1,
//         "damage": 29,
//         "health": 19,
//         "maxDamage": 23.2,
//         "salt": 20.833333333333336,
//         "reload": 2.5,
//         "petalLayout": [
//             [
//                 {}
//             ]
//         ],
//         "override": {
//             "1": {
//                 "salt": 8.333333333333334
//             },
//             "2": {
//                 "salt": 13.333333333333334
//             },
//             "3": {
//                 "salt": 20.833333333333336
//             },
//             "4": {
//                 "salt": 31.666666666666668
//             },
//             "5": {
//                 "salt": 45.833333333333336
//             },
//             "6": {
//                 "salt": 62.5
//             },
//             "7": {
//                 "salt": 91.66666666666667
//             },
//             "8": {
//                 "salt": 183.33333333333334
//             }
//         },
//         "damageScalers": [
//             "damage",
//             "maxDamage"
//         ],
//         "healthScalers": [
//             "health"
//         ]
//     },
//     "rarity": 3,
//     "type": "Salt",
//     "x": 0,
//     "y": 0,
//     "w": 62,
//     "h": 62,
//     "radius": 50,
//     "render": {
//         "x": 0,
//         "y": 0,
//         "w": 65
//     },
//     "amount": 100017,
//     "attempt": 15,
//     "id": 0.24452447930549015,
//     "spawnAnimation": 0,
//     "lastAmountChangedTime": -1000,
//     "collectTime": null,
//     "toOscillate": false,
//     "creationTime": 1315.6999999284744,
//     "isDraggingPetalContainer": false
// }, true, {x: 120, y: 160})

const statColors = {
    damage: '#ff4444',
    health: '#44ff44',
    reload: '#44ddff',
    speed: '#44ddff',
    poison: '#e644ff',
    attractionRadius: '#baa052',
    salt:   '#FCB0CB',//'#a1bec4',
    maxDamage:   '#FCB0CB',
    slowdown: '#777777',
    slowdownTime: '#b172cf',
    armor: '#838383',
    mass: '#696969',
    duration: '#ff44ee',
    heal: '#ff94c9',
    xp: '#f9ff44',
    detectionDistance: '#ffb144',
    extraRange: '#1585b5',
    wingExtraRange: '#1585b5',
    enemyKnockback: '#de823f',
    healAmount: '#44ff44',
    healDelay: '#44ff44',
    range: '#e00030',
    period: '#e3c59d',
    damagePercent: '#e3c59d',
    bounces: '#a7faef',
    healthNerf: '#eb7faf',
    overhealConversion: '#dae09f',
    hatchTime: '#9fd49f',
    extraDamage: '#ffbb00',
    criticalDamage: "#dd0000",
    flowerArmor: '#a3a3a3',
    maxEnemyBoost: '#33dd33',
    petLifespan: "#999999",
    lifespan: "#499999",
    reviveHealth: "#944994",
    timeToPop: "#ffeeaa"
}

for(let i of Object.keys(Colors.rarities)){
    statColors[Colors.rarities[i].name] = Colors.rarities[i].color;
}

const enemyRarityScalars = [{// NOTE: DO NOT CHANGE ANY OF THESE. THEY WERE SUPPOSED TO BE FINAL.
    // IF YOU DO CHANGE THEM PLEASE UPDATE THEM CLIENT SIDE SO THAT STATS ARE ACCURATE
      name: "Common",
      health: 1,
      damage: 1, 
      radius: 1, 
      mass: 1,
      petalDamage: 1,
      petalHealth: 1,
      petalHeal: 1,
      petalMass: 1,
      detectionDistance: 1,
      xp: 1 
    }, {
      name: "Unusual",
      health: 2,
      damage: 1.2,
      radius: 1.1, 
      mass: 1.52,
      petalDamage: 1.4,
      petalHealth: 1.2,
      petalHeal: 1.51,
      petalMass: 1.52,
      detectionDistance: 1.1,
      xp: 3
    }, {
      name: "Rare",
      health: 4,
      damage: 1.5,
      radius: 1.3, 
      mass: 2.46,
      petalDamage: 2,
      petalHealth: 1.5,
      petalHeal: 2.23,
      petalMass: 2.46,
      detectionDistance: 1.2,
      xp: 9
    }, {
      name: "Epic",
      health: 8*1.72/1.6,
      damage: 1.9,
      radius: 1.72,//1.6, 
      mass: 5.7,
      petalDamage: 2.9,
      petalHealth: 1.9,
      petalHeal: 3.17,
      petalMass: 5.7,
      detectionDistance: 1.3,
      xp: 27
    }, {
      name: "Legendary",
      health: 50,
      damage: 2.7,
      radius: 3, 
      mass: 18.6, 
      petalDamage: 4.8,
      petalHealth: 2.7,
      petalHeal: 4.94,
      petalMass: 18.6,
      detectionDistance: 1.7,
      xp: 81
    }, {
      name: "Mythic",
      health: 110,
      damage: 4.3,
      radius: 5, 
      mass: 43, 
      petalDamage: 9.7,//9.1
      petalHealth: 4.3,
      petalHeal: 10.2,
      petalMass: 43,
      detectionDistance: 2.1,
      xp: 243
    }, {
      name: "Ultra",
      health: 310,
      damage: 8.6,
      radius: 7, 
      mass: 100,  
      petalDamage: 23,//18.3
      petalHealth: 8.6,
      petalHeal: 21.45,
      petalMass: 100,
      detectionDistance: 2.5,
      xp: 729
    }, {
      name: "Super",
      health: 1350,
      damage: 17.2,
      radius: 9.5, 
      mass: 216,  
      petalDamage: 90,
      petalHealth: 17.2,
      petalHeal: 40.3,
      petalMass: 216,
      detectionDistance: 2.5,
      xp: 2187
    }, {
      name: "Omega",
      health: 4941,
      damage: 34.4,
      radius: 13, 
      mass: 500,  
      petalDamage: 315, 
      petalHealth: 34.4,
      petalHeal: 74,
      petalMass: 480,
      detectionDistance: 2.5,
      xp: 6561
    }, {
      name: "Fabled",
      health: 18084,
      damage: 68.8,
      radius: 17.7, 
      mass: 1250,  
      petalDamage: 1100, 
      petalHealth: 68.8,
      petalHeal: 140.6,
      petalMass: 1100,
      detectionDistance: 2.5,
      xp: 26244
    }, {
      name: "Divine",
      health: 66188,
      damage: 137.6,
      radius: 24.1, 
      mass: 3125,  
      petalDamage: 3850, 
      petalHealth: 137.6,
      petalHeal: 267.14,
      petalMass: 2500,
      detectionDistance: 2.5,
      xp: 131220
    }, {
      name: "Supreme",
      health: 242247,
      damage: 275.2,
      radius: 33, 
      mass: 9375,  
      petalDamage: 13475, 
      petalHealth: 275.2,
      petalHeal: 507,
      petalMass: 7000,
      detectionDistance: 2.5,
      xp: 656100
    }, {
      name: "Omnipotent",
      health: 968988,
      damage: 550,
      radius: 45, 
      mass: 33750,  
      petalDamage: 47162.5, 
      petalHealth: 550,
      petalHeal: 963,
      petalMass: 20000,
      detectionDistance: 2.5,
      xp: 3280500
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
		  name: "Astral",
		  health: 4844940,
		  damage: 1100,
		  radius: 62, 
		  mass: 194400,  
		  petalDamage: 141487.5, 
		  petalHealth: 1100,
		  petalHeal: 1829,
		  petalMass: 50000,
		  detectionDistance: 2.5,
		  xp: 26244000
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Celestial",
      health: 9689880,
      damage: 1650,
      radius: 72, 
      mass: 194400*2,  
      petalDamage: 577738, 
      petalHealth: 2200,
      petalHeal: 3475,
      petalMass: 144000,
      detectionDistance: 2.5,
      xp: 41006250
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Seraphic",
      health: 19379760,
      damage: 2475,
      radius: 84, 
      mass: 194400*4,  
      petalDamage: 2022083, 
      petalHealth: 4400,
      petalHeal: 6602,
      petalMass: 288000,
      detectionDistance: 2.5,
      xp: 102515625
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Transcendent",
      health: 248060928,
      damage: 8800,
      radius: 161.9, //Becomes small!! ?? 
      mass: 3280500,  
      petalDamage: 7077290, 
      petalHealth: 8800,
      petalHeal: 12543,
      petalMass: 600000,
      detectionDistance: 2.5,
      xp: 0
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Quantum",
      health: 992243712,
      damage: 17600,
      radius: 222.9, //Becomes small!! ?? 
      mass: 9841500,  
      petalDamage: 24770516, 
      petalHealth: 17600,
      petalHeal: 23831,
      petalMass: 1200000,
      detectionDistance: 2.5,
      xp: 0
    }, {
      //THIS IS A JOKE THIS IS A JOKE THIS IS A JOKE (it's ONLY spawnable with dev cmds)
      name: "Galactic",
      health: 3968974848,
      damage: 35200,
      radius: 306.9, //Becomes small!! ?? 
      mass: 29524500,  
      petalDamage: 86696806, 
      petalHealth: 35200,
      petalHeal: 45279,
      petalMass: 2400000,
      detectionDistance: 2.5,
      xp: 0
    }];
// for(let key in statColors){
//     statColors[key] = blendColor(statColors[key], '#cccccc', 0.18);
// }
