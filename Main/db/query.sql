SELECT employee.first_name AS employee first name, 
employee.last_name AS employee last name, employee.job_title AS job title, 
employee.department AS department, employee.salary AS salary, 
employee.manager AS manager
FROM Employee
LEFT JOIN Role
ON employee.role_id = position.title;


