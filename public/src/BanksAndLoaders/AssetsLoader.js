class AssetsLoader {
    constructor() {
    }

    loadAsstes() {
        return new Promise(resolve => {
            Promise.all([
                this.loadJSON('/JSON/Models.json'),
                this.loadJSON('/JSON/textures.json'),
                this.loadJSON('/JSON/Keybinds.json')
            ]).then(([modelsJSON, texturesJSON, keybdingsJSON]) => {
                GM.inputManager.loadKeybindings(keybdingsJSON)
                GM.mainMenu.addProgress();
                Promise.all([
                    GM.modelBank.loadFromJSON(modelsJSON),
                    GM.textureBank.load(texturesJSON),
                ]).then(() => {


                    resolve()
                })


            })
        })

    }

    loadJSON(url) {
        return fetch(url).then(resolve => resolve.json())

    }

    loadLevel(name) {
        return new Promise(resolve => {
            this.loadJSON('/Levels/' + name).then(function (json) {
                GM.lvl.createLevel(json);
                resolve()
            })


        })

    }
}