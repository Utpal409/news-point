require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (err) { }

async function checkData() {
    const adminConfig = {
        user: 'ADMIN',
        password: 'Utpal@1234567',
        connectString: 'm2_high'
    };

    let connection;
    try {
        connection = await oracledb.getConnection(adminConfig);

        const res = await connection.execute("SELECT count(*) FROM UTPAL.NEWS_ARTICLES");
        console.log(`\n📊 Data Report for UTPAL.NEWS_ARTICLES:`);
        console.log(`   Count: ${res.rows[0][0]} rows found.`);

        if (res.rows[0][0] > 0) {
            const data = await connection.execute("SELECT title FROM UTPAL.NEWS_ARTICLES");
            console.log(`   Titles: ${data.rows.map(r => r[0]).join(', ')}`);
        }

    } catch (err) {
        console.error('❌ Error checking data:', err.message);
    } finally {
        if (connection) await connection.close();
    }
}

checkData();
