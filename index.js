const flash = require("express-flash");
const session = require("express-session");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const myWaiterRoutes = require("./routes/waiter");
const myWaiter = require("./waiterFact");


const pgp = require("pg-promise")();
const app = express();

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:pg123@localhost:5432/waiters_app";

const config = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = pgp(config);

const waiters = myWaiter(db);
const regWaiters = myWaiterRoutes(waiters)




app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "using session http",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", regWaiters.home)
//registering
app.post("/register", regWaiters.register)
//login page for waiters
app.post("/login",regWaiters.login)
//login as the administrator
app.post("/admin", regWaiters.admin)

// show login form
app.get("/waiter",regWaiters.showLogin)

//show login form for admin
app.get("/admin",regWaiters.showAdmin) 
// show register form
app.get("/registered", regWaiters.showRegister)

//waiters choose the days
app.get("/waiters/:username",regWaiters.waitersDay)


app.post("/waiters/:uname",async function(req, res){
  let waitersInput = req.params.uname
 
  let weekly = req.body.accept;
    let names = await waiters.dataBaseName(waitersInput) 
  // console.log(names)
 
  
 if(!weekly){
  req.flash('error','PLEASE CHOOSE YOUR DAYS')
 } else if(weekly && waitersInput){

    await waiters.storedWeekdays(weekly, waitersInput);
    req.flash('success','YOUR DAYS HAS BEEN ADDED')
  }
  res.redirect("/waiters/"+waitersInput)
  
})
//getting the days that has been added

app.get("/calender",regWaiters.showDays)
//showing the days of the waiters to the admin

app.get("/monthly",regWaiters.monthly)

// logOut
app.get("/logout",regWaiters.logout) 

app.get('/resets',regWaiters.resets)


const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
  console.log("APP STARTED AT PORT", PORT);
});