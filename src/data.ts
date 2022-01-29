import fs from 'fs'


interface Item{
    value: string,
    children: Item[]
}

type actionType = 'addChild' | 'changeValue' | 'remove'


async function getFileData(): Promise<Object>{
    const data = fs.readFileSync('database.json', 'utf8')
    return data
}

async function setFileData(data: string): Promise<void>{
    fs.writeFile('database.json', data, function(error){
        if(error)throw error
    })
}


export default {
    async getItemData(address: string): Promise<Item>{
        const data = JSON.parse((await getFileData()).toString()) 
        const args = address.split('/')
        // Gets the item that matches the address
        let cacheItem
        for (let i=0;i<args.length;i++){
            let thing: string = args[i]
            if(!cacheItem){
                cacheItem = data[thing]
                if(!(i==args.length-1)) cacheItem = cacheItem["children"] // Since the children are in children attribute, this just goes to the children attribute
            }else{
                cacheItem = cacheItem[thing]
              if(!(i==args.length-1)) cacheItem = cacheItem["children"] // Since the children are in children attribute, this just goes to the children attribute
            }
        }
        const item: Item = {
            "value": cacheItem["value"],
            "children": cacheItem["children"]
        }
        return item
    },

    async setItemData(action: actionType, address: string, value: string = "0", name: string = "child"): Promise<void>{
        const data = JSON.parse((await getFileData()).toString())
        if(action=='addChild'){
            let child = `{"value": "${value}","children": {}}`
            // Just trying to get the code needed to be executed as a string and using eval to execute it
            const args = address.split('/')
            let code = `data`
            for(let i=0;i<args.length;i++){
                const arg = args[i]
                code += `["${arg}"]`
                if(!(i==args.length-1)) code += `["children"]`
            }
            code += `["children"]["${name}"] = ${child}`
            await eval(code)
            //--------------//
            await setFileData(JSON.stringify(data))
        }else if(action=='changeValue'){
            // Just trying to get the code needed to be executed as a string and using eval to execute it
            const args = address.split('/')
            let code = `data`
            for(let i=0;i<args.length;i++){
                const arg = args[i]
                code += `["${arg}"]`
                if(!(i==args.length-1)) code += `["children"]`
            }
            code += `["value"] = "${value}"`
            await eval(code)
            //--------------//
            await setFileData(JSON.stringify(data))
        }else if(action=='remove'){
            // Just trying to get the code needed to be executed as a string and using eval to execute it
            const args = address.split('/')
            let code = `delete data`
            for(let i=0;i<args.length;i++){
                const arg = args[i]
                code += `["${arg}"]`
                if(!(i==args.length-1)) code += `["children"]`
            }
            await eval(code)
            //--------------//
            await setFileData(JSON.stringify(data))
        }
    }
}