require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');
const fs = require('fs');

async function testConnection() {
    const log = [];
    function logMsg(msg) { console.log(msg); log.push(msg); }
    function logErr(msg, err) { console.error(msg, err); log.push(msg + ' ' + (err.message || err)); }

    const walletPath = path.resolve(process.cwd(), 'oracle_wallet');
    try {
        oracledb.initOracleClient({ configDir: walletPath });
    } catch (err) {
        if (err.message.indexOf('NJS-081') === -1) logErr('Init Error:', err);
    }

    const dbConfig = {
        user: process.env.ORACLE_DB_USER || 'ADMIN',
        password: process.env.ORACLE_DB_PASSWORD,
        connectString: 'm2_high'
    };

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        logMsg('✅ SUCCESS! Connected to Oracle Database.');
        const result = await connection.execute('SELECT SYSDATE FROM DUAL');
        logMsg('Current Database Time: ' + JSON.stringify(result.rows[0]));
    } catch (err) {
        logErr('❌ Connection Failed:', err);
    } finally {
        if (connection) await connection.close();
        fs.writeFileSync('test_result.txt', log.join('\n'));
    }
}

testConnection();
