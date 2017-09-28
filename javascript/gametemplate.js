var gametypes = (function(){

	var opt = {
				handSize: 5,
				players: 4,
				teams: false,
				defaultFaceDown: true,
				cardCount: 52,
				cardDescriptions: [],
				getImageURLFunction: null,
				getImageBackgroundURLFunction: null
	};
	var deck, players, pile;

	function mouseEvent(ev) {
		var card = $(this).data('card');
		if (card.container) {
			var handler = card.container._click;
			if (handler) {
				handler.func.call(handler.context || window, card, ev);
			}
		}
	}

	function init(cards, players, options) {
		if (options) {
			for (var i in options) {
				if (opt.hasOwnProperty(i)) {
					opt[i] = options[i];
				}
			}
		}

		var start = cards.options.acesHigh ? 2 : 1;
		var end = start + 12;

		var Card = cards.Card;

		//create deck of cards and populate to all
		for (var i = start; i <= end; i++) {
			var cardH = new Card('H', i, cards.options.table);
			var cardS = new Card('S', i, cards.options.table);
			var cardD = new Card('D', i, cards.options.table);
			var cardC = new Card('C', i, cards.options.table);

			//Override GetImageUrl of Card
			if(opt.getImageURLFunction && opt.getImageURLFunction !== null && opt.getImageURLFunction !== 'undefined'){
				cardH.getCardImageURL = opt.getImageURLFunction;
				cardS.getCardImageURL = opt.getImageURLFunction;
				cardD.getCardImageURL = opt.getImageURLFunction;
				cardC.getCardImageURL = opt.getImageURLFunction;
			}

			if(opt.getImageBackgroundURLFunction && opt.getImageBackgroundURLFunction !== null && opt.getImageBackgroundURLFunction !== 'undefined'){
				cardH.getCardImageBackgroundURL = opt.getImageBackgroundURLFunction;
				cardS.getCardImageBackgroundURL = opt.getImageBackgroundURLFunction;
				cardD.getCardImageBackgroundURL = opt.getImageBackgroundURLFunction;
				cardC.getCardImageBackgroundURL = opt.getImageBackgroundURLFunction;

			}

			cards.all.push(cardH);
			cards.all.push(cardS);
			cards.all.push(cardD);
			cards.all.push(cardC);
		}

		$('.card').click(mouseEvent);

		cards.shuffle(cards.all);

	}

	function notImplementedError(method, throwObject){
		console.error(method + " FOR: \"" + throwObject.toString() + "\" NOT IMPLEMENTED!");
	}


	function GameType(gameName, cards, players, options){
		this.init(gameName, cards, players, options);
	}

	GameType.prototype = {
		init: function(gameName, cards, players, options){
			this.gameName = gameName;
			this.cards = cards;
			this.players = players;
			this.options = options;
		},

		toString: function(){
			return this.gameName;
		}

	}

	function Player(id, deck, pile, players){
		this.init(id, deck, pile, players);
	}

	Player.prototype = {
		init: function(id, name, deck, pile, players){
			this.id = id;
			this.name = name;
			this.deck = deck;
			this.pile = pile;
			this.players = players;
		},

		toString: function(){
			return "Name: " + this.name + ", id: " + this.id;
		}
	}

	function GameMaster(cards, gametype, players, options){
		this.init(cards, gametype, players, options);
	}

	GameMaster.prototype = {
		init: function(cards, gametype, players, options){
			this.cards = cards;
			this.gametype = gametype;
			this.players = players;
			this.options = options;
		},

		toString: function(){
			return "GameMaster - " + this.gametype;
		},

		run: function(){
			//do work
			notImplementedError("run", this);
		}
	}


	return {
		init: init,
		options : opt,
		GameType: GameType,
		Player: Player,
		GameMaster: GameMaster
	};

})();