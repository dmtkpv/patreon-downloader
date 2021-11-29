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
        text: 'Email (optional): ',
        default: process.env.EMAIL || ''
    },
    {
        key: 'PASSWORD',
        text: 'Password (optional): ',
        default: process.env.PASSWORD || ''
    },
    {
        key: 'CAMPAIGN_ID',
        text: 'Campaign ID: ',
        default: process.env.CAMPAIGN_ID,
        required: true
    },
    {
        key: 'LIMIT',
        text: 'Posts limit: ',
        default: process.env.LIMIT || '-1',
        required: true,
    },
    {
        key: 'CURSOR',
        text: 'Cursor (optional): ',
        default: process.env.CURSOR || '',
    },
    {
        key: 'FILENAME',
        text: 'Filename template: ',
        default: process.env.FILENAME || 'title',
        required: true,
    },
    {
        key: 'DESTINATION',
        text: 'Destination directory: ',
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

    readline.question(question.text, answer => {
        if (question.required && !answer) return ask(question);
        question.answer = JSON.stringify(answer);
        active++;
        ask();
    });

    if (question.default) {
        readline.write(question.default);
    }

}



// --------------------
// Run
// --------------------

ask();
