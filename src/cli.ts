import inquirer from 'inquirer'


export default {
    async NewCommandInput(): Promise<string>{
        const command = await inquirer.prompt({
            name: 'command',
            type: 'input',
            message: '> '
        })
    
        return command.command
    },
    
    async askWtihOptions(message: string, args: string[]): Promise<string>{
        const Optionask = await inquirer.prompt({
            name: 'optionAsk',
            type: 'list',
            message: `${message}\n`,
            choices: args
        })
    
        return Optionask.optionAsk
    }
}