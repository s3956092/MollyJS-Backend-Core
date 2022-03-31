req.post(()=>{
	
	req.form( (data)=>{		
		req.downloadFile( data.fields.link,`${mollyJS.front}/img/image1.png` );
		res.redirect('/downloadFile');
	});
	
});