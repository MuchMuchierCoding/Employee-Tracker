INSERT INTO department (department_name)
VALUES ("IT"),
       ("Customer Relations"),
       ("Human Resources"),
       ("Adminstration");

INSERT INTO position (title,department_id,salary)
VALUES ("Intern", 1, 30000),
       ("Customer Service Rep", 2, 35000),
       ("Tech Support", 1, 40000),
       ("Account Manager", 4, 55000),
       ("HR Rep", 3, 45000),
       ("Systems Adminstrator", 1, 80000),
       ("Human Resources Manager", 3, 75000),
       ("Retention Manager", 4, 85000),
       ("Shift Lead", 4, 30000);



INSERT INTO employee (first_name, last_name, position_id, manager_id)
VALUES ("Kim","Hepworth", 1, 9),
       ("Sarah", "Nybo", 1, 9),
       ("Zach", "Brown", 3, 6), 
       ("Gerry", "Rice", 2, 4),
       ("Deloras", "Umbra", 5, 7),
       ("Sherry", "Bishop", 6, NULL),
       ("Ronald", "Wesland", 9, NULL), 
       ("Kenny", "Fatkin", 8, NULL), 
       ("Steve", "Huebner", 4, 8),
       ("Kelly", "Skillwack", 7, NULL);

