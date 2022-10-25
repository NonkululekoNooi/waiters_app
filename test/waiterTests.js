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
        await db.none('TRUNCATE names,  waiter_days');
    });

      it("should be able to add the name in the database ", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Sapho','5FVuF0t')
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
       
        assert.deepEqual({ named: 'Sapho'}, await waiters.waitersName("Sapho"));
        assert.deepEqual({ named: 'Lesedi'}, await waiters.waitersName("Lesedi"));
      })

      it("should be able to add the code in the database", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Sapho','5FVuF0t')
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
       
        assert.deepEqual( {"code": "5FVuF0t"}, await waiters.WaitersCode('5FVuF0t'));
        assert.deepEqual({ code: '3nl0v5F'}, await waiters.WaitersCode('3nl0v5F'));
      })


      it("days that are stored in the database", async function () {
        const waiters = myWaiter(db);
        let output = await waiters.WaitersWeek('Sunday');

        assert.deepEqual(1, output.length);
     
      })

    

      it("should be able to return how many waiters are working for a day", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Tshepiso','VAqmFF3')
        await waiters.storedWeekdays(['Friday'],'Lesedi')
        await waiters.storedWeekdays(['Friday'],'Tshepiso')
        


        let weekdays = await waiters.joiningTables('Friday')
      
        assert.equal(2, weekdays.length);
       
     
      })

      it("should return green if waiters are 3 for day", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Tshepiso','VAqmFF3')
        await waiters.storedWaiterNames('Sapho','5FVuF0t')
        await waiters.storedWeekdays(['Friday'],'Lesedi')
        await waiters.storedWeekdays(['Friday'],'Tshepiso')
        await waiters.storedWeekdays(['Friday'],'Tshepiso')

        let weekdays = await waiters.getColors()
    
        assert.equal([{ color: 'warning', days_of_week: 'Sunday',id: 1},
          {color: 'warning',days_of_week: 'Monday',id: 2},
          {
            color: 'warning',
            days_of_week: 'Tuesday',
            id: 3
          },
          {
            color: 'warning',
            days_of_week: 'Wednesday',
            id: 4
          },
          {
            color: 'warning',
            days_of_week: 'Thursday',
            id: 5
          },
          {
            color: 'warning',
            days_of_week: 'Friday',
            id: 6
          },
          {
            color: 'warning',
            days_of_week: 'Saturday',
            id: 7
          }
        ], weekdays);
    })
  

         it("should clear waiters schedule for the week ", async function () {
          const waiters = myWaiter(db);
       await waiters.waitersName("Tsepiso")  
      
        assert.equal(null,await waiters.reseted())  
      })
    
  

      after(function(){
        db.$pool.end()
      })
     });

 