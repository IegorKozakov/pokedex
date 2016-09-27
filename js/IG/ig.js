(function(){

	/*
	* Creating IG class for window object
	* */
	function IG(){};

	IG.prototype.ajax = function(options){
		if(!options){
			options = {};
		}

		if(!options.url){
			throw new Error('Set url in ajax request');
		}

		var xhr = new XMLHttpRequest(),
			type = options.type || 'GET',
			url = options.url,
			async = options.async === false ? false : true;

		xhr.open(type, url, async);

		if(options.cancel){
			xhr.onabort = options.cancel;
		}
		if(options.success){
			xhr.onload = function(){
				options.success(xhr.responseText, xhr.status, xhr.statusText);
			}
		}
		if(options.error){
			xhr.error = options.error;
		}

		if(options.progress){
			xhr.progress = options.progress
		}

		if(!async && options.timeout){
			xhr.timeout = options.timeout ?  options.timeout :  0;
		}

		if(options.ontimeout){
			xhr.ontimeout = options.ontimeout;
		}

		if(options.body) {
			xhr.send(options.body);
		} else {
			xhr.send();
		}
	};

	IG.prototype.removeClassName = function(elem, name) {
		var names = elem.className.split(' '),
	        index = names.indexOf(name);

	    if(index !== -1){
	        names.splice(index, 1);
	    }

		elem.className = names.join(' ');

		return this;
	}

	window.IG = new IG;
})();