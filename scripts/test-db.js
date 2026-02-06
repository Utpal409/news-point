require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

async function testConnection() {
    const walletPath = path.resolve(process.cwd(), 'oracle_wallet');
    try {
        oracledb.initOracleClient({ configDir: walletPath });
    } catch (err) {
        if (err.message.indexOf('NJS-081') === -1) console.error('Init Error:', err);
    }

    const dbConfig = {
        user: process.env.ORACLE_DB_USER || 'ADMIN',
        password: process.env.ORACLE_DB_PASSWORD,
        connectString: 'm2_high'
    };

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('✅ SUCCESS! Connected to Oracle Database.');
        const result = await connection.execute('SELECT SYSDATE FROM DUAL');
        console.log('Current Database Time:', result.rows[0]);
    } catch (err) {
        console.error('❌ Connection Failed:', err);
    } finally {
        if (connection) await connection.close();
    }
}

testConnection();
