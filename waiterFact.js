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
      console.log(codes)
    }
  }

  async function dataBaseName(loggedName) {
    var naming = await db.one("SELECT named FROM names WHERE named=$1", [
      loggedName,
    ]);
    return naming;
  }

  //weekdays

  async function storedWeekdays(weeks, title) {

    let daysOfWeeks =Array.isArray(weeks) === false ? [weeks] : weeks
   for(var i = 0; i < daysOfWeeks.length ; i++) {
    const day = daysOfWeeks[i];
    const username = title

    let weekday =  await db.one('SELECT id FROM week_days where days_of_week= $1',[
        day
      ]);
      // let days_id = weekday.id

      let waiter = await db.one("SELECT id FROM names where named =$1", [
        username
      ]);
      // let waiter_names_id = waiter.id;

      await db.none("INSERT INTO waiter_days(days_id, waiter_names_id) values($1, $2)",
        [weekday.id, waiter.id]
      );
    }
  }


  async function rested() {
    return await db.none("DELETE FROM names");
  }
  return {
    waitersName,
    storedWaiterNames,
    storedWeekdays,
    rested,
    dataBaseName,
  };
};
