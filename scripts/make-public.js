require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (err) { }

async function makePublic() {
    const adminConfig = {
        user: 'ADMIN',
        password: 'Utpal@1234567',
        connectString: 'm2_high'
    };

    let connection;
    try {
        console.log('🔌 Connecting as ADMIN...');
        connection = await oracledb.getConnection(adminConfig);

        console.log('🔓 Granting Public access to UTPAL tables...');
        await connection.execute('GRANT SELECT ON UTPAL.NEWS_ARTICLES TO PUBLIC');
        await connection.execute('GRANT SELECT ON UTPAL.NEWS_AUTHORS TO PUBLIC');

        console.log('🔗 Creating Public synonyms...');
        await connection.execute('CREATE OR REPLACE PUBLIC SYNONYM NEWS_ARTICLES FOR UTPAL.NEWS_ARTICLES');
        await connection.execute('CREATE OR REPLACE PUBLIC SYNONYM NEWS_AUTHORS FOR UTPAL.NEWS_AUTHORS');

        await connection.commit();
        console.log('✅ Tables are now PUBLICLY visible to everyone!');

    } catch (err) {
        console.error('❌ Error sharing tables:', err.message);
    } finally {
        if (connection) await connection.close();
    }
}

makePublic();
