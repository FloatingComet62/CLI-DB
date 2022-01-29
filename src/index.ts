#!/usr/bin/env node

import cli from './cli'
import database from './data'
import chalk from 'chalk'


type actionType = 'addChild' | 'changeValue' | 'remove'
type itemAction = 'get' | 'set' | 'help' | '?'
type command = 'db' | 'exit' | 'help' | '?'


const dbHelpMessage = `
${chalk.cyan('db get <address>')} - returns the item

${chalk.cyan('db set <address> <action> <value> <name>')}
                ${chalk.yellow("if action == 'addChild'")}
                    ${chalk.green('name')} & ${chalk.green('value')} are compulsory
                ${chalk.yellow("if action == 'changeValue'")}
                    ${chalk.green('value')} is compulsory
                    ${chalk.red('name')} will be ignored
                ${chalk.yellow("if action == 'remove'")}
                    ${chalk.red('name')} & ${chalk.red('value')} will be ignored
`
const helpMessage = `
${chalk.cyan('db')} - get access to the database

${chalk.cyan('help')} - show this message

${chalk.cyan('exit')} - close the CLI
`


async function run(){
    while (true){
        const args = (await cli.NewCommandInput()).split(' ') // Splitting the entire command into arguments to use them separately
        const command = args[0] as command
    
        if(command=='db'){
            const itemAction = args[1] as itemAction
            const address = args[2]
        
            if(itemAction=='get'){
                console.log(await database.getItemData(address))
            
            
            }else if(itemAction=='set'){
                const action = args[3] as actionType
        
                if(action=='addChild'){
                    const name = args[5]
                    const value = args[4]
                    database.setItemData(action, address, value, name)
                
                }else if(action=='changeValue'){
                    const value = args[4]
                    database.setItemData(action, address, value)
                
                }else if(action=='remove'){
                    database.setItemData(action, address)
                }
            
            
            }else if(itemAction=='help' || itemAction=='?'){
                console.log(dbHelpMessage)
            }

           
        
        }else if(command=='help' || command=='?'){
            console.log(helpMessage)

        
        
        }else if(command=='exit'){
            process.exit(0)


            
        }
    }
}


run()