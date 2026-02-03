import { Client, Databases, ID, Permission, Role, Storage, InputFile } from 'node-appwrite';
import { INITIAL_MENU_ITEMS } from '../src/types/menu';
import { MOCK_ORDERS } from '../src/types/order';

// Configuration
const CONFIG = {
    ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: '698232950032f12e7895',
    API_KEY: 'standard_0c5b62f15aec8f667d6da508e5c11474142b2143980c79b432db999b20928314c22df32ca7a0b9bad2763995e64c9b062b4bb8aa34b1c0f0ac8ccaa66570ab92430de8c39df304ac8963025fd4a3a4ea7ac9d57d450305bf845bf496a2617f80ba673cb4bdb95dd58b52246cc0b4d84a2fa49220816e74bcbd34e64f408f86a6', // Usually safe to keep local for scripts, but in prod use ENV
    DB_ID: 'restaurant_db',
};

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const db = new Databases(client);

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🚀 Starting Appwrite Seeding...');

    // 1. Create Database
    try {
        await db.create(CONFIG.DB_ID, 'Restaurant DB');
        console.log('✅ Database created');
    } catch (e: any) {
        if (e.code === 409) console.log('ℹ️ Database already exists');
        else throw e;
    }

    // 2. Create Menu Collection
    const menuCollId = 'menu_items';
    try {
        await db.createCollection(CONFIG.DB_ID, menuCollId, 'Menu Items', [
            Permission.read(Role.any()), // Public read
            Permission.write(Role.any()) // Public write (for demo simplicity)
        ]);
        console.log('✅ Menu Collection created');

        // Attributes
        await db.createStringAttribute(CONFIG.DB_ID, menuCollId, 'name', 255, true);
        await db.createFloatAttribute(CONFIG.DB_ID, menuCollId, 'price', true);
        await db.createStringAttribute(CONFIG.DB_ID, menuCollId, 'category', 100, true);
        await db.createStringAttribute(CONFIG.DB_ID, menuCollId, 'description', 1000, false);
        await db.createUrlAttribute(CONFIG.DB_ID, menuCollId, 'image', true);
        await db.createBooleanAttribute(CONFIG.DB_ID, menuCollId, 'available', true);
        
        console.log('⏳ Waiting for attributes to index...');
        await wait(2000);

    } catch (e: any) {
         if (e.code === 409) console.log('ℹ️ Menu Collection already exists');
         else console.error('Error creating menu collection:', e);
    }

    // 3. Create Orders Collection
    const ordersCollId = 'orders';
    try {
        await db.createCollection(CONFIG.DB_ID, ordersCollId, 'Orders', [
            Permission.read(Role.any()),
            Permission.write(Role.any())
        ]);
        console.log('✅ Orders Collection created');

        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'tableId', 50, true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'status', 50, true);
        await db.createFloatAttribute(CONFIG.DB_ID, ordersCollId, 'totalAmount', true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'items_json', 10000, true); // Storing items as JSON for simplicity in this demo
        
        console.log('⏳ Waiting for attributes to index...');
        await wait(2000);
    } catch (e: any) {
        if (e.code === 409) console.log('ℹ️ Orders Collection already exists');
    }

    // 4. Seed Data
    console.log('🌱 Seeding Data...');
    
    // Seed Menu
    for (const item of INITIAL_MENU_ITEMS) {
        try {
            await db.createDocument(CONFIG.DB_ID, menuCollId, ID.unique(), {
                name: item.name,
                price: item.price,
                category: item.category,
                description: item.description,
                image: item.image,
                available: item.available
            });
            console.log(`   + Added Menu Item: ${item.name}`);
        } catch (e) {
            console.log(`   * Skipped (maybe exists): ${item.name}`);
        }
    }

    // Seed Orders
    for (const order of MOCK_ORDERS) {
        try {
             await db.createDocument(CONFIG.DB_ID, ordersCollId, ID.unique(), {
                tableId: order.tableId,
                status: order.status,
                totalAmount: order.totalAmount,
                items_json: JSON.stringify(order.items)
            });
            console.log(`   + Added Order: ${order.id}`);
        } catch (e) {
            console.log(`   * Skipped Order: ${order.id}`);
        }
    }

    console.log('✨ Seeding Check Complete!');
}

main().catch(console.error);
