// Modules
const Express = require("express");
const expressFileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");

// DB Creds
let dbCredentials = JSON.parse(fs.readFileSync("database.json"));
let dbConnection = mysql.createConnection({
  host: dbCredentials.host,
  user: dbCredentials.username,
  password: dbCredentials.password,
  database: dbCredentials.database,
});

// Instances
let app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(expressFileUpload());
app.use("/assets", Express.static(`${__dirname}/assets`));

// Port
app.listen(4000, () => {
  dbConnection.connect((err) => {
    if (err) throw err;
    console.log("Connected to Database!");
  });
});

// Department routes
app.get("/api/department", (req, res) => {
  let getDepartmentQuery = `SELECT * FROM mytestdb.Department`;

  dbConnection.query(getDepartmentQuery, (err, rows) => {
    if (err) {
      res.send("Get Department Database Query Failed!");
    }
    res.send(rows);
  });
});

app.post("/api/department", (req, res) => {
  let insertDepartmentValues = [req.body["DepartmentName"]];

  let insertDepartmentQuery = `INSERT INTO mytestdb.Department (DepartmentName) VALUE (?)`;

  dbConnection.query(insertDepartmentQuery, insertDepartmentValues, (err) => {
    if (err) {
      res.send("Added Department Database Query Failed!");
    }
    res.json("Added Department Data Succesfully");
  });
});

app.put("/api/department", (req, res) => {
  let updateDepartmentValues = [
    req.body["DepartmentName"],
    req.body["DepartmentId"],
  ];

  let updateDepartmentQuery = `UPDATE mytestdb.Department SET DepartmentName=? WHERE DepartmentId=?`;

  dbConnection.query(updateDepartmentQuery, updateDepartmentValues, (err) => {
    if (err) {
      res.send("Updated Department Database Query Failed!");
    }
    res.json("Updated Department Data Succesfully");
  });
});

app.delete("/api/department/:id", (req, res) => {
  let deleteDepartmentValues = [parseInt(req.params.id)];

  let deleteDepartmentQuery = `DELETE FROM mytestdb.Department WHERE DepartmentId=?`;

  dbConnection.query(deleteDepartmentQuery, deleteDepartmentValues, (err) => {
    if (err) {
      res.send("Deleted Department Database Query Failed!");
    }
    res.json("Deleted Department Data Succesfully");
  });
});

// Employee routes
app.get("/api/employee", (req, res) => {
  let getEmployeeQuery = `SELECT * FROM mytestdb.Employee`;

  dbConnection.query(getEmployeeQuery, (err, rows) => {
    if (err) {
      res.send("Get Employee Database Query Failed!");
    }
    res.send(rows);
  });
});

app.post("/api/employee", (req, res) => {
  let insertEmployeeValues = [
    req.body["EmployeeName"],
    req.body["Department"],
    req.body["DateOfJoining"],
    req.body["PhotoFileName"],
  ];

  let insertEmployeeQuery = `INSERT INTO mytestdb.Employee (EmployeeName, Department, DateOfJoining, PhotoFileName) VALUE (?, ?, ?, ?)`;

  dbConnection.query(insertEmployeeQuery, insertEmployeeValues, (err) => {
    if (err) {
      res.send("Added Employee Database Query Failed!");
    }
    res.json("Added Employee Data Succesfully");
  });
});

app.put("/api/employee", (req, res) => {
  let updateEmployeeValues = [
    req.body["EmployeeName"],
    req.body["Department"],
    req.body["DateOfJoining"],
    req.body["PhotoFileName"],
    req.body["EmployeeId"],
  ];

  let updateEmployeeQuery = `UPDATE mytestdb.Employee SET EmployeeName=?, Department=?, DateOfJoining=?, PhotoFileName=? WHERE EmployeeId=?`;

  dbConnection.query(updateEmployeeQuery, updateEmployeeValues, (err) => {
    if (err) {
      res.send("Updated Employee Database Query Failed!");
    }
    res.json("Updated Employee Data Succesfully");
  });
});

app.delete("/api/employee/:id", (req, res) => {
  let deleteEmployeeValues = [parseInt(req.params.id)];

  let deleteEmployeeQuery = `DELETE FROM mytestdb.Employee WHERE EmployeeId=?`;

  dbConnection.query(deleteEmployeeQuery, deleteEmployeeValues, (err) => {
    if (err) {
      res.send("Deleted Employee Database Query Failed!");
    }
    res.json("Deleted Employee Data Succesfully");
  });
});

// Upload image file route
app.post("/api/employee/savefile", (req, res) => {
  fs.writeFile(
    "./assets/" + req.files.file.name,
    req.files.file.data,
    (err) => {
      if (err) {
        return console.log(err);
      }
      res.json(req.files.file.name);
    }
  );
});
