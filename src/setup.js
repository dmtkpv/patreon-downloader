require('dotenv').config();



// --------------------
// Modules
// --------------------

const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});



// --------------------
// Questions
// --------------------

const questions = [
    {
        key: 'EMAIL',
        default: process.env.EMAIL || ''
    },
    {
        key: 'PASSWORD',
        default: process.env.PASSWORD || ''
    },
    {
        key: 'CREATOR_ID',
        default: process.env.CAMPAIGN_ID,
        required: true
    },
    {
        key: 'LIMIT',
        default: process.env.LIMIT || '-1',
        required: true,
    },
    {
        key: 'CURSOR',
        default: process.env.CURSOR || '',
    },
    {
        key: 'FILENAME',
        default: process.env.FILENAME || 'title',
        required: true,
    },
    {
        key: 'DESTINATION',
        default: process.env.DESTINATION || path.join(__dirname, '../uploads'),
        required: true,
    }

]



// --------------------
// Ask question
// --------------------

let active = 0;

function ask () {

    const question = questions[active];

    if (!question) {
        fs.writeFileSync('./.env', questions.map(({ key, answer }) => `${key}=${answer}`).join('\n'))
        return process.exit(0);
    }

    let text = question.key;
    if (!question.required) text += ' (optional)';
    text += ': ';

    readline.question(text, answer => {
        if (question.required && !answer) return ask(question);
        question.answer = JSON.stringify(answer);
        active++;
        ask();
    });

    readline.write(question.default);

}



// --------------------
// Run
// --------------------

ask();
