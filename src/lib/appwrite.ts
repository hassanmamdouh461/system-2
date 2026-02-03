import { Client, Databases } from 'appwrite';

export const APPWRITE_CONFIG = {
    ENDPOINT: 'https://fra.cloud.appwrite.io/v1',
    PROJECT_ID: '698232950032f12e7895',
    DB_ID: 'restaurant_db',
    COLLECTIONS: {
        MENU: 'menu_items',
        ORDERS: 'orders'
    }
};

const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
    .setProject(APPWRITE_CONFIG.PROJECT_ID);

export const databases = new Databases(client);
export { client };
