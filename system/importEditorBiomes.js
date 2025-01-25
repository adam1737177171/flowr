for(let i = 0; i < importBiomeData.length; i++){
    importBiomeFromEditor(importBiomeData[i]);
}

function importBiomeFromEditor(biomeData){
    try {
        data = JSON.parse(biomeData);
    } catch(e){
        alert('import failed 💀... Error: ' + e);
        return;
    }

    assign(window.baseStats.petals, data.editorBaseStats.petals);
    assign(window.baseStats.enemies, data.editorBaseStats.enemies);

    for(let key in data.editorBaseStats.petals){
        window.baseStats.petals[key].customBiome = data.biomeName;
    }

    assign(editorPetalShapesMap, data.editorPetalShapesMap);
    assign(editorEnemyShapesMap, data.editorEnemyShapesMap);
    Colors.biomes[data.biomeName] = {
        background: data.colors.background,
        grid: data.colors.grid
    }
    biomeEnemyMap[data.biomeName] = [...data.enemyStats.filter(p => p.spawnChance > 0).map(p => p.enemyType)];
}

function assign(a, b){
    for(let key in b){
        a[key] = b[key];
    }
}