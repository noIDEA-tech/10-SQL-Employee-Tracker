# 10-SQL-Employee-Tracker
Employee Tracker CLI application for Employee Database Management
 
![MIT](https://img.shields.io/badge/License-MIT-blue)

## Description
This Employee Tracker is a command-line application created to manage a company's employee database. This application provides users with the functionality to view, add, delete, and update employees and managers, employee/manager roles, employee/manager salaries as well as view, add, delete departments and roles via command generated prompts within the terminal. Users are then able to view the data output in a table format within the terminal. 

## Video Demonstration
[Click to View Video Demonstration](https://drive.google.com/file/d/1FGjUMmTp6k0KhiWj2BPYDTkzAtNCsVld/view)

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)
- [Tests](#tests)
- [Contact](#contact)

## Installation
Run: npm init -y; npm i inquirer@8.2.4; npm install pg; npm install inquirer@8.2.4 pg dotenv console.table

## Usage
Run node index.js

## Credits
Nancy Watreas, GitHub co-pilot, Claude.ai

## License
MIT

## Features
functionality to manage an employee database via terminal commands to view all employees, employee roles, employee salaries, add/delete employees, update employees; view all roles, add/delete roles, view all departments, add/delete departments.

## Tests
Running the following commands in the terminal root directory: psql -f db/schema.sql; psql -d employee_db -f db/seeds.sql, and node index.js

## Issues
Some of the issues I had building this database include being able to successfully log into PostgreSQL. The issue was that one of the characters in my password was a '#', which my .env file read as a comment and excluded it from the password. This was corrected by quotation marks. Other issues I had were typos and missing sections of code. Overall, it was a great learning experience for understing PostgreSQL and how crucial it is to perform commands in the proper order.

## Contact
If there are any questions or concerns, I can be reached at:
##### [github: noIDEA-tech](https://github.com/noIDEA-tech)
##### [email: nwatreas2023@gmail.com](mailto:nwatreas2023@gmail.com)