import { Client, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('698232950032f12e7895')
    .setKey('standard_0c5b62f15aec8f667d6da508e5c11474142b2143980c79b432db999b20928314c22df32ca7a0b9bad2763995e64c9b062b4bb8aa34b1c0f0ac8ccaa66570ab92430de8c39df304ac8963025fd4a3a4ea7ac9d57d450305bf845bf496a2617f80ba673cb4bdb95dd58b52246cc0b4d84a2fa49220816e74bcbd34e64f408f86a6');

const db = new Databases(client);

async function test() {
    console.log('Testing Appwrite Connection...');
    try {
        const dbs = await db.list();
        console.log('Connected! Found databases:', dbs.total);
    } catch (e: any) {
        console.error('Connection failed:', e.message);
    }
}

test();
