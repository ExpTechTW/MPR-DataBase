'use strict'

const Plugin = {
    "name": "DataBase",
    "version": "1.0.0",
    "depends": {
        "pluginLoader": ">=4.7.0"
    },
    "Events": ["onLoad"],
    "Commands": [
        {
            "name": "time now",
            "note": "查看現在時間"
        }
    ],
    "author": ["whes1015"],
    "link": "https://github.com/ExpTechTW/MPR-DataBase",
    "resources": ["AGPL-3.0"],
    "description": "為其他插件提供資料存取服務"
}

const fs = require('fs')
const path = require("path")
const Path = path.resolve("")

async function onLoad(client) {
    if (!fs.existsSync(Path + '/Data/DataBase.json')) {
        fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify([], null, "\t"), 'utf8')
    }
}

async function read(Plugin, Key) {
    if (Plugin.name == undefined) {
        return { state: false, response: "Plugin Info Illegal" }
    } else {
        let file = JSON.parse(fs.readFileSync(Path + '/Data/DataBase.json').toString())
        for (let index = 0; index < file.length; index++) {
            if (file[index]["name"] == Plugin.name) {
                if (file[index]["Value"][Key] == undefined) {
                    return { state: false, response: "Value of Key Not Found" }
                } else {
                    return { state: true, response: file[index]["Value"][Key] }
                }
            }
        }
        return { state: false, response: "DataBase of Plugin Not Found" }
    }
}

async function del(Plugin, Key) {
    if (Plugin.name == undefined) {
        return { state: false, response: "Plugin Info Illegal" }
    } else {
        let file = JSON.parse(fs.readFileSync(Path + '/Data/DataBase.json').toString())
        for (let index = 0; index < file.length; index++) {
            if (file[index]["name"] == Plugin.name) {
                if (file[index]["Value"][Key] == undefined) {
                    return { state: false, response: "Value of Key Not Found" }
                } else {
                    delete file[index]["Value"][Key]
                    fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify(file, null, "\t"), 'utf8')
                    return { state: true, response: "Delete Key Success" }
                }
            }
        }
        return { state: false, response: "DataBase of Plugin Not Found" }
    }
}

async function write(Plugin, Key, Value) {
    if (Plugin.name == undefined) {
        return { state: false, response: "Plugin Info Illegal" }
    } else {
        let file = JSON.parse(fs.readFileSync(Path + '/Data/DataBase.json').toString())
        let find = -1
        for (let index = 0; index < file.length; index++) {
            if (file[index]["name"] == Plugin.name) {
                find = index
                break
            }
        }
        if (find == -1) {
            try {
                file[file.length] = {
                    "name": Plugin.name,
                    "TimeStamp": new Date().getTime(),
                    "Value": {}
                }
                file[file.length - 1]["Value"][Key] = Value
                fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify(file, null, "\t"), 'utf8')
                return { state: true, response: "Write file Success" }
            } catch (error) {
                return { state: false, response: "Error when writing file" }
            }
        } else {
            try {
                file[find]["Value"][Key] = Value
                fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify(file, null, "\t"), 'utf8')
                return { state: true, response: "Write file Success" }
            } catch (error) {
                return { state: false, response: "Error when writing file" }
            }
        }
    }
}

module.exports = {
    Plugin,
    onLoad,
    read,
    write,
    del
}
