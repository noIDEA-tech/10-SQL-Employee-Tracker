SELECT * FROM department;

SELECT role.id, role.title, role.salary, deparment.name AS department_name 
FROM role
JOIN department ON role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, 
department.name AS department_name,
role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager_name
FROM employee
LEFT JOIN role ON employee.role_id  = role.id
LEFT JOIN department ON role.department.id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

SELECT 