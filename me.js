const addWorkDay = async (waiter, days) => {
    let waiter_id = await db.one('SELECT id FROM waiters WHERE username=$1 LIMIT 1', [waiter])
    waiter_id = waiter_id.id

    // delete the old working days from the user and accept the incoming one as update
    await db.none('DELETE FROM workingdays WHERE waiter_id = $1', [waiter_id])

    if(typeof days === "object"){
        for(let day of days){
            await db.none('INSERT INTO workingdays (waiter_id, workingday) VALUES($1, $2)', [waiter_id, day])
        }
    } else if(typeof days === "string"){
        await db.none('INSERT INTO workingdays (waiter_id, workingday) VALUES($1, $2)', [waiter_id, days])
    }
}