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
  const code = uid();
  

  let check = await waiters.waitersName(username)

 
  if(check){
    res.redirect("/waiters/"+username)
  }
   else {
    req.flash('error', 'PLEASE REGISTER YOUR NAME')
    res.redirect("/waiter")
  }

})

// show login form
app.get("/waiter", async function(req, res){
  res.render("waiter")
})

// show register form
app.get("/registered", async function(req, res){
  res.render("registered")
})

//waiters choose the days
app.get("/waiters/:username",async function(req, res){
  let waitersInput = req.params.username;
  
  res.render("days",{ 
    output:waitersInput
  })
})


app.post("/waiters/:uname",async function(req, res){
  let waitersInput = req.params.uname
 
  let weekly = req.body.accept;
  
 if(!weekly){
  req.flash('error','PLEASE CHOOSE YOUR DAYS')
 } else if(weekly && waitersInput){

    await waiters.storedWeekdays(weekly, waitersInput);
    req.flash('success','YOUR DAYS HAS BEEN ADDED')
  }
  res.redirect("/waiters/"+waitersInput)
  
})

//getting the days that has been added

app.get("/monthly",async function(req, res){
  let weeks = req.body.accept;  

  let Sunday = await waiters.joiningTables('Sunday')
 let Monday = await waiters.joiningTables('Monday')
 let Tuesday = await waiters.joiningTables('Tuesday')
 let Wednesday = await waiters.joiningTables('Wednesday')
 let Thursday = await waiters.joiningTables('Thursday')
 let Friday = await waiters.joiningTables('Friday')
 let Saturday = await waiters.joiningTables('Friday')
  res.render('calender',{
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
  })

})

app.get('/resets',async function (req, res) {

  await waiters.reseted();      
  req.flash("error","YOU RESETED EVERYTHING");
  res.render("calender");

})


const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
  console.log("APP STARTED AT PORT", PORT);
});