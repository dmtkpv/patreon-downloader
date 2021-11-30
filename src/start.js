require('dotenv').config()



// --------------------------
// Modules
// --------------------------

const fs = require('fs');
const url = require('url');
const path = require('path');
const axios = require('axios');



// --------------------------
// APIs
// --------------------------

const API = {

    login () {
        return axios({
            method: 'POST',
            url: 'https://www.patreon.com/api/login',
            data: {
                data: {
                    type: 'user',
                    attributes: {
                        email: process.env.EMAIL,
                        password: process.env.PASSWORD
                    },
                }
            }
        })
    },

    posts (cookie = '', cursor) {
        return axios({
            method: 'GET',
            url: 'https://www.patreon.com/api/posts',
            params: {
                'filter[campaign_id]': process.env.CREATOR_ID,
                'filter[contains_exclusive_posts]': true,
                'sort': '-published_at',
                'page[cursor]': cursor
            },
            headers: {
                cookie
            },
        })
    },

    file (url) {
        return axios({
            method: 'GET',
            url,
            responseType: 'stream'
        });
    }

}



// --------------------------
// Logs
// --------------------------

const Log = {

    write (text) {
        process.stdout.write(text);
    },

    clear () {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    }

}



// --------------------------
// Indexing
// --------------------------

let index = 0;
let limit = +process.env.LIMIT;
if (limit < 1) limit = Number.MAX_VALUE;



// --------------------------
// File helpers
// --------------------------

function getFileName (attrs) {
    const fn = new Function(...Object.keys(attrs), `return ${process.env.FILENAME}`);
    return fn(...Object.values(attrs));
}

function writeFile (stream) {
    return new Promise((resolve, reject) => {
        stream.on('error', error => {
            console.error(error);
            reject();
        });
        stream.on('close', () => {
            resolve();
        });
    })
}



// --------------------------
// Get posts
// --------------------------

async function getPosts (cookie, cursor) {

    Log.clear();
    Log.write(`cursor: ${cursor}\n`);
    Log.write('getting posts...');

    const response = await API.posts(cookie, cursor);
    const posts = response.data.data;
    const next = response.data.meta.pagination.cursors?.next;

    for (const post of posts) {

        const src = post.attributes.post_file?.url;
        if (!src) continue;

        index++
        const name = getFileName(post.attributes);

        Log.clear();
        Log.write(`#${index} ${name}\n`);
        Log.write('getting file...');

        const file = await API.file(src);

        Log.clear();
        Log.write(`downloading...`);

        const ext = path.extname(url.parse(src).pathname);
        const stream = fs.createWriteStream(`${process.env.DESTINATION}/${name}${ext}`);
        file.data.pipe(stream);
        await writeFile(stream);

        if (index === limit) {
            return Log.clear();
        }

    }

    if (next) {
        getPosts(cookie, next);
    }
    else {
        Log.clear();
    }

}



// --------------------------
// Init
// --------------------------

(async () => {

    fs.mkdirSync(process.env.DESTINATION, {
        recursive: true
    });

    let cookie;

    if (process.env.EMAIL && process.env.PASSWORD) {
        Log.write('login...');
        const response = await API.login()
        cookie = response.headers['set-cookie'];
    }

    getPosts(cookie, process.env.CURSOR);

})();