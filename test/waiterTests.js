const assert = require("assert");
const myWaiter = require("../waiterFact");
const pgp = require("pg-promise")();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:pg123@localhost:5432/waiter_app_test";

const config = {
  connectionString: DATABASE_URL,
};

const db = pgp(config);

describe("WAITERS TESTS", async function () {
   
    this.beforeEach(async function () {
        await db.none('DELETE FROM names');
    });


    it("should return the waiters name that are logged in", async function () {
        const waiters = myWaiter(db);
         await waiters.storedWaiterNames("Zintle");
        
        assert.deepEqual([ {"named": "Zintle"}], await waiters.waitersName());
      });

      it("should return the waiters name that are logged in", async function () {
        const waiters = myWaiter(db);
         await waiters.storedWaiterNames("Zintle");
         await waiters.storedWaiterNames("Zethu");
        
        assert.deepEqual([ {"named": "Zintle"},{"named": "Zethu"}], await waiters.waitersName());
      });

      it("should return the waiters name that are logged in", async function () {
        const waiters = myWaiter(db);
         await waiters.storedWaiterNames("Zintle");
         await waiters.storedWaiterNames("Zethu");
         await waiters.storedWaiterNames("JP");
        
        assert.deepEqual([ {"named": "Zintle"},{"named": "Zethu"},{"named": "JP"}], await waiters.waitersName());
      });
    

    it("should reset all the names from the database", async function (){
   
        const waiters = myWaiter(db);
    
        await waiters.storedWaiterNames('Nkuli');
    
        assert.equal(null,await waiters.rested());
    
      })
    
      after(function(){
        db.$pool.end
      })
     });

 