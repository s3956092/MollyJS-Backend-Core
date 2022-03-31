req.get(()=>{
	if( process.env.MESSAGE_STYLE=='uppercase' )
		res.json( {"message": "HELLO WORLD"}) );
	else
		res.json( {"message": "Hello json"}) );
});