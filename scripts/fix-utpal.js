require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (e) { }

async function fixUtpal() {
    const adminConfig = {
        user: 'ADMIN',
        password: process.env.ORACLE_DB_PASSWORD,
        connectString: 'm2_high'
    };

    let connection;
    try {
        console.log('🔌 Connecting as ADMIN...');
        connection = await oracledb.getConnection(adminConfig);
        console.log('✅ Connected as ADMIN.');

        console.log('🛠️  Fixing UTPAL user...');
        const newPass = "Abhishekkumar007#!";
        await connection.execute(`ALTER USER UTPAL IDENTIFIED BY "${newPass}" ACCOUNT UNLOCK`);
        await connection.execute(`GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE PROCEDURE TO UTPAL`);
        await connection.execute(`ALTER USER UTPAL QUOTA UNLIMITED ON DATA`);

        console.log('✨ UTPAL account is now READY TO USE!');

    } catch (err) {
        console.error('❌ Failed to fix UTPAL:', err);
    } finally {
        if (connection) await connection.close();
    }
}

fixUtpal();
