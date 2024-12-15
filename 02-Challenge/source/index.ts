import dotenv from 'dotenv';
dotenv.config();
//copied from mini-challenge
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to employee database.');
  } catch (err) {
    console.error('Error connecting to employee database:', err);
    process.exit(1);
  }
};

export { pool, connectToDb };
//COPIED FROM EXPRESS

// import pg from 'pg'
// const { Pool } = pg
 
// const pool = new Pool()
 
// export const query = (text, params) => pool.query(text, params)
 