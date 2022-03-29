
req.get( ()=>{
	res.writeHead( 200, {'Content-Type':'text/html'} );
	res.end( `,and this is my name is ${req.query.name} using GET` );
});

req.post( ()=>{
	let chunk = ''
	
	req.on('data',(data)=>{
		chunk+=data;
	})
	
	req.on('end',()=>{
		console.log( chunk )
		res.writeHead( 200, {'Content-Type':'text/html'} );
		res.end( `,and this is my name is ${req.query.name} using POST` );	
	})

});

req.delete( ()=>{
	res.writeHead( 200, {'Content-Type':'text/html'} );
	res.end( `,and this is my name is ${req.query.name} using DELETE` );
});

req.put( ()=>{
	res.writeHead( 200, {'Content-Type':'text/html'} );
	res.end( `,and this is my name is ${req.query.name} using PUT` );
});
