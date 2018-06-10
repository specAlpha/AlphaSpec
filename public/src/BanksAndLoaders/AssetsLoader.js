class AssetsLoader {
    constructor() {
    }

    loadAsstes() {
        return new Promise(resolve => {
            Promise.all([
                this.loadJSON('/JSON/Models.json'),
                this.loadJSON('/JSON/textures.json'),
                this.loadJSON('/JSON/Level.json'),
                this.loadJSON('/JSON/Keybinds.json')
            ]).then(([modelsJSON, texturesJSON, lvlJSON, keybdingsJSON]) => {
                GM.inputManager.loadKeybindings(keybdingsJSON)
                GM.UI.addProgress();
                Promise.all([
                    GM.modelBank.loadFromJSON(modelsJSON),
                    GM.textureBank.load(texturesJSON),
                ]).then(() => {
                    GM.lvl.createLevel(lvlJSON);

                    resolve()
                })


            })
        })

    }

    loadJSON(url) {
        return fetch(url).then(resolve => resolve.json())

    }
}