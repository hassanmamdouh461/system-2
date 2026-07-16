export const D1_CONFIG = {
  WORKER_URL: import.meta.env.VITE_CF_WORKER_URL || '',
};

export async function executeD1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!D1_CONFIG.WORKER_URL || D1_CONFIG.WORKER_URL.includes('your-username')) {
    console.warn('[D1 Client] VITE_CF_WORKER_URL is not configured properly! Using local fallback data.');
    return [];
  }

  try {
    const response = await fetch(D1_CONFIG.WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudflare D1 query failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Cloudflare D1 query returned error: ${data.error}`);
    }

    const queryResult = data.result[0];
    return (queryResult?.results || []) as T[];
  } catch (error) {
    console.error('[D1 Client] Connection error:', error);
    throw error;
  }
}

export async function executeD1Batch(batch: { sql: string; params: any[] }[]): Promise<any[]> {
  if (!D1_CONFIG.WORKER_URL || D1_CONFIG.WORKER_URL.includes('your-username')) {
    console.warn('[D1 Client] VITE_CF_WORKER_URL is not configured properly!');
    return [];
  }

  try {
    const response = await fetch(D1_CONFIG.WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batch }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudflare D1 batch failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Cloudflare D1 batch returned error: ${data.error}`);
    }

    return data.result || [];
  } catch (error) {
    console.error('[D1 Client] Connection error during batch:', error);
    throw error;
  }
}
