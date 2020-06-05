ModAPI.registerAPI("MagicModAPI", {
    lenses: lenses,
    lens: lens, //magicWand.js
    MagicTable: MagicTable, //magicTable.js
    requireGlobal: function (command) {
        return eval(command);
    }
});
Logger.Log("MagicModAPI Loaded", "API");