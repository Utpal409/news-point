const ORDS_BASE_URL = "https://gb3e6b16544f98d-m2.adb.ap-hyderabad-1.oraclecloudapps.com/ords/utpal/";

async function testEndpoints() {
    const endpoints = ['news_categories', 'news_articles_v', 'news_articles'];

    for (const ep of endpoints) {
        console.log(`\n🔍 Testing endpoint: ${ORDS_BASE_URL}${ep}`);
        try {
            const response = await fetch(`${ORDS_BASE_URL}${ep}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Success! Found ${data.items ? data.items.length : 0} items.`);
            } else {
                console.error(`❌ Error ${response.status}: ${response.statusText}`);
            }
        } catch (err) {
            console.error('❌ Fetch Error:', err.message);
        }
    }
}

testEndpoints();
