$ = (...args)=>{ return document.querySelector(args) }

window.addEventListener( 'load',()=>{
	
	fetch( 'myname?name=enmanuel',{ method:'POST', body:'hola mundo mira mi pagina web: https://www.xshorts.ml' } )
	.then( async(response)=>{
		$('h1').innerHTML += await response.text();
	})
	.catch( e=>console.log(e) )
	
})