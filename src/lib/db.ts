/**
 * Database Helper using Oracle REST Data Services (ORDS)
 * Pure REST - No Wallet needed.
 */

const ORDS_BASE_URL = process.env.ORDS_BASE_URL || "https://gb3e6b16544f98d-m2.adb.ap-hyderabad-1.oraclecloudapps.com/ords/utpal/";

export async function executeQuery(tableName: string, params?: Record<string, string>) {
    if (!ORDS_BASE_URL) {
        return [];
    }

    // Ensure we don't have double slashes and clean the table name
    const cleanTable = tableName.replace(/\/$/, "");
    let url = `${ORDS_BASE_URL}${cleanTable}`;

    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }

    console.log(`🌐 Calling ORDS: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store' // Avoid caching stale data during setup
        });

        if (!response.ok) {
            console.error(`ORDS Error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return data.items || [];
    } catch (err) {
        console.error('❌ Fetch Error:', err);
        return [];
    }
}
