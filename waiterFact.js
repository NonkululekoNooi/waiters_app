module.exports = function waiters(db) {

  async function waitersName(names) {
    let waiterNames = await db.oneOrNone("SELECT named FROM names where named=$1",
    [names]);
    return waiterNames;
  }

  async function storedWaiterNames(naming,codes) {
    let checkedName = await waitersName(naming);

    if (checkedName == null) {
      await db.none("INSERT INTO names(named,code) values($1,$2)", 
      [naming,codes]);
     
    }
  }

  async function dataBaseName(loggedName) {
    var naming = await db.one("SELECT named FROM names WHERE named=$1", [
      loggedName,
    ]);
    return naming;
  }

  async function storedWeekdays(weeks, title) {
    
    let daysOfWeeks = Array.isArray(weeks) === false ? [weeks] : weeks
   for(var i = 0; i < daysOfWeeks.length ; i++) {
    const day = daysOfWeeks[i];
    const username = title

    let weekday =  await db.one('SELECT id FROM week_days where days_of_week= $1',[
        day
      ]);
      
      let waiter = await db.one("SELECT id FROM names where named =$1", [
        username
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

  async function reseted() {
    return await db.none("TRUNCATE waiter_days");
  }

  

  return {
    waitersName,
    storedWaiterNames,
    dataBaseName,
    storedWeekdays,
    joiningTables,
    reseted
    
  
   
  };
};
