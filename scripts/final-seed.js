require('dotenv').config({ path: '.env.local' });
const oracledb = require('oracledb');
const path = require('path');

try { oracledb.initOracleClient({ configDir: path.resolve(process.cwd(), 'oracle_wallet') }); } catch (err) { }

async function cleanAndSeed() {
    const adminConfig = {
        user: 'ADMIN',
        password: 'Utpal@1234567',
        connectString: 'm2_high'
    };

    let connection;
    try {
        console.log('🔌 Connecting as ADMIN to finalize Vercel-ready data...');
        connection = await oracledb.getConnection(adminConfig);

        console.log('🧹 Clearing UTPAL schema...');
        await connection.execute(`DELETE FROM UTPAL.NEWS_ARTICLES`);
        await connection.execute(`DELETE FROM UTPAL.NEWS_AUTHORS`);

        console.log('👤 Adding Official Author...');
        await connection.execute(`INSERT INTO UTPAL.NEWS_AUTHORS (id, name, role) VALUES (1, 'Utpal Analytics', 'Editor-in-Chief')`);

        console.log('📰 Adding Professional News Articles...');
        const articles = [
            {
                slug: 'spacex-starship-2026',
                title: 'SpaceX Starship Successfully Completes Lunar Orbit Mission',
                subtitle: 'A historic milestone in interplanetary travel as the largest rocket ever built completes its most complex mission to date.',
                content: 'HOUSTON — In a move that brings humanity closer to Mars, SpaceX’s Starship successfully entered and exited lunar orbit this morning. The mission, which lasted six days, demonstrated the reliability of the Raptor engines in deep space environments. CEO Elon Musk stated that the data gathered is "game-changing" for the upcoming Artemis missions.',
                category: 'Space',
                image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933'
            },
            {
                slug: 'quantum-computing-breakthrough',
                title: 'Quantum Computing Reaches "Superiority" Milestone',
                subtitle: 'Researchers at the Global Tech Institute solve a 10,000-year problem in seconds.',
                content: 'GENEVA — Scientists have announced a breakthrough in quantum error correction, allowing quantum computers to run for hours instead of milliseconds. This advancement paves the way for drug discovery and financial modeling at speeds previously thought impossible in this century. The new processor, named "Aeon-1", contains 1,000 stable qubits.',
                category: 'Tech',
                image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485'
            },
            {
                slug: 'green-energy-2026',
                title: 'Renewable Energy Now Powers 60% of Global Grid',
                subtitle: 'New report shows solar and wind adoption outpaced all projections for the fiscal year.',
                content: 'LONDON — The International Energy Agency reported today that for the first time in history, more than half of the world’s electricity is generated from renewable sources. Lead researcher Dr. Sarah Chen attributed the surge to a 40% drop in battery storage costs, making solar power viable even in regions with low sunlight.',
                category: 'World',
                image: 'https://images.unsplash.com/photo-1509391366360-fe5bb65213b0'
            }
        ];

        for (const art of articles) {
            await connection.execute(
                `INSERT INTO UTPAL.NEWS_ARTICLES (slug, title, subtitle, content, category, image_url, author_id) 
                 VALUES (:1, :2, :3, :4, :5, :6, 1)`,
                [art.slug, art.title, art.subtitle, art.content, art.category, art.image]
            );
        }

        await connection.commit();
        console.log('✨ SUCCESS: Data is clean and Vercel-ready!');

    } catch (err) {
        console.error('❌ Failed:', err.message);
    } finally {
        if (connection) await connection.close();
    }
}

cleanAndSeed();
