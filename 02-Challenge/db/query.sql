SELECT * FROM department;

SELECT role.id, role.title, role.salary, department.name AS department_name 
FROM role
JOIN department ON role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department_name, role.salary, 
CONCAT(manager.first_name, '', manager.last_name) AS manager_name
FROM employee
LEFT JOIN role ON employee.role_id  = role.id
LEFT JOIN department ON role.department.id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

SELECT department_name AS department_name, employee.first_name, employee.last_name, role.title AS job_title
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.deparment_id = department.id
ORDER BY department.name;
 
SELECT CONCAT(manager.first_name, '', manager.last_name) AS manager_name, 
employee.first_name, employee.last_name, role.title AS job_title
FROM employee
JOIN employee AS manager ON employee.manager_id = manager.id
JOIN role ON employee.role_id = role.id
ORDER BY manager_name;
 
SELECT department.name AS department_name, 
SUM(role.salary) AS total_budget
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
GROUP BY department.name;

