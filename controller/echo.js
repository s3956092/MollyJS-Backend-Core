
req.get( ()=>{
	res.send( 200, req.parse.params.join(' ') );
});

req.post( ()=>{
	res.json( 200, req.query );
});

res.send404();