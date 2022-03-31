'use strict';

//TODO: Libreries   XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //

const formidable = require('formidable');
const axios = require('axios');
const https = require('http2');
const http = require('http');
const url = require('url');
const fs = require('fs');

//TODO: String Normalization XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
const mimeType = {	
	
	//TODO: Font Mimetype //	
	"otf" : "font/otf",
	"ttf" : "font/ttf",
	"woff": "font/woff",
	"woff2":"font/woff2",
	
	//TODO: Audio Mimetype //
	"oga" : "audio/ogg",
	"aac" : "audio/aac",
	"wav" : "audio/wav",
	"mp3" : "audio/mpeg",
	"opus": "audio/opus",
	"weba": "audio/webm",
	
	//TODO: Video Mimetype //
	"ogv" : "video/ogg",
	"mp4" : "video/mp4",
	"ts"  : "video/mp2t",
	"webm": "video/webm",
	"mpeg": "video/mpeg",
	"avi" : "video/x-msvideo",
	
	//TODO: Web Text Mimetype //
	"css" : "text/css",
	"csv" : "text/csv",
	"html": "text/html",
	"ics" : "text/calendar",
	"js"  : "text/javascript",
	"xml" : "application/xhtml+xml",

	//TODO: Images Mimetype //
	"bmp" : "image/bmp",
	"gif" : "image/gif",
	"png" : "image/png",
	"jpg" : "image/jpeg",
	"jpeg": "image/jpeg",
	"webp": "image/webp",
	"svg" : "image/svg+xml",
	"ico" : "image/vnd.microsoft.icon",
	
	//TODO: Especial Mimetype //
	"zip" : "application/zip",
	"gz"  : "application/gzip",
	"sh"  : "application/x-sh",
	"json": "application/json",
	"tar" : "application/x-tar",
	"rar" : "application/vnd.rar",
	"7z"  : "application/x-7z-compressed",
	"m3u8": "application/vnd.apple.mpegurl",
	
	//TODO: Text Plain Mimetype //
	"txt" : "text/plain",
	"text": "text/plain",
	
	//TODO: Document Mimetype //	
	"pdf" : "application/pdf",	
	"doc" : "application/msword",
	"vsd" : "application/vnd.visio",
	"xls" : "application/vnd.ms-excel",
	"ppt" : "application/vnd.ms-powerpoint",
	"swf" : "application/x-shockwave-flash",
	"ods" : "application/vnd.oasis.opendocument.spreadsheet",	
	"odp" : "application/vnd.oasis.opendocument.presentation",	
	"odt" : "application/vnd.oasis.opendocument.presentation",	
	"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",	
	"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

//TODO: Main Class  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //

const mollyJS = function( front_path, back_path ){
	const mollyJS = {
		keys: Object.keys( mimeType ),
		max_age: 1000 * 60 * 60 * 24,
		timeout: 1000 * 60 * 10,
		mimetype: mimeType,
		front: front_path,
		back: back_path,
	};
	
	mollyJS.slugify = function(str){ const map = {
		'c' : 'ç|Ç','n' : 'ñ|Ñ',
	   	'e' : 'é|è|ê|ë|É|È|Ê|Ë',
	   	'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
	   	'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
	   	'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
	   	'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
		''	: ` |:|_|!|¡|¿|\\?|#|/|,|-|'|"|’`,
	};	for (var pattern in map) { 
			str=str.replace( new RegExp(map[pattern],'g' ), pattern); 
		}	return str.toLowerCase();
	}
	
	mollyJS.header = function( mimeType,size=0 ){
		const header = {
			"Content-Security-Policy-Reporn-Only": "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';",
		//	"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
			"Strict-Transport-Security": `max-age=${mollyJS.max_age}; preload`,
		//	"Cache-Control": `public, max-age=${mollyJS.max_age}`,
		//	"Access-Control-Allow-Origin":"*",
			"Content-Type":mimeType,
		};	if( size ) header['Content-Length'] = size;
		return header;
	}

	mollyJS.chunkheader = function( mimeType,start,end,size ){
		const contentLength = end-start+1;
		return {
			"Content-Security-Policy-Reporn-Only": "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';",
		//	"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
			"Strict-Transport-Security": `max-age=${mollyJS.max_age}; preload`,
			"Cache-Control": `public, max-age=${mollyJS.max_age}`,
			"Content-Range":`bytes ${start}-${end}/${size}`,
		//	"Access-Control-Allow-Origin":"*",
			"Content-Length":contentLength,
			"Content-Type": mimeType,
			"Accept-Ranges":"bytes",
			
		};
	}
	
	mollyJS.router = function( req,res ){
		
		//TODO: Req DOC XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //
		
		req.parse = url.parse(req.url, true);
		req.query = req.parse.query; 
		
		req.parse.method = req.method;
		req.parse.host = req.headers['host'];
		req.parse.hostname = req.headers['host'];
		req.parse.origin = req.headers['origin'];
		req.parse.ip = req.headers['x-forwarded-for'];
		req.parse.protocol = req.headers['x-forwarded-proto'];
		req.parse.params = req.parse.pathname.split('/').splice(1);
		
		//TODO: MollyJS DOC XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //	
		req.get = ( callback )=>{ if( req.method === 'GET' ) callback( req,res ); }
		req.put = ( callback )=>{ if( req.method === 'PUT' ) callback( req,res ); }
		req.post = ( callback )=>{ if( req.method === 'POST' ) callback( req,res ); }	
		req.delete = ( callback )=>{ if( req.method === 'DELETE' ) callback( req,res ); }
		
		req.form = ( callback )=>{
			const form = new formidable.IncomingForm();
			form.parse(req, (err,fields,files)=>{
				const data = { fields:fields, files:files }
				if( err ) res.send(404,'');
				callback( data );
			});
		}
		
		req.saveFile = (_file,_path)=>{	
			fs.rename( _file.filepath,_path,(err)=>{
				if(err) return console.log( err );
				console.log('file saved sucessfully');
			});
		}
		
		req.downloadFile = (_url,_path)=>{
			if( _url.startsWith('http') ){
				axios.get(_url,{responseType:'stream'})
				.then( (response)=>{
					let _newPath = fs.createWriteStream(_path);
						response.data.pipe( _newPath );
					console.log('file saved sucessfully');
				}).catch( err=>console.log( err ) );
			} else if( _url.startsWith('data:') ) {
				const data = _url.split('base64,').pop();
				fs.writeFile(_path, data, {encoding: 'base64'}, (err)=>{
					if(err) return console.log( err );
					console.log('file saved sucessfully');
				});
			} else { console.log('invalid URL: '+_url); }
		}
		
		req.cleanTmp = ()=>{}
		
		res.send = ( _status, _data, _mimetype='html' )=>{
			const mimeType = mollyJS.mimetype[ _mimetype ] || 'text/plain';
			res.writeHead(_status, mollyJS.header( mimeType ));
			res.end( _data ); return 0;
		}
		
		res._404 = ()=>{
			const mimeType = mollyJS.mimetype[ 'html' ];
			res.writeHead(404, mollyJS.header( mimeType ));
			res.end( mollyJS._404_() ); return 0;			
		}
		
		res.json = ( _status,_obj ) =>{ res.send( _status, JSON.stringify(_obj) ); }
		res.redirect = ( _url )=>{ res.writeHead(301, {'location':_url}); res.end(); }
		
		res.sendFile = ( _path )=>{			
			if( fs.existsSync( _path ) ){
				const _SIZE = fs.statSync( _path ).size;
				for( var i in mollyJS.keys ){
					let key = mollyJS.keys[i];
					if( _path.endsWith( key ) ){
						mollyJS.sendStaticFile( req,res,_path,_SIZE,mimeType[key] );
						return 0;				
					}
				}	mollyJS.sendStaticFile( req,res,_path,_SIZE,'text/plain' );
			} else { return res._404(); }
		}
		
		//TODO: _main_ Function  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
		try{ mollyJS.loadModule( req,res,`${mollyJS.back}/_main_.js` ); } catch(e) { }
				
		//TODO: Server Pages XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX//
		if( req.parse.pathname=="/" )
			return res.sendFile( `${mollyJS.front}/index.html` );
		
		else if( fs.existsSync(`${mollyJS.front}${req.parse.pathname}.html`) )
			return res.sendFile( `${mollyJS.front}${req.parse.pathname}.html` ); 
			
		else if( fs.existsSync(`${mollyJS.back}${req.parse.pathname}.js`) )
			return mollyJS.loadModule( req,res,`${mollyJS.back}${req.parse.pathname}.js` );
			
		else if( fs.existsSync(`${mollyJS.back}/${req.parse.params[req.parse.params.length-1]}.js`) ) 
			return mollyJS.loadModule( req,res,`${mollyJS.back}/${req.parse.params[req.parse.params.length-1]}.js` );
	
		else 
			return res.sendFile( `${mollyJS.front}${req.parse.pathname}` );
			
	}
	
	mollyJS.loadModule = function( req,res,_path ){
		const data = fs.readFileSync( _path );
		eval(` 
			try{ ${data} 
			} catch(err) { console.log( err );
				res.send(404,'something went wrong');
			}
		`);
	}
	
	mollyJS.sendStaticFile = function( req,res,url,size,mimeType ){
		const range = req.headers.range;
					
		if( !range ) {
			res.writeHead(200, mollyJS.header( mimeType,size ));
			res.end( fs.readFileSync( url ) );
		
		} else { 
			const chuck_size = Math.pow( 10,6 ); 
			const start = Number(range.replace(/\D/g,""));
			const end = Math.min(chuck_size+start,size-1);
			const chuck = fs.createReadStream( url,{start,end} );

			res.writeHead(206, mollyJS.chunkheader( mimeType,start,end,size ));
			chuck.pipe( res );
		}
	}
	
	mollyJS.createServer = function( Port ){
		const server = http.createServer( mollyJS.router ).listen( Port,'0.0.0.0',()=>{
			console.log(`server started at http://localhost:${Port}`);
		}); server.setTimeout( mollyJS.timeout );
	}
	
	mollyJS.createSecureServer = function( Port ){
		const ssl_key = { key: process.env.KEY, cert: process.env.CERT };	
		const server = https.createSecureServer( ssl_key, mollyJS.router ).listen( Port,'0.0.0.0',()=>{
			console.log(`server started at https://localhost:${Port}`);
		}); server.setTimeout( mollyJS.timeout );
	}
	
	mollyJS._404_ = function(){ 
		let url = `${mollyJS.front}/404.html`
		if( fs.existsSync(url) )
			return fs.readFileSync(`${mollyJS.front}/404.html`); 
		return 'Oops 404 not found';
	}
	
	return mollyJS;
};
	
//TODO: Main Functions  XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX //

require('dotenv').config();

let server = new mollyJS( `${__dirname}/www`, `${__dirname}/controller` );
//	server.createSecureServer( process.env.PORT || 3000 );
	server.createServer( process.env.PORT || 3000 );



