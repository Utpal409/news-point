require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

// Initialize Thin Mode
try {
    oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') });
} catch (err) { }

const dbConfig = {
    user: process.env.ORACLE_DB_USER || 'ADMIN',
    password: process.env.ORACLE_DB_PASSWORD,
    connectString: 'm2_high'
};

async function cleanupOldTables() {
    let connection;
    try {
        console.log('🔌 Connecting to database for cleanup...');
        connection = await oracledb.getConnection(dbConfig);
        console.log('✅ Connected.');

        const tablesToDrop = [
            'ARTICLE_TAGS',
            'TAGS',
            'ARTICLES',
            'CATEGORIES',
            'USERS'
        ];

        for (const table of tablesToDrop) {
            console.log(`🗑️  Dropping ${table}...`);
            try {
                await connection.execute(`DROP TABLE ${table} CASCADE CONSTRAINTS`);
                console.log(`   Done.`);
            } catch (e) {
                if (e.errorNum === 942) {
                    console.log(`   Table ${table} did not exist.`);
                } else {
                    console.error(`   Error dropping ${table}:`, e.message);
                }
            }
        }

        await connection.commit();
        console.log('✨ Database is now clean of old tables!');

    } catch (err) {
        console.error('❌ Cleanup Failed:', err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { }
        }
    }
}

cleanupOldTables();
