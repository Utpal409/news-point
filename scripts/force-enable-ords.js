require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (err) { }

async function forceEnableORDS() {
    const adminConfig = {
        user: 'ADMIN',
        password: 'Utpal@1234567',
        connectString: 'm2_high'
    };

    let connection;
    try {
        console.log('🔌 Connecting as ADMIN...');
        connection = await oracledb.getConnection(adminConfig);
        console.log('✅ Connected.');

        console.log('🌐 Force-Enabling ORDS for UTPAL...');
        await connection.execute(`
            BEGIN
                ORDS_ADMIN.ENABLE_SCHEMA(
                    p_enabled             => TRUE,
                    p_schema              => 'UTPAL',
                    p_url_mapping_type    => 'BASE_PATH',
                    p_base_path           => 'utpal',
                    p_auto_rest_auth      => FALSE
                );
                
                ORDS.ENABLE_OBJECT(
                    p_enabled      => TRUE,
                    p_schema       => 'UTPAL',
                    p_object       => 'NEWS_ARTICLES',
                    p_object_type  => 'TABLE',
                    p_object_alias => 'news_articles',
                    p_auto_rest_auth => FALSE
                );
                COMMIT;
            END;
        `);

        console.log('✨ REST API is now officially ACTIVE!');

    } catch (err) {
        console.error('❌ Error during ORDS activation:', err.message);
    } finally {
        if (connection) await connection.close();
    }
}

forceEnableORDS();
