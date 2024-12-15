const { Client } = require('pg');

class Database {
    constructor(config) {
        this.client = new Client(config);
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to PostgreSQL database');
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    async viewDepartments() {
        try {
           const result = await this.client.query('SELECT * FROM department');
           return result.rows;
        } catch (err) {
            console.error('Error viewing departments:', err);
        }
    }

    async viewRoles() {
        try {
            const result = await this.client.query(`
                SELECT role.id, role.title, role.salary, department.name AS department
                FROM role
                JOIN department on role.department_id = department.id
            `);
            return result.rows;
            } catch (err) {
            console.error('Error viewing roles:', err);
        }
    }

    async viewEmployees() {
        try {
            
        }
    }
}
