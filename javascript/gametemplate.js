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

	function mouseOver(ev){
		var card = $(this).data('card');
		if(card.container) {
			var handler = card.container._mouseover;
			if (handler) {
				handler.func.call(handler.context || window, card, ev);
			}
		}
	}

	function init(cards, players, options, buildDeckFunction) {
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

		if(buildDeckFunction === null || buildDeckFunction === 'undefined' || !buildDeckFunction){
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
		}else{
			buildDeckFunction(opt, cards.all);

			for(var i = 0; i < cards.all.length; i++){
				if(opt.getImageURLFunction && opt.getImageURLFunction !== null && opt.getImageURLFunction !== 'undefined'){
					cards.all[i].getCardImageURL = opt.getImageURLFunction;
				}
				if(opt.getImageBackgroundURLFunction && opt.getImageBackgroundURLFunction !== null && opt.getImageBackgroundURLFunction !== 'undefined'){
					cards.all[i].getCardImageBackgroundURL = opt.getImageBackgroundURLFunction;
				}
			}
		}

		$('.card').click(mouseEvent);
		$('.card').mouseover(mouseOver);
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
	
	function ChatBox(options){
		this.init(options);
	}

	ChatBox.prototype = {
		init: function(options){
			this.options = {
				table: null,
				speed: 500,
				animationSpeed: 500,
				width:"200px",
				height:"150px",
				top:"auto",
				left:"10px",
				right: "auto",
				bottom: "10px",
				callback: null,
				chatCallback: null //Overriding the chat callback will require you to send the message yourself!
			}

			if (options) {
				for (var i in options) {
					if (this.options.hasOwnProperty(i)) {
						this.options[i] = options[i];
					}
				}
			}
		},

		toString: function(){
			return "ChatBox";
		},

		render : function(){
			var speed = this.options.speed || this.opt.animationSpeed;

			this.el = $('<div/>').css({
					width:this.options.width,
					height:this.options.height,
					position:'absolute',
					border:"1px solid black",
					"background-color": 'white',
					top: this.options.top,
					left: this.options.left,
					right: this.options.right,
					bottom: this.options.bottom,
					"text-align": "left"
			}).attr('id', 'pcjs_chatbox').data('chatbox', this).appendTo($(this.options.table));


			this.input = this.createChatInput(this.options.chatCallback, speed);

			if (this.options.callback) {
				setTimeout(this.options.chatCallback, speed);
			}

			return this;
		},

		createChatInput: function(callback, speed){
			return new ChatInput(callback, speed);
		},

		sendMessage(message, senderName, options){
			this.input.sendMessage(message, senderName, options);
		}

	}

	function ChatInput(callback, speed){
		this.init(callback, speed);
	}

	ChatInput.prototype = {
		init: function(callback, speed){
			this.callback = callback;
			this.speed = speed;

			this.render();
		},

		render: function(){
			var me = this;
			var inputIdName = "pcjs_chatInput";
			var buttonIdName = "pcjs_chatboxSendButton";
			var chatAreaIdName = "pcjs_chatArea";
			var defInputCSS = {
				position:'absolute',
				width: '80%',
				height: '20px',
				"border-left": "none",
				"border-right": "none",
				"border-bottom": "none",
				"border-top": "1px solid black",
				bottom: "0px",
				left:0,
				padding:"2px",
				color:"lightgray"
			};
			var defButtonCSS = {
				position:'absolute',
				width:'20%',
				height: '20px',
				"border-left": "1px solid black",
				"border-right": "none",
				"border-top": "1px solid black",
				"border-bottom": "none",
				bottom: "0px",
				right: 0,
				text:">",
				color:"white",
				"background-color": "#2196F3",
				cursor: "pointer"
			};
			var defChatAreaCSS = {
				position: 'absolute',
				display: 'inline-block',
				width:'100%',
				height: ($('#pcjs_chatbox').height() - 20) + "px",
				left: 0,
				top: 0,
				"overflow-y":"scroll"
			};

			this.chatArea = $("<div/>").css(defChatAreaCSS).attr("id", chatAreaIdName).data("chatArea", this).appendTo($('#pcjs_chatbox'));
			this.chatInput = $('<input/>').css(defInputCSS).attr("id", inputIdName).data('input', this).appendTo($('#pcjs_chatbox'));
			this.chatButtonSend = $('<input type=\'button\'/>').css(defButtonCSS).attr("id", buttonIdName).attr('value', '>').data('button', this).appendTo($('#pcjs_chatbox'));

			//ETC styling for chatInput
			this.chatInput.focus(function() {
				//Add temp css on focus I guess...
				$(this).css({
					color:"black"
				});
			});

			this.chatInput.blur(function() {
				$(this).css(defInputCSS);
			});

			this.chatInput.keypress(function(e) {
				if(e.which == 13){
					me.chatButtonClicked(me.callback);
				}
			})

			this.chatButtonSend.hover(
				function() {
				//apply temp css
				$(this).css({
					"background-color":"#3f51b5"
				})
				},
				function(){
					$(this).css(defButtonCSS);
				}
			);

			this.chatButtonSend.click(function(){
				me.chatButtonClicked(me.callback);
			});
		},

		chatButtonClicked: function(callback){
			//callback notifies caller message was sent
			message = this.chatInput.val();

			if(callback){
				callback(message);
			}else{
				this.sendMessage(message);
			}

			this.chatInput.val("");
		},

		sendMessage: function(message, senderName, options){
			var defMessageCSS = {
				left: 0,
				display: "block",
				padding: "2px"
			}

			var nameCSS = {
				"font-weight": "bold"
			}

			var opt = options || {
				messageCSS: defMessageCSS,
				nameCSS: nameCSS
			}
			if (options) {
				for (var i in options) {
					if (this.options.hasOwnProperty(i)) {
						this.options[i] = options[i];
					}
				}
			}

			var sender = senderName || this.generatedUserName();

			var builtMessage = $("<span/>").css(nameCSS).html(sender).prop('outerHTML') + " : " + message;

			$('<span/>').css(defMessageCSS).addClass("pcjs_chatMessage").data("message", builtMessage).appendTo(this.chatArea).html(builtMessage);
			this.chatArea.scrollTop(function() { return this.scrollHeight;});

		},

		generatedUserName(){
			if(this.generatedUserNameString){
				return this.generatedUserNameString;
			}else{
				this.generatedUserNameString = "User" + parseInt(Math.random()*10000);
				return this.generatedUserNameString;
			}
		}
	}


	return {
		init: init,
		options : opt,
		GameType: GameType,
		Player: Player,
		GameMaster: GameMaster,
		ChatBox: ChatBox
	};

})();