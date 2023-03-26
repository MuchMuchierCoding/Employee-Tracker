const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const db = require("./db/connection.js")
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const init = () => {
  inquirer.prompt([{
    type: "list",
    name: "choices",
    message: "What employee information would you like to select?",
    choices: ['View all Departments', 'View all Positions', 'View all Employees', "Add a Department", "Add a Position", "Add an Employee", "Update an Employee Position", "Quit"],

  }])
    .then((response) => {
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
  const sql = `Select * FROM Department`
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
}

//---View all Position---
const viewAllPositions = () => {
  const sql = `SELECT * FROM position`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
}

//---View all Employees---
const viewAllEmployees = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  })
}

//---Add a Department---
const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the Department name?'
    }
  ])
    .then((data => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
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
    console.log(res)
    for (let i = 0; i < res.length; i++) {
      deptChoices.push(res[i].department_name)
    }}
    )
  inquirer.prompt([
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
      name: 'department_id',
      message: 'What department is the position in?',
      choices: [1]
    },
  ])
    .then((data) => {
      //const sql1 = `SELECT id FROM department WHERE department_name = ?,${data.department}`
      const sql = `INSERT INTO position SET ?`;
      const params = [data.title, data.salary, data.department];

      db.query(sql, data, (err) => {
        if (err) throw err;
        // res.json({
        //   message: "success",
        //   data: res
        // })
      })
      console.log(`Added ${data.department}`);
      init();
    })
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
    console.log(positionChoices)
    var managerChoices = [];
    const sql1 = `SELECT concat(first_name, '', last_name) AS managers FROM employee`;
    db.query(sql1, (err, res) => {
      if (err) throw err;
      console.log(res)
      for (let i = 0; i < res.length; i++) {
        managerChoices.push(res[i].managers)
      }
      console.log(managerChoices)
      inquirer.prompt([
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
          message: "what is the employee's position?",
          choices: positionChoices
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: managerChoices
        },
      ])
        .then((data) => {
          const sql2 = `SELECT position.id FROM position WHERE title = '${data.position}';`
          db.query(sql2, (err, res) => {
            if (err) throw err;
            var positionId = res[0].position_id;
            const sql4 = `SELECT employee.id FROM employee WHERE concat(first_name, last_name) = "${data.manager}";`
            db.query(sql4, (err, res) => {
              if (err) throw err;
              var managerId = res[0].manager_id;
              const sql3 = `INSERT INTO employee (first_name, last_name, position_id, manager_id) VALUES (?, ?, ?, ?)`;
              const params3 = [data.first_name, data.last_name, positionId, managerId]

              db.query(sql3, params3, (err, res) => {
                if (err) throw err;
              })
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
  const sql = `SELECT concat(first_name, '', last_name) AS employees FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      employeeChoices.push(res[i].employees)
    }
    let positionChoices = [];
    const sql1 = `SELECT * FROM position`;
    db.query(sql1, (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        positionChoices.push(res[i].title)
      }
      inquirer.prompt([
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
          const sql2 = `SELECT position.id FROM position WHERE title = '${data.position}'`;
          db.query(sql2, (err, res) => {
            if (err) throw err;
            console.log(res)
            var positionId = res[0].id;
            const sql4 = `SELECT employee.id FROM employee WHERE concat(first_name, last_name) = '${data.employee}'`
            db.query(sql4, (err, res) => {
              if (err) throw err;
              var employeeId = res[0].id;
              const sql3 = `UPDATE employee SET position_id = ${positionId} WHERE id = ${employeeId}`;
              db.query(sql3, (err, res) => {
                if (err) throw err;
              })
            });
          })
          console.log("Successfully updated employee's position");
          init();
        });
    });
  });
};

init();


