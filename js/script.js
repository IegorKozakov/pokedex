"use strict";

function App(config){
	/*
	* Config - configurationobject. consist of page, counter per page and offset (skip items)
	* Next page - is next page url
	* Counter needed for quick search in collection;
	* Loading button with listener
	* */

	this.config = config;
	this.collection = [];
	this.nextPage = '';
	this.counter = 0;
	this.loadingBtn = document.querySelector(config.loadMoreBtnSelector);
	this.loadingBtn.addEventListener('click', this.loadPokeJSON.bind(this));
	this.pokeListContainer = document.querySelector(config.contentSelector);
	this.detailsContainer = document.querySelector('.details__inner');

}

/*
* Run Pokeapp for loading and first pokemons.
* */
App.prototype.init = function(){
	this.loadPokeJSON();
};

App.prototype.loadPokeJSON = function (){
	var self = this;

	console.log(self.loadingBtn.className.indexOf('loading'));
	if(self.loadingBtn.className.indexOf('loading') !== -1){
		return false;
	}


	var url = self.nextPage ? 'http://pokeapi.co' + self.nextPage : 'http://pokeapi.co/api/v1/pokemon/?limit='+
		(self.config.countPerPage * self.config.page) +
		'&offset='+self.config.offset;

	self.loadingBtn.innerText = 'loading...';
	self.loadingBtn.className += ' loading';

	IG.ajax({
		url: url,
		success: function(res){
			var responce = JSON.parse(res);
			var list = responce.objects;

			self.collection = self.collection.concat(list);
			self.nextPage = responce.meta.next;

			for(var i=0; i<list.length; i++){
				self.renderPokemonItem(list[i]);
			}
			self.loadingBtn.innerText = 'Load more';
			IG.removeClassName(self.loadingBtn, 'loading');
			if (self.detailsContainer.className.indexOf('started') === -1){
				self.detailsContainer.className += ' started';
			}
		},
		error: function(err){
			console.log(err);
		}
	});
};

App.prototype.renderPokemonItem = function(pokemon){
	/*
	* Create new Elements
	* */
	var self = this,
		container = document.createElement('div'),
		link =  document.createElement('a'),
		title = document.createElement('h3'),
		typesContainer = document.createElement('div');

	container.className = 'pokemon__item';

	link.className = 'pokemon__link';
	link.href = '#' + pokemon.pkdx_id;

	/*
	* Add counter nuber of item. it should be equal with the collaction array position;
	* */
	link.dataset.counter = self.counter;
	self.counter ++;

	link.style.backgroundImage = 'url(http://pokeapi.co/media/img/'+ pokemon.pkdx_id +'.png)';
	link.addEventListener('click', function(e){
		var pokemonData = self.getPokemonDetails(this.dataset.counter, this.href);
		self.renderPokemonDetails(pokemonData);
	});

	title.className = 'pokemon__title';
	typesContainer.className = 'pokemon__types_links';
	title.innerText = pokemon.name;

	for(var i = 0; i < pokemon.types.length; i++){
		var typeLink = document.createElement('a');

		typeLink.innerText = pokemon.types[i].name;
		typeLink.href = '#' + pokemon.types[i].resource_uri;
		typeLink.className = 'pokemon__type_link ' + pokemon.types[i].name;
		typesContainer.appendChild(typeLink);
	}

	container.appendChild(link);
	container.appendChild(title);
	container.appendChild(typesContainer);

	self.pokeListContainer.appendChild(container);
};

App.prototype.getPokemonDetails = function(position, href){

	var self =  this,
		id = href.split('#')[1],
		data;

	/*
	* Get item from the collection by it's position id, and check it's hash with pkdx_id.
	* */

	data = self.collection[position];

	if(data === undefined || data.pkdx_id === id){


	var url = 'http://pokeapi.co/api/v1/pokemon/'+id;

		IG.ajax({
			url: url,
			success: function(res){
				var data = JSON.parse(res);
				return data;
			},
			error: function(err){
				console.log(err);
			}
		});
	} else {
		return data;
	}
};

App.prototype.renderPokemonDetails = function(data){
	var self = this,
		image = document.createElement('img'),
		title = document.createElement('h3'),
		tableContainer = document.createElement('table'),
		table = document.createElement('tbody');

	console.log(data);

	self.detailsContainer.innerHTML = '';

	image.src = 'http://pokeapi.co/media/img/'+ data.pkdx_id +'.png';
	title.innerText = data.name + ' #' + getId(data.pkdx_id);

	self.detailsContainer.appendChild(image);
	self.detailsContainer.appendChild(title);
	self.detailsContainer.appendChild(tableContainer);

	// create detail table
	var type = createAndUppendTabelRow();
	type.appendChild(createTableSell('Type'));
	var types = data.types.map(function(item){
		return item.name;
	}).join(', ');
	type.appendChild(createTableSell(types));

	var attack = createAndUppendTabelRow();
	attack.appendChild(createTableSell('Attack'));
	attack.appendChild(createTableSell(data.attack));

	var defense = createAndUppendTabelRow();
	defense.appendChild(createTableSell('Defense'));
	defense.appendChild(createTableSell(data.defense));

	var hp = createAndUppendTabelRow();
	hp.appendChild(createTableSell('HP'));
	hp.appendChild(createTableSell(data.hp));

	var sp_atk = createAndUppendTabelRow();
	sp_atk.appendChild(createTableSell('SP Attack'));
	sp_atk.appendChild(createTableSell(data.sp_atk));

	var sp_def = createAndUppendTabelRow();
	sp_def.appendChild(createTableSell('SP Defence'));
	sp_def.appendChild(createTableSell(data.sp_def));

	var speed = createAndUppendTabelRow();
	speed.appendChild(createTableSell('SP Defence'));
	speed.appendChild(createTableSell(data.speed));

	var moves = createAndUppendTabelRow();
	moves.appendChild(createTableSell('Total Moves'));
	moves.appendChild(createTableSell(data.moves.length));

	tableContainer.appendChild(table);
	self.detailsContainer.className += ' loaded';

	function createAndUppendTabelRow(){
		var tr = document.createElement('tr');
		table.appendChild(tr);
		return tr;
	}

	function createTableSell(content){
		var td = document.createElement('td');
		td.innerText = content;
		return td;
	}

	function getId (id){
		var str = id.toString();

		switch(str.length){
			case 1:
				str = '00'+str;
				break;
			case 2:
				str = '0'+str;
				break;
		}

		return str;
	}
};

var app = new App({
	page: 1,
	countPerPage: 12,
	offset: 0,
	loadMoreBtnSelector: '.j-load_more',
	contentSelector: '.j-condent-inner'
});

app.init();