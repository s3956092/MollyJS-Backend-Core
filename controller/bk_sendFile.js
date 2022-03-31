req.post(()=>{
	
	req.form( (data)=>{
		req.saveFile( data.files.img, `${mollyJS.front}/img/image1.png` );
		res.redirect('/sendFile');
	});
	
});