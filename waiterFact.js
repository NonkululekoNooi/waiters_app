module.exports = function waiters(db) {

  async function waitersName(names) {
    let waiterNames = await db.oneOrNone("SELECT named FROM names where named=$1",
    [names]);
    
    return waiterNames;
  }

  async function WaitersCode(coding){
    let waiterCode = await db.oneOrNone("SELECT * FROM names where Code = $1",
    [coding]);
    
    return waiterCode;
  }

  async function storedWaiterNames(naming,codes) {
   

      let checkedName = await waitersName(naming);

      if (checkedName == null) {
        await db.none("INSERT INTO names(named,code) values($1,$2)", 
        [naming,codes]);
       
      }
    
  }



  async function storedWeekdays(weeks, title) {
    
    let daysOfWeeks = Array.isArray(weeks) === false ? [weeks] : weeks
    const username = title
    let waiter = await db.one("SELECT id FROM names where named =$1", [
      username
    ]);

    
    await db.none('DELETE FROM waiter_days WHERE waiter_names_id=$1', [waiter.id])
   for(var i = 0; i < daysOfWeeks.length ; i++) {
    const day = daysOfWeeks[i];

    

    let weekday =  await db.one('SELECT id FROM week_days where days_of_week= $1',[
      day
    ]);
    
    
    
    await db.none("INSERT INTO waiter_days(days_id, waiter_names_id) values($1, $2)",
        [weekday.id, waiter.id]
      );
    }
  }


  async function joiningTables(dailyWeeks){
    let joined = await db.manyOrNone(`SELECT names.named, week_days.days_of_week FROM waiter_days 
      INNER JOIN names ON waiter_days.waiter_names_id = names.id 
      INNER JOIN week_days ON waiter_days.days_id = week_days.id where days_of_week =$1;`, 
    [dailyWeeks])
    
    return joined
  }

async function checkDays(waiter){
 let userCheck = await db.manyOrNone(`SELECT week_days.days_of_week FROM waiter_days
 JOIN week_days ON waiter_days.days_id = week_days.id where waiter_names_id =$1;`, 
 [waiter])
  userCheck = userCheck.map(obj => obj.days_of_week )

  let weekdays = await db.manyOrNone(`SELECT * FROM week_days`)
  weekdays = weekdays.map(obj => obj.days_of_week)

  let current =[]

  for(var i= 0; i< weekdays.length;i++){
    current.push(userCheck.includes(weekdays[i]))
  }

  return current
}

async function dataBaseName(loggedName) {
  var naming = await db.one("SELECT * FROM names WHERE named=$1", [
    loggedName,
  ]);
  return naming;
}



async function getColors(){

let weekdays = await db.manyOrNone(`SELECT * FROM week_days`)

for(let day of weekdays) {

  let countingDays = await db.manyOrNone(`SELECT count(*) FROM waiter_days where days_id =$1 `,[day.id])
  let counting = countingDays[0].count

  if(counting > 3){
    day.color = "danger"
  }else if(counting == 3){
    day.color = "green"
  }else if(counting <3){
    day.color ="warning"
  }

}

return weekdays;

}

  async function reseted() {
    return await db.none("TRUNCATE waiter_days");
  }

  

  return {
    waitersName,
    storedWaiterNames,
    dataBaseName,
    storedWeekdays,
    joiningTables,
    reseted,
    checkDays,
    WaitersCode,
    getColors,
    
  
   
  };
};
