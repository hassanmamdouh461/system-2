import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';
import { INITIAL_MENU_ITEMS } from '../src/types/menu';

// Configuration
const CONFIG = {
    ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: '698232950032f12e7895',
    API_KEY: 'standard_0c5b62f15aec8f667d6da508e5c11474142b2143980c79b432db999b20928314c22df32ca7a0b9bad2763995e64c9b062b4bb8aa34b1c0f0ac8ccaa66570ab92430de8c39df304ac8963025fd4a3a4ea7ac9d57d450305bf845bf496a2617f80ba673cb4bdb95dd58b52246cc0b4d84a2fa49220816e74bcbd34e64f408f86a6',
    DB_ID: 'restaurant_db',
};

// ─── Demo Orders ──────────────────────────────────────────────────────────────
// Hardcoded, fixed layout for the demo video.
// 3 New · 2 Preparing · 3 Ready · 0 Completed · 0 Cancelled
// ALL paymentStatus = 'Unpaid'  →  Dashboard revenue starts at $0.00
const now = new Date();
const ts = (offsetMinutes: number) =>
    new Date(now.getTime() - offsetMinutes * 60_000).toISOString();

const DEMO_ORDERS = [
    // ── NEW (3) ────────────────────────────────────────────────────────────────
    {
        orderNumber: 'ORD-001',
        tableId: 'Table 3',
        status: 'New',
        paymentStatus: 'Unpaid',
        totalAmount: 18.50,
        items: JSON.stringify([
            { id: 'item-1', name: 'Spanish Latte',    quantity: 2, price: 6.00 },
            { id: 'item-2', name: 'Croissant',         quantity: 1, price: 4.50 },
            { id: 'item-3', name: 'Orange Juice',      quantity: 1, price: 4.00 },
        ]),
        createdAt: ts(3),
    },
    {
        orderNumber: 'ORD-002',
        tableId: 'Table 7',
        status: 'New',
        paymentStatus: 'Unpaid',
        totalAmount: 14.00,
        items: JSON.stringify([
            { id: 'item-4', name: 'Cappuccino',        quantity: 2, price: 5.00 },
            { id: 'item-5', name: 'Avocado Toast',     quantity: 1, price: 9.00 },
        ]),
        createdAt: ts(5),
    },
    {
        orderNumber: 'ORD-003',
        tableId: 'Table 1',
        status: 'New',
        paymentStatus: 'Unpaid',
        totalAmount: 11.50,
        items: JSON.stringify([
            { id: 'item-6', name: 'Espresso Shot',     quantity: 2, price: 3.50 },
            { id: 'item-7', name: 'Blueberry Muffin',  quantity: 1, price: 4.50 },
        ]),
        createdAt: ts(7),
    },

    // ── PREPARING (2) ─────────────────────────────────────────────────────────
    {
        orderNumber: 'ORD-004',
        tableId: 'Table 5',
        status: 'Preparing',
        paymentStatus: 'Unpaid',
        totalAmount: 22.00,
        items: JSON.stringify([
            { id: 'item-8',  name: 'Iced Caramel Macchiato', quantity: 2, price: 6.50 },
            { id: 'item-9',  name: 'Club Sandwich',           quantity: 1, price: 9.00 },
        ]),
        createdAt: ts(15),
    },
    {
        orderNumber: 'ORD-005',
        tableId: 'Table 2',
        status: 'Preparing',
        paymentStatus: 'Unpaid',
        totalAmount: 19.50,
        items: JSON.stringify([
            { id: 'item-10', name: 'Mocha Frappe',     quantity: 1, price: 6.50 },
            { id: 'item-11', name: 'Eggs Benedict',    quantity: 1, price: 13.00 },
        ]),
        createdAt: ts(18),
    },

    // ── READY (3) ─────────────────────────────────────────────────────────────
    {
        orderNumber: 'ORD-006',
        tableId: 'Table 9',
        status: 'Ready',
        paymentStatus: 'Unpaid',
        totalAmount: 15.00,
        items: JSON.stringify([
            { id: 'item-12', name: 'Flat White',       quantity: 3, price: 5.00 },
        ]),
        createdAt: ts(25),
    },
    {
        orderNumber: 'ORD-007',
        tableId: 'Table 4',
        status: 'Ready',
        paymentStatus: 'Unpaid',
        totalAmount: 27.50,
        items: JSON.stringify([
            { id: 'item-13', name: 'Spanish Latte',    quantity: 2, price: 6.00 },
            { id: 'item-14', name: 'Grilled Panini',   quantity: 1, price: 11.50 },
            { id: 'item-15', name: 'Espresso Shot',    quantity: 1, price: 4.00 },
        ]),
        createdAt: ts(30),
    },
    {
        orderNumber: 'ORD-008',
        tableId: 'Table 6',
        status: 'Ready',
        paymentStatus: 'Unpaid',
        totalAmount: 12.00,
        items: JSON.stringify([
            { id: 'item-16', name: 'Americano',        quantity: 2, price: 4.00 },
            { id: 'item-17', name: 'Banana Bread',     quantity: 1, price: 4.00 },
        ]),
        createdAt: ts(35),
    },
];

