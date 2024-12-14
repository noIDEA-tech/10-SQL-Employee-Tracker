SELECT * FROM department;

SELECT role.id, role.title, role.salary, deparment.name AS department
FROM role
JOIN department ON role.department_id = department.id