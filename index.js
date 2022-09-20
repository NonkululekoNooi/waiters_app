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

// const reged = myRegRoutes(regNo)

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

app.get("/", async function(req, res){
  var message = await waiters.waitersName();
        res.render("index", {
         message
        });
})

app.post("/owner", function(req, res){
  let ownerInput = req.body.OwnersName

  if(!ownerInput){
    req.flash("error", "Please type in your name");
  }

  res.render("owner")
})

app.post("/waiter", function(req, res){

  res.render("waiter")
})

app.get("/days", function(req, res){
  res.render("days")

})



const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
  console.log("APP STARTED AT PORT", PORT);
});