const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(CONFIG.API_KEY);

const db = new Databases(client);

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Clear all documents from a collection ────────────────────────────────────
async function clearCollection(collId: string) {
    let deleted = 0;
    while (true) {
        const res = await db.listDocuments(CONFIG.DB_ID, collId, [Query.limit(100)]);
        if (res.documents.length === 0) break;
        for (const doc of res.documents) {
            await db.deleteDocument(CONFIG.DB_ID, collId, doc.$id);
            deleted++;
        }
    }
    console.log(`   🗑️  Cleared ${deleted} document(s) from '${collId}'`);
}

async function main() {
    console.log('🚀 Starting Appwrite Seeding...');

    // 1. Create Database (idempotent)
    try {
        await db.create(CONFIG.DB_ID, 'Restaurant DB');
        console.log('✅ Database created');
    } catch (e: any) {
        if (e.code === 409) console.log('ℹ️  Database already exists');
        else throw e;
    }

    // 2. Create Menu Collection (idempotent)
    const menuCollId = 'menu_items';
    try {
        await db.createCollection(CONFIG.DB_ID, menuCollId, 'Menu Items', [
            Permission.read(Role.any()),
            Permission.write(Role.any()),
        ]);
        console.log('✅ Menu Collection created');

        await db.createStringAttribute(CONFIG.DB_ID, menuCollId, 'name', 255, true);
        await db.createFloatAttribute(CONFIG.DB_ID, menuCollId, 'price', true);
        await db.createStringAttribute(CONFIG.DB_ID, menuCollId, 'category', 100, true);
        await db.createStringAttribute(CONFIG.DB_ID, menuCollId, 'description', 1000, false);
        await db.createUrlAttribute(CONFIG.DB_ID, menuCollId, 'image', true);
        await db.createBooleanAttribute(CONFIG.DB_ID, menuCollId, 'available', true);

        console.log('⏳ Waiting for attributes to index...');
        await wait(2000);
    } catch (e: any) {
        if (e.code === 409) console.log('ℹ️  Menu Collection already exists');
        else console.error('Error creating menu collection:', e);
    }

    // 3. Create Orders Collection (idempotent)
    const ordersCollId = 'orders';
    try {
        await db.createCollection(CONFIG.DB_ID, ordersCollId, 'Orders', [
            Permission.read(Role.any()),
            Permission.write(Role.any()),
        ]);
        console.log('✅ Orders Collection created');

        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'orderNumber', 50, true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'tableId', 50, true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'status', 50, true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'paymentStatus', 20, false, 'Unpaid');
        await db.createFloatAttribute(CONFIG.DB_ID, ordersCollId, 'totalAmount', true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'items', 10000, true);
        await db.createStringAttribute(CONFIG.DB_ID, ordersCollId, 'createdAt', 100, true);

        console.log('⏳ Waiting for attributes to index...');
        await wait(2000);
    } catch (e: any) {
        if (e.code === 409) console.log('ℹ️  Orders Collection already exists');
    }

    // 4. Seed Menu items (skip if already present)
    console.log('\n🌱 Seeding menu items...');
    for (const item of INITIAL_MENU_ITEMS) {
        try {
            await db.createDocument(CONFIG.DB_ID, menuCollId, ID.unique(), {
                name: item.name,
                price: item.price,
                category: item.category,
                description: item.description,
                image: item.image,
                available: item.available,
            });
            console.log(`   + ${item.name}`);
        } catch (e: any) {
            console.log(`   ~ Skipped (exists): ${item.name}`);
        }
    }

    // 5. Clear ALL existing orders then insert the fixed demo set
    console.log('\n🧹 Clearing existing orders...');
    await clearCollection(ordersCollId);

    console.log('\n🎬 Inserting demo orders (3 New · 2 Preparing · 3 Ready · all Unpaid)...');
    for (const order of DEMO_ORDERS) {
        await db.createDocument(CONFIG.DB_ID, ordersCollId, ID.unique(), order);
        console.log(`   + ${order.orderNumber}  [${order.status}]  $${order.totalAmount.toFixed(2)}`);
    }

    console.log('\n✨ Done! Your Kanban board is ready for the demo video.');
    console.log('   Revenue on Dashboard (Today) → $0.00');
    console.log('   Orders on Kanban: 3 New | 2 Preparing | 3 Ready');
}

main().catch(console.error);
