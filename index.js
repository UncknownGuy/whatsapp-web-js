const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './auth'
    })
});

client.on('message', async (message) => {
    // Send read receipt for received message
    client.sendSeen(message.from);

    if (message.body === 'Hi') {
        // Send a modified reply to the "Hi" message
        const reply = await message.reply("Hi, how can I assist you?");
        
        // React to the message with a heart emoji
        await message.react('❤️');
    }
    
    if (message.body === 'Gn') {
        // Send a modified reply to the "Hi" message
        const reply = await message.reply("Good Night , Bs tc");
        
        // React to the message with a heart emoji
        await message.react('🌙');
    }
    if (message.body === 'Gm') {
        // Send a modified reply to the "Hi" message
        const reply = await message.reply("Good Morning");
        
        // React to the message with a heart emoji
        await message.react('☀');
    }

    if (message.body === 'oi') {
        // Send a modified reply to the "Hi" message
        const reply = await message.reply("Aii Oii");
        
        // React to the message with a heart emoji
        await message.react('🙄');
    }
    if (message.body === 'oii') {
        // Send a modified reply to the "Hi" message
        const reply = await message.reply("Ai Oiii");
        
        // React to the message with a heart emoji
        await message.react('🙄');
    }
    if (message.body === 'oiii') {
        // Send a modified reply to the "Hi" message
        const reply = await message.reply("Ai Oiiii");
        
        // React to the message with a heart emoji
        await message.react('🙄');
    }
});


client.on('message', async (message) => {
    // Send read receipt for received message
    client.sendSeen(message.from);

    if (message.body.startsWith('getImg')) {
        const searchText = message.body.slice(7).trim();
        await fetchImages(message.from, searchText, '.thumbwook .rel-link img');
    } else if (message.body.startsWith('getGal')) {
        const searchText = message.body.slice(7).trim();
        await fetchImages(message.from, searchText, '.thumbwook .rel-link img');
    }
});

async function fetchImages(from, searchText, selector) {
    try {
        const url = `https://www.pornpics.com/${encodeURIComponent(searchText)}`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Go to the URL provided by the user
        await page.goto(url);

        // Wait for images to be loaded on the page
        await page.waitForSelector(selector);

        // Extract image URLs
        let imageUrls = await page.$$eval(selector, imgs => imgs.map(img => img.getAttribute('src')));

        // Filter out image URLs containing '1px.png'
        imageUrls = imageUrls.filter(url => !url.includes('1px.png'));

        // Log the filtered image URLs
        console.log('Filtered Image URLs:', imageUrls);

        // Close the browser
        await browser.close();

        // Send the image URLs back to the user
        for (const imageUrl of imageUrls) {
            const media = await MessageMedia.fromUrl(imageUrl);
            await client.sendMessage(from, media);
        }
    } catch (error) {
        console.error('Error:', error);
        await client.sendMessage(from, 'Failed to fetch images. Please try again later.');
    }
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
