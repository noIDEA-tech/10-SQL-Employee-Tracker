INSERT INTO  department (name) 
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, (SELECT id FROM department WHERE name = 'Sales')),
       ('Lead Engineer', 150000 (SELECT id FROM department WHERE name = 'Engineering')),
       ('Software Engineer', 120000 (SELECT id FROM department WHERE name = 'Engineering')),
       ('Account Manager', 160000 (SELECT id FROM department WHERE name = 'Finance')), 
       ('Accountant', 125000, (SELECT id FROM department WHERE name = 'Finance')),
       ('Legal Team Lead', 250000, (SELECT id FROM department WHERE name = 'Legal')),
       ('Lawyer', 190000, (SELECT id FROM department WHERE name = 'Legal'));

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
    (2, 'Mike', 'Chan', (SELECT id FROM role WHERE title = 'Salesperson'), 
        (SELECT id FROM employee WHERE first_name = 'John' AND last_name = 'Doe')),
    (3, 'Ashley', 'Rodriguez', (SELECT id FROM role WHERE title = 'Lead Engineer'), 
        NULL),
    (4, 'Kevin',. 'Tupik', (SELECT id FROM role WHERE title = 'Software Engineer'),
        (SELECT id FROM employee WHERE first_name = 'Ashley', AND last_name = 'Rodriguez')),
    (5, 'Kunai', 'Singh', (SELECT id FROM role WHERE title = 'Account Manager')
        NULL),
    (6, 'Malia', 'Brown', (SELECT id FROM role WHERE title = 'Accountant'), 
        (SELECT id from employee WHERE first_name = 'Kunai', AND last_name = 'Singh')),
    (7, 'Sarah', 'Lourd', (SELECT id FROM role WHERE title = 'Legal Team Lead'), 
        NULL)
    (8, 'Tom', 'Allen', (SELECT id FROM role WHERE title = 'Lawyer'),
        (SELECT id FROM employee WHERE first_name = 'Sarah', AND last_name = 'Lourd'));
    



-- EXAMPLE CODE FROM GITHUB:
-- INSERT INTO department(department_name)
-- VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing");

-- INSERT INTO role(title, salary, department_id)
-- VALUES("Engineer", 85000, 1), ("Senior Engineer", 125000, 1), ("CFO", 350000, 3), ("Chief Counsel", 300000, 4);

-- INSERT INTO employee(first_name, last_name, role_id, manager_id)
-- VALUES ('Johnnie', 'Random', 1, 2), ('James', 'Smith', 1, null), ('Ronnie', 'Manning', 1, 2), ('Jimmy', 'Jones', 2, 2), ('Larry', 'Legal', 4, null);

