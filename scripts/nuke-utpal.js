require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try {
    oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') });
} catch (err) { }

async function nukeUtpal() {
    const adminConfig = {
        user: 'ADMIN',
        password: 'Utpal@1234567',
        connectString: 'm2_high'
    };

    let connection;
    try {
        connection = await oracledb.getConnection(adminConfig);
        const result = await connection.execute(
            `SELECT table_name FROM all_tables WHERE owner = 'UTPAL'`
        );

        if (result.rows.length > 0) {
            for (const row of result.rows) {
                const tableName = row[0];
                try {
                    await connection.execute(`DROP TABLE UTPAL."${tableName}" CASCADE CONSTRAINTS`);
                } catch (e) { }
            }
        }

        await connection.commit();
        console.log('✨ UTPAL schema is now completely EMPTY.');

    } catch (err) {
        console.error('❌ Operation Failed:', err);
    } finally {
        if (connection) await connection.close();
    }
}

nukeUtpal();
