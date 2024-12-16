const inquirer = require('inquirer');
const { Client } = require('pg');
require('dotenv').config();
require('console.table');
 
const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

async function init() {
    try {
        await client.connect();
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
                await viewEployeesByDepartment();
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
                await client.end();
                console.log('Goodbye!');
                process.exit();                    
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

async function viewDepartments() {
    try {
        const result = await client.query('SELECT * FROM department');
        console.table(result.rows);
        startApp();
    } catch (err) {
        console.error('Error viewing departments:', err);
        startApp();
    }
}

async function viewRoles() {
    try {
        const result = await client.query(`
            SELECT DISTINCT role.id, role.title, department.name AS department, role.salary
            FROM role
            JOIN department ON role.department_id = department.id
        `);
        console.table(result.rows);
        startApp();
    } catch (err) {
        console.error('Error viewing roles:', err);
        startApp();
    }
}
async function viewEmployees() {
    try {
        const result = await client.query(` 
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
async function viewDepartmentBudget() {
    try {
        const result = await client.query(`
            SELECT 
                d.name AS department,
                SUM(r.salary) AS total_budget
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            GROUP BY d.name
        `);
        console.table(result.rows);
        startApp();
    } catch (err) {
        console.error('Error viewing department budget:', err);
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
                validate: (input) => {
                    
                 if (/^\d+/.test(input)) {
                    return 'Department name cannot be just numbers';
                 }

                 if (!input.trim()) {
                    return 'Department name cannot be empty';
                 }
                 return true;
            }
        }
   ]);
 
    await client.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
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
         client.query('SELECT * FROM department')
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
            //     choices: [
            //         depts.rows.map(dept => ({ name: dept.name, value: dept.id 
            // }))
        }
    ]);

    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
        [answer.title, answer.salary, answer.department_id]
        );
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
         client.query('SELECT * FROM role'),
         client.query('SELECT * FROM employee')
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
            
            {
                type: 'list',
                name: 'managerId',
                message: "Who is the employee's manager?",
                choices: [ 
                { name: 'None', value: null },
                ...employees.rows.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                })) 
            ]  
        }    
    ]);

    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId]
    );
    console.log(`Added ${answer.firstName} ${answer.lastName} to the database.`);
    startApp();
    } catch (err) {
        console.error('Error adding employee:', err);
        startApp();
    }
}

async function updateEmployeeRole() {
    try {
        const [employees, roles] = await Promise.all([
            client.query('SELECT * FROM employee'),
            client.query('SELECT * FROM role')
        ]);

        const answer = await inquirer.prompt([
           {
            type: 'list',
            name: 'employeeId',
            message: "Which employee's role do you want to update?",
            choices: employees.rows.map(emp => ({
               name: `${emp.first_name} ${emp.last_name}`,
               value: emp.id 
            }))
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's new role?",
            choices: roles.rows.map(role => ({
                name: role.title,
                value: role.id
            }))
        }
    ]);

    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', 
        [answer.roleId, answer.employeeId]
    );
    console.log(`Employee role updated successfully!`);
    startApp();
    } catch (err) {
        console.error('Error updating employee role:', err);
        startApp();
    }
}

async function deleteDepartment() {
    try {
        const departments = await client.query('SELECT * FROM department');

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which department do you want to delete?',
                choices: departments.rows.map(department => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]);

        await client.query('DELETE FROM department WHERE id = $1', [answer.departmentId]);
        console.log('Department deleted successfully!');
        startApp();
    } catch (err) {
        console.error('Error deleting department:', err);
        startApp();
    }
}

async function deleteRole() {
    try {
        const roles = await client.query('SELECT * FROM role');

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role do you want to delete?',
                choices: roles.rows.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ]);

        await client.query('DELETE FROM role WHERE id = $1', [answer.roleId]);
        console.log('Role deleted successfully!');
        startApp();
    } catch (err) {
        console.error('Error deleting role:', err);
        startApp();
    }
}

async function deleteEmployee() {
    try {
        const employees = await client.query('SELECT * FROM employee');

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Which employee do you want to delete?',
                choices: employees.rows.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]);

        await client.query('DELETE FROM employee WHERE id = $1', [answer.employeeId]);
        console.log('Employee deleted successfully!');
        startApp();
    } catch (err) {
        console.error('Error deleting employee:', err);
        startApp();
    }
}
init();
// export { client, init };


