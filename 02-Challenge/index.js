import dotenv from 'dotenv';
import inquirer from 'inquirer';
dotenv.config();
//copied from mini-challenge
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

async function init() {
  try {
    await pool.connect();
    console.log('Connected to employee database.');
    startApp();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

async function startApp() {
    try {
        const answer = await inquirer.prompt([
            {

                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Update Employee Role',
                    'View Employees by Manager',
                    'View Employees by Department',
                    'Delete Department',
                    'Delete Role',
                    'Delete Employee',
                    'View Department Budget',
                    'Exit'
                ]
            }
        ]);

        switch (answer.action) {
            case 'View All Departments':
                await viewDepartments();
                break;
            case 'View All Roles':
                await viewRoles();
                break;
            case 'View All Employees':
                await viewEmployees();
                break;
            case 'Add Department':
                await addDepartment();
                break;
            case 'Add Role':
                await addRole();
                break;
            case 'Add Employee':
                await addEmployee();
                break;
            case 'Update Employee Role':
                await updateEmployeeRole();
                break;
            case 'View Employees by Manager':
                await viewEmployeesByManager();
                break;
            case 'View Employees by Department':
                await viewEployeesByDeparment();
                break;
            case 'Delete Department':
                await deleteDepartment();
                break;
            case 'Delete Role':
                await deleteRole();
                break;
            case 'Delete Employee':
                await deleteEmployee();
                break;
            case 'View Department Budget':
                await viewDepartmentBudget();
                break;
            case 'Exit':
                await pool.end();
                console.log('Goodbye!');
                process.exit();                    
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

async function viewDepartments() {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.table(result.rows);
        startApp();
    } catch (err) {
        console.error('Error viewing departments:', err);
        startApp();
    }
}

async function viewRoles() {
    try {
        const result = await pool.query(`
            SELECT role.id, role.title, deparment.name AS department, role.salary
            FROM role
            JOIN deparment ON role.department_id = department.id
        `);
        console.table(result.rows);
        startApp();
    } catch (err) {
        console.error('Error viewing roles:', err);
    }
}
async function viewEmployees() {
    try {
        const result = await pool.query(` 
            SELECT
            employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee  
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        `);
        console.table(result.rows);
        startApp(); 
    } catch (err) {
        console.error('Error viewing employees:', err);
        startApp();
    }
}

async function addDepartment() {
    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?',
                validate: input => input ? true : 'Department name cannot be empty.'
            }
   ]);
 
    await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
        console.log(`Added ${answer.name} department to the database.`);
        startApp();
    } catch (err) {
        console.error('Error adding department:', err);
        startApp();
    }   
}
async function addRole() {
  try {
        const [depts] = await Promise.all([
         pool.query('SELECT * FROM department')
    ]);

    const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
                validate: input => input ? true : 'Role name cannot be empty.'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?',
                validate: input => !isNaN(input) && input > 0 ? true : 'Please enter a valid salary.'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does this role belong to?',
                choices: depts.rows.map(dept => ({ name: dept.name, value: dept.id }))
            }
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id]);
        console.log(`Added ${answer.title} role to the database.`);
             startApp();
    }   catch (err) {
        console.error('Error adding role:', err);
        startApp();
    }
}

async function addEmployee() {
    try {
        const [roles, employees] = await Promise.all([
         pool.query('SELECT * FROM role'),
         pool.query('SELECT * FROM employee')
    ]);

        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: input => input ? true : 'First name cannot be empty.'
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: input => input ? true : 'Last name cannot be empty.'
            },
            {
                type: 'list',
                name: 'roleId',
                message: "What is the employee's role?",
                choices: roles.rows.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },

        ]);
    }
}
export { pool, init };


