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

app.post("/register", regWaiters.register)

app.post("/login",regWaiters.login)

app.post("/admin", regWaiters.admin)


app.get("/waiter",regWaiters.showLogin)


app.get("/admin",regWaiters.showAdmin) 

app.get("/registered", regWaiters.showRegister)


app.get("/waiters/:username",regWaiters.waitersDay)


app.post("/waiters/:uname",regWaiters.days)


app.get("/calender",regWaiters.showDays)


app.get("/monthly",regWaiters.monthly)

app.get("/logout",regWaiters.logout) 

app.get('/resets',regWaiters.resets)


const PORT = process.env.PORT || 3008;
app.listen(PORT, function () {
  console.log("APP STARTED AT PORT", PORT);
});