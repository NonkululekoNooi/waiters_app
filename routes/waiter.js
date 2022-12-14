module.exports = function myGreetedRoutes(waiters){
  
    const ShortUniqueId = require("short-unique-id");
    const uid = new ShortUniqueId({length: 7});


    async function home(req, res){
        res.render("index",{
         passCode: req.session.passCode
        });
    }

    async function register(req, res){
        let usernames = req.body.OwnersName.charAt(0).toUpperCase() + req.body.OwnersName.slice(1).toLowerCase();
        let letters = /^[a-z A-Z]+$/;
        let results = await waiters.waitersName(usernames) !== null
        
        if(results){
          req.flash("error",`${usernames}, YOUR NAME IS ALREADY HAVE A CODE `)
        }
        else if(letters.test(usernames) == false ) {
          req.flash('error', `PLEASE USE ALPHABETS ONLY`)
        }else   {
          const code = uid();
          await waiters.storedWaiterNames(usernames,code)
        
          await waiters.adminName(usernames)
          req.flash("output","PLEASE SAVE YOUR CODE" + " " + " : " + " "+code)
          
        }
       
      
        res.redirect("registered")
      }
  
      async function login(req, res){
        let username = req.body.uname.charAt(0).toUpperCase() + req.body.uname.slice(1).toLowerCase();
        const coded = req.body.psw
        let letters = /^[a-z A-Z]+$/;
        let check = await waiters.waitersName(username)
        let passCode = await waiters.WaitersCode(coded)
      
        
        if(letters.test(username) == false){
         req.flash('error', 'PLEASE CHECK YOUR NAME AND YOUR CODE')
         res.redirect("/waiter")
       }
      else if(username ==check,passCode) {
        req.session.passCode =passCode
          res.redirect("/waiters/"+username)
        }
      
      }

      async function admin(req, res){
        let username = req.body.uname.charAt(0).toUpperCase() + req.body.uname.slice(1).toLowerCase();
        const coded = req.body.psw
      
      

        let check = await waiters.adminName(coded) // return true if admin else return false if is not admin

        if(check){
          res.redirect("/monthly")
        }
        else {
          req.flash('error', 'PLEASE CHECK YOUR NAME AND YOUR CODE')
          res.redirect("back")
        
        }
        
    }

    async function showLogin(req, res){
        res.render("waiter")
      }

      async function showAdmin(req, res){
        res.render("admin")
      }

      async function showRegister(req, res){
        res.render("registered")
      }

      async function waitersDay(req, res){
        let waitersInput = req.params.username;
        
        let names = await waiters.dataBaseName(waitersInput) 
       
        let checked = await waiters.checkDays(names.id)
        
        res.render("days",{ 
          output:waitersInput,
          checked:checked
        })
    }

    async function days(req, res){
      let waitersInput = req.params.uname
     
      let weekly = req.body.accept;
        let names = await waiters.dataBaseName(waitersInput) 
      
     
      
     if(!weekly){
      req.flash('error','PLEASE CHOOSE YOUR DAYS')
     } else if(weekly && waitersInput){
    
    
        await waiters.storedWeekdays(weekly, waitersInput);
        req.flash('success','YOUR DAYS HAS BEEN ADDED')
      }
    
      res.redirect("/waiters/"+waitersInput)
      
    }

    async function showDays(req, res){
  
        res.render("calender")
      }
    async function monthly(req, res){
        let weeks = req.body.accept;  
        
        let Sunday = await waiters.joiningTables('Sunday')
        let Monday = await waiters.joiningTables('Monday')
        let Tuesday = await waiters.joiningTables('Tuesday')
        let Wednesday = await waiters.joiningTables('Wednesday')
        let Thursday = await waiters.joiningTables('Thursday')
        let Friday = await waiters.joiningTables('Friday')
        let Saturday = await waiters.joiningTables('Friday')
        
        let robots = await waiters.getColors()
       
        res.render('calender',{
          Sunday,
          Monday,
          Tuesday,
          Wednesday,
          Thursday,
          Friday,
          Saturday,
          robots
        })
      
      }

    async function logout(req, res){

        delete req.session.passCode
        req.flash("success",'ENJOY YOUR DAY ????????????')
        res.render("waiter")
      }

        async function resets (req, res) {

            await waiters.reseted();      
            req.flash("success","SCHEDULE HAS BEEN CLEARED");
            res.render("calender");
          
          }

        
      return{
      home,
      register,
      login,
      admin,
      showLogin,
      showAdmin,
      showRegister,
      waitersDay,
      resets,
      logout,
      monthly,
      showDays,
      days,
    

        
  
      }
    }