INSERT INTO department (department_name)
VALUES ("IT"),
       ("Customer Relations"),
       ("Human Resources"),
       ("Adminstration");

INSERT INTO position (title,salary,department_id)
VALUES ("Intern", 30000, 1),
       ("Customer Service Rep", 35000, 2),
       ("Tech Support", 40000, 1),
       ("Account Manager", 55000, 4),
       ("HR Rep", 45000, 3),
       ("Systems Adminstrator", 80000, 1),
       ("Human Resources Manager", 75000, 3),
       ("Retention Manager", 85000, 4),
       ("Shift Lead", 30000, 4);



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

