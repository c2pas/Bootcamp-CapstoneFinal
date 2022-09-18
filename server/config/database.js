import pg from "pg"

function connectDatabase(){
	const  pool = new  pg.Pool ({
		user : 'postgres',
		password : '12345',
		database : 'CcOnlineCloset',
		host :  'localhost'
	})
    return  pool
}
export { connectDatabase }