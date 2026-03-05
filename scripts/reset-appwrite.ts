import { Client, Databases } from 'node-appwrite';

// Configuration
const CONFIG = {
    ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: '698232950032f12e7895',
    API_KEY: 'standard_0c5b62f15aec8f667d6da508e5c11474142b2143980c79b432db999b20928314c22df32ca7a0b9bad2763995e64c9b062b4bb8aa34b1c0f0ac8ccaa66570ab92430de8c39df304ac8963025fd4a3a4ea7ac9d57d450305bf845bf496a2617f80ba673cb4bdb95dd58b52246cc0b4d84a2fa49220816e74bcbd34e64f408f86a6',
    DB_ID: 'restaurant_db',
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const db = new Databases(client);

async function main() {
    console.log('🗑️  Resetting Appwrite Database...');

    // Delete orders collection
    try {
        await db.deleteCollection(CONFIG.DB_ID, 'orders');
        console.log('✅ Deleted Orders Collection');
    } catch (e: any) {
        console.log('⚠️  Orders Collection not found or already deleted');
    }

    // Delete menu collection
    try {
        await db.deleteCollection(CONFIG.DB_ID, 'menu_items');
        console.log('✅ Deleted Menu Collection');
    } catch (e: any) {
        console.log('⚠️  Menu Collection not found or already deleted');
    }

    // Delete database
    try {
        await db.delete(CONFIG.DB_ID);
        console.log('✅ Deleted Database');
    } catch (e: any) {
        console.log('⚠️  Database not found or already deleted');
    }

    console.log('✨ Reset Complete! Run seed-appwrite.ts to recreate.');
}

main().catch(console.error);
