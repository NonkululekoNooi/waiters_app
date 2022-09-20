module.exports = function waiters(db){


    async function waitersName() {
        let waiterName = await db.manyOrNone("SELECT named FROM names");
        return waiterName;
      }


      async function storedWaiterNames(name) {
       
        let checkedName = await db.oneOrNone(
          "SELECT named FROM names where named =$1",
          [name]
        );
    
        if (checkedName == null) {
          await db.none(
            "INSERT INTO names(named) values($1)",
            [name]
          );
        } 
      }

      async function rested() {
        return await db.none("DELETE FROM names");
      }
    return{
        waitersName,
        storedWaiterNames,
        rested
    }
}