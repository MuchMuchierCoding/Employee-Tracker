SELECT * 
FROM position 
JOIN department ON position.department_id; 


-- SELECT employee.first_name AS first name, 
-- employee.last_name AS last name, employee.job_title AS job title, 
-- employee.department AS department, employee.salary AS salary, 
-- employee.manager AS manager
-- FROM Employee
-- LEFT JOIN Role
-- ON employee.role_id = position.title;


-- SELECT movies.movie_name AS movie, reviews.review
-- FROM reviews
-- LEFT JOIN movies
-- ON reviews.movie_id = movies.id
-- ORDER BY movies.movie_name;

-- SELECT employee.first_name AS employee first name, 
-- employee.last_name AS employee last name, employee.job_title AS job title, 
-- employee.department AS department, employee.salary AS salary, 
-- employee.manager AS manager
-- FROM Employee
-- LEFT JOIN Role
-- ON employee.role_id = position.title;