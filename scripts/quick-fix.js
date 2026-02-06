require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (err) { }

async function quickSeed() {
    const config = { user: 'ADMIN', password: 'Utpal@1234567', connectString: 'm2_high' };
    let conn;
    try {
        conn = await oracledb.getConnection(config);
        await conn.execute(`DELETE FROM UTPAL.NEWS_ARTICLES`);
        await conn.execute(`DELETE FROM UTPAL.NEWS_AUTHORS`);
        await conn.commit();
        await conn.execute(`INSERT INTO UTPAL.NEWS_AUTHORS (id, name) VALUES (1, 'Utpal')`);
        await conn.execute(`
            INSERT INTO UTPAL.NEWS_ARTICLES (slug, title, category, content, author_id) 
            VALUES ('spacex', 'SpaceX Starship Success', 'Space', 'Starship reached orbit today.', 1)
        `);
        await conn.execute(`
            INSERT INTO UTPAL.NEWS_ARTICLES (slug, title, category, content, author_id) 
            VALUES ('ai-2026', 'AI Breakthrough', 'Tech', 'Neural networks are evolving.', 1)
        `);
        await conn.commit();
        console.log('✅ DATABASE READY.');
    } catch (e) {
        console.error(e.message);
    } finally {
        if (conn) await conn.close();
    }
}

quickSeed();
