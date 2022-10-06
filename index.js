const flash = require("express-flash");
const session = require("express-session");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const myWaiterRoutes = require("./routes/waiter");
const myWaiter = require("./waiterFact");
const ShortUniqueId = require("short-unique-id");

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

const uid = new ShortUniqueId({length: 7});
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
   res.render("index");
})

//registering
app.post("/register", async function(req, res){
  let usernames = req.body.OwnersName
  
  if(await waiters.waitersName(usernames) !== null){
    
    req.flash("error",'YOUR NAME IS ALREADY HAVE A CODE')
  }
  else if(usernames){
    const code = uid();
    await waiters.storedWaiterNames(usernames,code)
    req.flash("success","PLEASE SAVE YOUR CODE" + " " + " : " + " "+code)
    
  }
  
  res.redirect("registered")
})

//login page for waiters
app.post("/login", async function(req, res){
  let username = req.body.uname
  
  if(username){
    await waiters.storedWaiterNames(username)
  }
  await waiters.waitersName(username)
  res.render("waiter")
})

app.get("/waiter", async function(req, res){
  res.render("waiter")
})

//login page for owner
app.post("/registering", async function(req, res){
  res.redirect("registered")
})

app.get("/registered", async function(req, res){

  res.render("registered", {

  })
})

//waiters choose the days
app.post("/waiters",async function(req, res){
  let waitersInput = req.body.uname
  let weekly = req.body.accept
  
  await waiters.storedWaiterNames(waitersInput) 
  console.log(weekly)
  var inputs= await waiters.dataBaseName(waitersInput)
  
  res.render("days",{
    output:inputs.named
  })
  
})



app.get("/waiters",async function(req, res){
  let names = req.params.uname
 
console.log(names)

  res.render("days",{
  
   
  })
})



//

app.post("/waiters/:username",async function(req, res){


  res.redirect("/waiters")
})

app.post("/next",function(req, res){

  res.render('calender')
})







const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
  console.log("APP STARTED AT PORT", PORT);
});