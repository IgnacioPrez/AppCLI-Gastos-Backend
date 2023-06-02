import inquirer from 'inquirer'
import {promptExpenses} from './promptExpenses.js'
import {get,save} from './readExpenses.js'

const run = async () => {
    try {
        const expenses = await promptExpenses()
        const getExpenses = await get('./expenses.json')
        const newExpenses = [...getExpenses,expenses]
        save('./expenses.json',newExpenses)
    }
    catch(error){
        console.log(error)
    }
}

run()