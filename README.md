# patreon-downloader
Download creator files from Patreon

## Requirements
Node.js 14+

## Installation
```
git clone https://github.com/dmtkpv/patreon-downloader.git
cd patreon-downloader
npm install
```

## Configuration

Provide environment variables by running
```
npm run setup
```
<sup>Variables will be saved to the .env file.</sup>

**EMAIL / PASSWORD (optional)**\
Your patreon credentials. They are required to receive locked posts from your creators.

**CREATOR_ID**\
To obtain this parameter go to the creator page, open browser console, enter `patreon.bootstrap.creator.data.id`.

**LIMIT**\
Maximum number of downloaded files. `-1` - no limits.

**CURSOR (optional)**\
Page cursor. This parameter is provided during download.

**FILENAME**\
Posts have attributes: *title*, *published_at*, *post_type*, *post_file.name*, *url* etc.\
You can use these attributes to generate a filename. \
Examples: `title`, `published_at + ' ' + title`, `post_type + '-' + title`.

**DESTINATION**\
The directory where the files will be downloaded.


## Download files
```
npm run start
```


