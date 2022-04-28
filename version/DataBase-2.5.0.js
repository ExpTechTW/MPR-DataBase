'use strict'

const Plugin = {
    "name": "DataBase",
    "version": "2.5.0",
    "depends": {
        "pluginLoader": ">=4.8.5"
    },
    "Events": ["onLoad"],
    "Commands": [],
    "author": ["whes1015"],
    "link": "https://github.com/ExpTechTW/MPR-DataBase",
    "resources": ["AGPL-3.0"],
    "description": "為其他插件提供資料存取服務",
    "DHL": false
}

const fs = require('fs')
const path = require("path")
const Path = path.resolve("")
let file = JSON.parse(fs.readFileSync(Path + '/Data/DataBase.json').toString())

async function onLoad(client) {
    if (!fs.existsSync(Path + '/Data/DataBase.json')) {
        fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify([], null, "\t"), 'utf8')
    } else {
        if (!fs.existsSync(Path + "/Data/DataBase-BackUp")) {
            fs.mkdirSync(Path + "/Data/DataBase-BackUp")
        }
        setInterval(async () => {
            let utc = new Date()
            let now = new Date(utc.getTime() + utc.getTimezoneOffset() * 60 * 1000 + 60 * 60 * 8 * 1000)
            let Now = now.getFullYear() +
                "/" + (now.getMonth() + 1) +
                "/" + now.getDate() +
                " " + now.getHours() +
                ":" + now.getMinutes() +
                ":" + now.getSeconds()
            let dir = fs.readdirSync(Path + "/Data/DataBase-BackUp")
            if (dir.length >= 15) {
                for (let index = 15; index < dir.length; index++) {
                    fs.unlinkSync(Path + "/Data/DataBase-BackUp/" + dir[index])
                }
            }
            fs.writeFileSync(Path + "/Data/DataBase-BackUp/" + new Date().getTime() + ".json", JSON.stringify(file, null, "\t"), 'utf8')
        }, 600000)
    }
}

function read(Plugin, Key) {
    if (Plugin.name == undefined) {
        return false
    } else {
        for (let index = 0; index < file.length; index++) {
            if (file[index]["name"] == Plugin.name) {
                if (file[index]["Value"][Key] == undefined) {
                    return null
                } else {
                    return file[index]["Value"][Key]
                }
            }
        }
        return false
    }
}

function del(Plugin, Key) {
    if (Plugin.name == undefined) {
        return false
    } else {
        for (let index = 0; index < file.length; index++) {
            if (file[index]["name"] == Plugin.name) {
                if (file[index]["Value"][Key] == undefined) {
                    return null
                } else {
                    delete file[index]["Value"][Key]
                    fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify(file, null, "\t"), 'utf8')
                    return true
                }
            }
        }
        return false
    }
}

function write(Plugin, Key, Value) {
    if (Plugin.name == undefined) {
        return false
    } else {
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
                return true
            } catch (error) {
                return false
            }
        } else {
            try {
                file[find]["Value"][Key] = Value
                fs.writeFileSync(Path + '/Data/DataBase.json', JSON.stringify(file, null, "\t"), 'utf8')
                return true
            } catch (error) {
                return false
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
