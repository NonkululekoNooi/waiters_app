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

      it("should be able to check the name in the database when login", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Sapho','5FVuF0t')
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        
       
        assert.deepEqual({ named: 'Sapho'}, await waiters.waitersName("Sapho"));
        assert.deepEqual({ named: 'Lesedi'}, await waiters.waitersName("Lesedi"));
      })

      it("should be able to get the code  when registering", async function () {
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

    

      it("should be able to return how many waiters are working for a Friday", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Tshepiso','VAqmFF3')
        await waiters.storedWeekdays(['Friday'],'Lesedi')
        await waiters.storedWeekdays(['Friday'],'Tshepiso')
        


        let weekdays = await waiters.joiningTables('Friday')
      
        assert.equal(2, weekdays.length);
       
     
      })
      it("should be able to return how many waiters are working for a Monday", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Tshepiso','VAqmFF3')
        await waiters.storedWaiterNames('Lukhanyo',' qWd4po0')
       
        await waiters.storedWeekdays(['Monday'],'Lesedi')
        await waiters.storedWeekdays(['Monday'],'Tshepiso')
        await waiters.storedWeekdays(['Monday'],'Lukhanyo')
        


        let weekdays = await waiters.joiningTables('Monday')
      
        assert.equal(3, weekdays.length);
       
     
      })

      it("should be able to return how many waiters are working for a Tuesday", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Lukhanyo',' qWd4po0')
        await waiters.storedWaiterNames('Phumza','hqB80bm')
        await waiters.storedWaiterNames('Kamva','ZdZS5PH')
       
        
        await waiters.storedWeekdays(['Tuesday'],'Lesedi')
        await waiters.storedWeekdays(['Tuesday'],'Lukhanyo')
        await waiters.storedWeekdays(['Tuesday'],'Phumza')
        await waiters.storedWeekdays(['Tuesday'],'Kamva')


        let weekdays = await waiters.joiningTables('Tuesday')
      
        assert.equal(4, weekdays.length);
       
     
      })

      it("should return red/danger if waiters are more than 3 in one day", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Lukhanyo',' qWd4po0')
        await waiters.storedWaiterNames('Phumza','hqB80bm')
        await waiters.storedWaiterNames('Kamva','ZdZS5PH')

        await waiters.storedWeekdays(['Friday'],'Lesedi')
        await waiters.storedWeekdays(['Friday'],'Lukhanyo')
        await waiters.storedWeekdays(['Friday'],'Phumza')
        await waiters.storedWeekdays(['Friday'],'Kamva')
       
        let colors = await waiters.getColors()
        let friday = colors.find(day => {
          if(day.id == 6){
            return day
          }
        })
       
        assert.equal( 'danger',friday.color);
       
     
      })


      it("should return orange/warning if waiters are less than 3 in one day", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Phumza','hqB80bm')
        await waiters.storedWaiterNames('Kamva','ZdZS5PH')
       

        await waiters.storedWeekdays(['Saturday'],'Lesedi')
        await waiters.storedWeekdays(['Saturday'],'Phumza')
        await waiters.storedWeekdays(['Saturday'],'Kamva')
     
       
        let colors = await waiters.getColors()
        let saturdays = colors.find(day => {
          if(day.id == 7){
            return day
          }
        })
        assert.equal( 'green',saturdays.color);
       
      })

      it("should return green/good if waiters are equal to 3 in one day", async function () {
        const waiters = myWaiter(db);
        await waiters.storedWaiterNames('Lesedi','3nl0v5F')
        await waiters.storedWaiterNames('Lukhanyo',' qWd4po0')
       

        await waiters.storedWeekdays(['Monday'],'Lesedi')
        await waiters.storedWeekdays(['Monday'],'Lukhanyo')
     
       
        let colors = await waiters.getColors()
        let monday = colors.find(day => {
          if(day.id == 1){
            return day
          }
        })
        assert.equal( 'warning',monday.color);
       
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

 