require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (e) { }

async function checkTables() {
    const dbConfig = {
        user: process.env.ORACLE_DB_USER || 'ADMIN',
        password: process.env.ORACLE_DB_PASSWORD,
        connectString: 'm2_high'
    };

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('connected');

        try {
            const result = await connection.execute('SELECT COUNT(*) AS CNT FROM NEWS_ARTICLES');
            console.log('Articles Count:', result.rows[0]);
        } catch (e) {
            console.log('NEWS_ARTICLES table does not exist or empty.');
        }

        try {
            const result2 = await connection.execute('SELECT * FROM NEWS_ARTICLES FETCH FIRST 1 ROWS ONLY');
            console.log('First Article Title:', result2.rows[0].TITLE);
        } catch (e) { }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) await connection.close();
    }
}

checkTables();
