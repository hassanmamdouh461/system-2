import { Client, Databases, RealtimeResponseEvent } from 'appwrite';

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

/**
 * Direct REST API call to Appwrite - bypasses the SDK serializer bug in v22
 * that causes "t.isBigNumber is not a function" errors on PATCH requests.
 */
export async function directUpdate(
    collectionId: string,
    docId: string,
    data: Record<string, unknown>
): Promise<any> {
    const url = `${APPWRITE_CONFIG.ENDPOINT}/databases/${APPWRITE_CONFIG.DB_ID}/collections/${collectionId}/documents/${encodeURIComponent(docId)}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': APPWRITE_CONFIG.PROJECT_ID,
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || `HTTP ${res.status}`);
    }
    return res.json();
}

/**
 * Direct REST API POST call - bypasses the SDK serializer bug in v22
 * that causes "t.isBigNumber is not a function" errors on createDocument.
 */
export async function directCreate(
    collectionId: string,
    docId: string,
    data: Record<string, unknown>
): Promise<any> {
    const url = `${APPWRITE_CONFIG.ENDPOINT}/databases/${APPWRITE_CONFIG.DB_ID}/collections/${collectionId}/documents`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': APPWRITE_CONFIG.PROJECT_ID,
        },
        body: JSON.stringify({ documentId: docId, data }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || `HTTP ${res.status}`);
    }
    return res.json();
}

/**
 * Direct REST API DELETE call - bypasses the SDK serializer bug in v22.
 */
export async function directDelete(
    collectionId: string,
    docId: string
): Promise<void> {
    const url = `${APPWRITE_CONFIG.ENDPOINT}/databases/${APPWRITE_CONFIG.DB_ID}/collections/${collectionId}/documents/${encodeURIComponent(docId)}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'X-Appwrite-Project': APPWRITE_CONFIG.PROJECT_ID,
        },
    });
    if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || `HTTP ${res.status}`);
    }
}
