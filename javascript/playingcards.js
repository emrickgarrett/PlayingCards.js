
var cards = (function(){

	var opt = {
		cardSize: {width: 69, height: 94, padding:18},
		animationSpeed: 500,
		table: 'body',
		cardback: 'default',
		acesHigh: false,
		cardsURL : 'cards/',
		blackJoker : false,
		redJoker: false,
		overrideCards: false
	};

	var zIndexCounter = 1;
	var all = []; //all cards

	function mouseEvent(ev) {
		var card = $(this).data('card');
		if (card.container) {
			var handler = card.container._click;
			if (handler) {
				handler.func.call(handler.context || window, card, ev);
			}
		}
	}

	function mouseOver(ev){
		var card = $(this).data('card');
		if(card.container) {
			var handler = card.container._mouseover;
			if (handler) {
				handler.func.call(handler.context || window, card, ev);
			}
		}
	}

	function init(options) {
		if (options) {
			for (var i in options) {
				if (opt.hasOwnProperty(i)) {
					opt[i] = options[i];
				}
			}
		}


		opt.table = $(opt.table)[0];

		if ($(opt.table).css('position') == 'static') {
			$(opt.table).css('position', 'relative');
		}

		if(!opt.overrideCards){

			var start = opt.acesHigh ? 2 : 1;
			var end = start + 12;

			//create deck of cards and populate to all
			for (var i = start; i <= end; i++) {
				all.push(new Card('H', i, opt.table));
				all.push(new Card('S', i, opt.table));
				all.push(new Card('D', i, opt.table));
				all.push(new Card('C', i, opt.table));
			}

			if(opt.blackJoker) {
				all.push(new Card('BJ', 0, opt.table));
			}

			if(opt.redJoker) {
				all.push(new Card('RJ', 0, opt.table));
			}

			$('.card').click(mouseEvent);
			$('.card').mouseover(mouseOver);

			shuffle(all);
		}
	}

	function shuffle(deck){
		var i = deck.length;
		if (i == 0) return;
		while(--i) {
			var j = Math.floor(Math.random() * (i + 1));
			var tempi = deck[i];
			var tempj = deck[j];
			deck[i] = tempj;
			deck[j] = tempi;
		}
	}

	function Card(suit, rank, table, shouldNotAttach){
		this.init(suit, rank, table, shouldNotAttach);
	}

	Card.prototype = {
		init: function(suit, rank, table, shouldNotAttach) {
			this.shortName = suit + rank;
			this.suit = suit;
			this.rank = rank;
			this.name = suit.toUpperCase() + rank;
			this.faceUp = false;
			this.shouldRotate  = false;
			this.angle = 0;
			this.table = table;
			if(!shouldNotAttach || shouldNotAttach === null || shouldNotAttach === 'undefined'){
				this.attach(table);
			}
			return this;
		},

		attach: function(table){
			if(table && table !== null && table !== 'undefined'){
				this.table = table;
			}

			this.el = $('<div/>').css({
					width:opt.cardSize.width,
					height:opt.cardSize.height,
					"background-image":'url(' + this.getCardImageURL() + ')',
					"background-size": opt.cardSize.width + "px " + opt.cardSize.height + "px",
					"background-repeat": "no-repeat",
					position:'absolute',
					border:"1px solid black",
					"background-color": 'white',
					cursor:'pointer'
			}).addClass('card').data('card', this).appendTo($(this.table));
			this.showCard();
			this.moveToFront();

			return this;
		},

		toString: function () {
			return this.name;
		},

		moveTo: function(x, y, speed, callback) {
			var props = {top:y-(opt.cardSize.height/2), left:x-(opt.cardSize.width/2)};
			$(this.el).animate(props, speed || opt.animationSpeed, callback);

			return this;
		},

		rotate: function(angle) {
			$(this.el)
				.css('-webkit-transform', 'rotate(' + angle + 'deg)')
				.css('-moz-transform', 'rotate(' + angle + 'deg)')
				.css('-ms-transform', 'rotate(' + angle + 'deg)')
				.css('-transform', 'rotate(' + angle + 'deg)')
				.css('-o-transform', 'rotate(' + angle + 'deg)');

				return this;
		},

		showCard: function() {
			var offsets = { "C": 0, "D": 1, "H": 2, "S": 3};
			var xpos, ypos;
			var rank = this.rank;
			if (rank == 14) {
				rank = 1;
			}

			xpos = -rank * opt.cardSize.width;
			ypos = -offsets[this.suit] * opt.cardSize.height;
			$(this.el).css('background-image', 'url(' + this.getCardImageURL() + ')');

			return this;
		},

		hideCard: function(position) {
			//var y = opt.cardback == 'red' ? 0*opt.cardSize.height : -1*opt.cardSize.height;
			$(this.el).css('background-image', 'url(' + this.getCardImageBackgroundURL() + ')');

			return this;
		},

		moveToFront: function() {
			$(this.el).css('z-index', zIndexCounter++);

			return this;
		},

		getCardImageURL: function(){
			var rank = 2;
			switch(this.rank){
				case 11:
					rank = "J";
				break;
				case 12:
					rank = "Q";
				break;
				case 13:
					rank = "K";
				break;
				case 1:
					rank = "A";
				break;
				default:
					rank = this.rank;
				break;
			}
			return opt.cardsURL + rank + this.suit + ".png";
		},

		getCardImageBackgroundURL: function(){
			switch(opt.cardback){
				case 'default':
					return opt.cardsURL + "back.png";
				break;
			}
		}
	};

	function Container(){

	}

	Container.prototype = new Array();
	Container.prototype.extend = function(obj) {
		for (var prop in obj) {
			this[prop] = obj[prop];
		}
	}
	Container.prototype.extend({
		addCard: function(card) {
			this.addCards([card]);
		},

		addCards: function(cards){
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				if (card.container) {
					card.container.removeCard(card);
				}
				this.push(card);
				card.container = this;
				card.rotate(0);
			}
		},

		removeCard: function(card){
			for (var i=0; i < this.length; i++){
				if(this[i] == card){
					this.splice(i, 1);
					return true;
				}
			}

			return false;
		},

		init: function(options){
			options = options || {};
			this.x = options.x || $(opt.table).width()/2;
			this.y = options.y || $(opt.table).height()/2;
			this.shouldRotate = options.shouldRotate;
			this.angle = options.angle || 0;
			this.faceUp = options.faceUp;
		},

		click : function(func, context){
			this._click = {func: func, context:context};
		},

		mousedown: function(func, context){
			this._mousedown = {func: func, context:context};
		},

		mouseup: function(func, context){
			this._mouseup = {func: func, context:context};
		},

		mouseover : function(func, context){
			this._mouseover = {func: func, context:context};
		},

		render : function(options){
			options = options || {};
			var speed = options.speed || opt.animationSpeed;
			this.calcPosition(options);
			for (var i = 0; i < this.length; i++) {
				var card = this[i];
				zIndexCounter++;
				card.moveToFront();
				var top = parseInt($(card.el).css('top'));
				var left = parseInt($(card.el).css('left'));
				if (top != card.targetTop || left != card.targetLeft) {
					var props = {top:card.targetTop, left:card.targetLeft, queue:false};

					if (options.immediate) {
						$(card.el).css(props);
					} else {
						$(card.el).animate(props, speed);
					}

				}
			}
			var me = this;
			var flip = function(){
				for (var i = 0; i < me.length; i++) {
					if(me.faceUp) { 
						me[i].showCard();
					}else{
						me[i].hideCard();
					}
				}
			}

			if (options.immediate) {
				flip();
			}else{
				setTimeout(flip, speed /2);
			}

			if (options.callback) {
				setTimeout(options.callback, speed);
			}
		},

		topCard: function(){
			return this[this.length-1];
		},

		toString: function(){
			return 'Container';
		}
	});

	function Deck(options){
		this.init(options);
	}

	Deck.prototype = new Container();
	Deck.prototype.extend({
		calcPosition: function(options){
			options = options || {};
			var left = Math.round(this.x-opt.cardSize.width/2, 0);
			var top = Math.round(this.y-opt.cardSize.height/2, 0);
			var condenseCount = 6;
			for (var i =0; i < this.length; i++){
				if(i > 0 && i % condenseCount == 0) {
					top-=1;
					left-=1;
				}
				this[i].targetTop = top;
				this[i].targetLeft = left;
			}
		},

		toString: function() {
			return 'Deck';
		},

		deal : function(count, hands, speed, callback) {
			var me = this;
			var i = 0;
			var totalCount= count*hands.length;
			function dealOne() {
				if (me.length == 0 || i == totalCount ) {
					if (callback) {
						callback();
					}
					return;
				}
				hands[i%hands.length].addCard(me.topCard());
				hands[i%hands.length].render({callback:dealOne, speed:speed});
				i++;
			}
			dealOne();
		}
	});


	function Hand(options) {
		this.init(options);
	}

	Hand.prototype = new Container();
	Hand.prototype.extend({
		calcPosition: function(options){
			options = options || {};

			var width = opt.cardSize.width + (this.length-1) * opt.cardSize.padding;
			var left = Math.round(this.x - width/2);
			var top = Math.round(this.y-opt.cardSize.height/2, 0);

			for (var i = 0; i < this.length; i++){
				this[i].targetTop = top;
				this[i].targetLeft = left+i*opt.cardSize.padding;

				if(this.shouldRotate && this.angle == 90){
					this[i].targetTop = top+i*opt.cardSize.padding - opt.cardSize.height/2;
					this[i].targetLeft = this.x;
					this[i].rotate(this.angle);
				}else if(this.shouldRotate && this.angle == 270){
					this[i].targetTop = top-i*opt.cardSize.padding + opt.cardSize.height/2;
					this[i].targetLeft = this.x - opt.cardSize.height;
					this[i].rotate(this.angle);
				}else if(this.shouldRotate){
					//not implemented... I would have to reconsider math for general cases...
				}
			}
		},

		toString: function() {
			return 'Hand';
		}
	});

	function Pile(options) {
		this.init(options);
	}

	Pile.prototype = new Container();
	Pile.prototype.extend({
		calcPosition: function(options) {
			options = options || {};
		},

		toString: function(){
			return 'Pile';
		},

		deal: function(count, hands) {
			if (!this.dealCounter) {
				this.dealCounter = count * hands.length;
			}
		}
	});

	return {
		init: init,
		all : all,
		options : opt,
		SIZE : opt.cardSize,
		Card : Card,
		Container : Container,
		Deck : Deck,
		Hand : Hand,
		Pile : Pile,
		shuffle : shuffle
	};

})();