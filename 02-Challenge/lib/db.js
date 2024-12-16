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
            const result = await this.client.query(`
                SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
                CONCAT(manager.first_name, ' ', manager,last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id 
                `);
            return result.rows;
        } catch (err) {
            console.error('Error viewing employees:', err);
        }
    }

    async addDepartments(name) {
        try {
            await this.client.query('INSERT INTO department (name) VALUES ($1)', [name]);
            return true;
        } catch (err) {
            console.error('Error adding department:', err);
            return false;
        }
    }

    async addRole(title, salary, departmentId) {
        try {
            await this.client.query(
                'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]
            );
            return true;
        } catch (err) {
            console.error('Error adding role:', err);
            return false;
        }
    }
    async addEmployeeRole(employeeId, roleId) {
        try {
            await this.client.query(
                'UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]
            );
            return true;
        } catch (err) {
            console.error('Error updating employee role:', err);
            return false;
        }
    }

    async eupdateEmployeeRole(employeeId, roleId) {
        try {
            await this.client.query(
                'UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]
            );
            return true;
        } catch (err) {
            console.error('Error updating employee role:', err);
            return false;
        }
    }

    async updateEmployeeManager(employeeId, managerId) {
        try {
            await this.client.query(
                'UPDATE employee SET manager_id = $1 WHERE id = $2', [managerId, employeeId]
            );
            return true;
        } catch (err) {
            console.error('Error updating employee manager:', err);
            return false;
        }
    }

    async viewEmployeesByManager(managerId) {
        try {
            const result = await this.client.query(` 
                SELECT employee.id, employee.first_name, employee.last_name, role.title, 
                FROM employee
                JOIN role ON employee.role_id = role.id
                WHERE manager_id = $1`, [managerId]);
            
            return result.rows;
        } catch (err) {
            console.error('Error viewing employees by manager:', err);
        }
    }

    async viewEmployeesByDepartment(departmentId) {
        try {
            const result = await this.client.query(`
                SELECT employee.id, employee.first_name, employee.last_name, role.title
                FROM employee
                JOIN role ON employee.role_id = role.id
                WHERE role.department_id = $1`, [departmentId]);
            return result.rows;
        } catch (err) {
            console.error('Error viewing employees by department:', err);
        }
    }
    async deleteDepartment(id) {
        try {
            await this.client.query('DELETE FROM department WHERE id = $1', [id]);
            return true;
        } catch (err) {
            console.error('Error deleting department:', err);
            return false;
        }
    }

    async deleteRole(id) {
        try {
            await this.client.query('DELETE FROM role WHERE id = $1', [id]);
            return true;
        } catch (err) {
            console.error('Error deleting role:', err);
            return false;
        }
    }

    async deleteEmployee(id) {
        try {
            await this.client.query('DELETE FROM employee WHERE id = $1', [id]);
            return true;
        } catch (err) {
            console.error('Error deleting employee:', err);
            return false;
        }
    }

    async viewDepartmentBudget(departmentId) {
        try {
          const result = await this.client.query(`
            SELECT 
              d.name AS department,
              SUM(r.salary) AS total_budget
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            WHERE d.id = $1
            GROUP BY d.name
          `, [departmentId]);
          return result.rows[0];
        } catch (err) {
          console.error('Error viewing department budget:', err);
        }
      }
      async close() {
        try {
          await this.client.end();
          console.log('Database connection closed');
        } catch (err) {
          console.error('Error closing database connection:', err);
        }
      }
    }
    
module.exports = Database;
