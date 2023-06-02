import inquirer from 'inquirer'

const questions = [
    {
      type: 'input',
      name: 'amount',
      message: 'Ingresa el monto del gasto:'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Ingresa la descripción del gasto:',
    }
  ];

  export const promptExpenses = async () => {
    return await inquirer.prompt(questions)
  }
  