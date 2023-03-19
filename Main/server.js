const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    DB_USER: 'root',
    // TODO: Add MySQL password here
    DB_PASSWORD: '',
    DB_NAME: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
); 

const init = () => {
  inquirer.prompt([{
    type: "list", 
    name: "choices",
    message: "What employee information would you like to select?",
    choices: ['View all Departments', 'View all Positions', 'View all Employees', "Add a Department", "Add a Position", "Add an Employee", "Update an Employee Position", "Quit"],

  }])
  .then ((response) => {
    switch (response.choices) {
      case "View all Departments": 
        viewAllDepartments();
        break;
      case "View all Positions": 
        viewAllPositions();
        break;
      case "View all Employees":
        viewAllEmployees();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "Add a Position":
        addPosition();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update an Employee Position":
        updatePosition();
        break;
    }
  })
};

//---View all Departments---
const viewAllDepartments = () => {
  const sql = `Select * FROM Department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
}

//---View all Position---
const viewAllPositions = () => {
  const sql = `SELECT position.id, position.title, department.name, position.salary FROM position JOIN department ON position.department_id = department.id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
}

//---View all Employees---
const viewAllEmployees = () => {
  const sql = `SELECT A.id, A.first_name, A.last_name, position.title, department.name AS department, position.salary, concat (B.first_name, '', B.last_name) AS manager FROM employee A JOIN position ON A.position_id = position.id JOIN department ON position.department_id = department.id LEFT JOIN employee B on A.manager_id = B.id;`;
  db.query(sql, (err, res) => {
    if (err) throw err; 
    console.table(res);
    init();
  })
}

//---Add a Department---
const addDepartment = () => {
  inquirer .prompt([
    {
      type: 'input',
      name: 'department', 
      message: 'What is the Department name?'
    }
  ])
  .then ((data => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = data.department;

    db.query(sql, params, (err, res) => {
      if (err) throw err; 
    })
    console.log(`Added ${data.department}`);
    init();
  }
    ))
}

//---Add a Position---
const addPosition = () => {
  var deptChoices = [];
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err; 
    for (let i = 0; i < res.length; i++) {
      deptChoices.push(res[i].name)
    }

    inquirer .prompt ([
      {
        type: 'input',
        name: 'title', 
        message: 'What is the position name?', 
      },
      {
        type: 'input', 
        name: 'salary',
        message: 'What is the position salary?',
      },
      {
        type: 'list', 
        name: 'department',
        message: 'What department is the position in?', 
        choices: deptChoices
      },
    ])
    .then ((data) => {
      const sql1 = `SELECT id FROM department WHERE name = '${data.department}'`

      db.query(sql1, (err, res) => {
        if (err) throw err; 
        var deptId = res[0].id;

        const sql = `INSERT INTO position (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [data.title, data.salary, deptId];

        db.query(sql, params, (err, res) => {
          if (err) throw err;
        })
      })
      console.log(`Added ${data.department}`);
      init();
    });
  });
};


//---Add an Employee---

const addEmployee = () => {
  var positionChoices = [];
  const sql = `SELECT * FROM position`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      positionChoices.push(res[i].title)
    }
    var managerChoices = [];
    const sql1 = `SELECT concat(first_name, '', last_name) AS managers FROM employee`;
    db.query(sql1, (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managerChoices.push(res[x].managers)
      }
      inquirer .prompt ([
        {
          type: 'input',
          name: 'first_name',
          message: "What is the employee's first name?"
        },
        {
          type: 'input',
          name: 'last_name',
          message: "What is the employee's last name?"
        },
        {
          type: 'list',
          name: 'position',
          message: "what is the employee's position?"?
          choices: positionChoices
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: managerChoices
        },
      ])
      .then ((data) => {
        const sql2 = `SELECT (SELECT position.id FROM position WHERE title = '${data.position}' AS position_id, (SELECT employee_id FROM employee WHERE concat(first_name, '', last_name) = '${data.manager}') AS manager_id;`
        db.query(sql2, (err, res) => {
          if (err) throw err;
          var positionId = res[0].position_id;
          var managerId = res[0].manager_id;

          const sql3 = `INSERT INTO employee (first_name, last_name, position_id, manager_id) VALUES (?, ?, ?, ?)`;
          const params3 = [data.first_name, data.last_name, positionId, managerId]

          db.query(sql3, params3, (err, res) => {
            if (err) throw err; 
          })
        })
        console.log(`Added ${data.first_name} ${data.last_name}`)
        init();
      });
    });
  });
};

//---Update Employee Position---

const updatePosition = () => {
  let employeeChoices = [];
  const sql = `SELECT concat{first_name, '', last_name) AS employees FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err; 
    for (let x = 0; x < res.length; x++) {
      employeeChoices.push(res[x].employees)
    }
    let positionChoices = [];
    const sql1 = `SELECT * FROM position`;
    db.query(sql1, (err, res) => {
      if (err) throw err; 
      for (let i = 0; i < res.length; i++) {
        positionChoices.push(res[i].title)
      }
      inquirer .prompt ([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee's position do you want to update?",
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'position',
          message: "What is the employee's new position?",
          choices: positionChoices
        },
      ])
      .then((data) => {
        const sql2 = `SELECT position.id FROM position WHERE title = '${data.position}') AS position_id, (SELECT employee.id FROM employee WHERE concat(first_name, '', last_name) = '${data.employee}') AS employee_id`;
        db.query(sql2, (err, res) => {
          if (err) throw err; 
          var positionId = res[0].position_id;
          var employeeId = res[0].employee_id;
          const sql3 = `UPDATE employee SET position_id = ${positionid} WHERE id = ${employeeId}`;
          db.query(sql3, (err,res) => {
            if (err) throw err;
          });
        })
        console.log("Successfully updated employee's position");
        init();
      });
    });
  });
};

init();


