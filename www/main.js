$ = (...args)=>{ return document.querySelector(args) }

window.addEventListener( 'load',()=>{
	
	fetch( 'myname?name=enmanuel',{method:'POST',body:'check out my github'} )
	.then( async(response)=>{
		$('h1').innerHTML += await response.text();
	}).catch( e=>console.log(e) )
	
})