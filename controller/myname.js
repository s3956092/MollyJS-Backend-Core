
req.get( ()=>{
	res.send( 200,`,and this is my name is ${req.query.name} using GET`  );
});

req.post( ()=>{
	let chunk = ''
	
	req.on('data',(data)=>{
		chunk+=data;
	})
	
	req.on('end',()=>{
		console.log( chunk )
		res.send( 200,`,and this is my name is ${req.query.name} using POST`  );
	})

});

req.delete( ()=>{
	res.send( 200,`,and this is my name is ${req.query.name} using DELETE`  );
});

req.put( ()=>{
	res.send( 200,`,and this is my name is ${req.query.name} using PUT`  );
});
