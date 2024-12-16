dotenv.config();
require('dotenv').config();
const { Client } = require('pg');
import dotenv from 'dotenv';
import { Client } from 'pg';

const client = new Client({
    host: process.env.DB.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWOORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = client;