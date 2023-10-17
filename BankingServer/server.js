const express = require('express')
const { json } = require('body-parser');
const app = express();

app.use(express.json());

const sqlite = require('sqlite3').verbose()

const db = new sqlite.Database('./test.db',sqlite.OPEN_READWRITE,(err)=>{
    if (err) return console.error(err.message)
    else console.log("Database Connected")
})

const getCutomerQuery =   `SELECT * FROM CUSTOMER`;
const insertCustomerQuery = `INSERT INTO CUSTOMER(Customer_Name,PhoneNumber,Address,Email) VALUES(?,?,?,?);`
let sql;
sql = `CREATE TABLE IF NOT EXISTS CUSTOMER( cid int primary key ,Customer_Name VARCHAR(30),PhoneNumber varchar(30),Address varchar(40),Email varchar(30));`
db.run(sql,(err)=>{
    if(err) throw err
    else{ console.log("Created Table Customer")}
})

app.post('/api/login',(req,res)=>{
    const {email,password} = req.body;
    sql = `SELECT email,password from CUSTOMERS WHERE email = ? and password = ?`;
    db.run(sql,[email,password],(err,result)=>{
        if (err) throw err
        else{
            res.send(result)
        }
    })
})


app.get('/api/customers',(req,res)=>{
    db.all(getCutomerQuery,[],(err,rows)=>{
        if(err) console.error(err.message)
        else res.send(rows)
    })
})

app.post('/api/test',(req,res)=>{
    console.log(req.body)
})
app.post('/api/customers', (req, res) => {
    console.log(req.body)
    let cid;
    const name = req.body.name;
    const number = req.body.number;
    const address = req.body.address;
    const email = req.body.email;

    // Check for missing or invalid data
    if (!name || !number || !address || !email) {
        return res.status(400).json({ error: "Missing or invalid data" });
    }

    db.run(insertCustomerQuery, [name, number, address, email], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.send("Inserted Successfully");
    });
});



const port = 8000;

app.listen(port,()=>{
    console.log("Server running at port ",port);
})