import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'finance_tracker',
    password: '',
    port: 5432,
});

export default pool;
