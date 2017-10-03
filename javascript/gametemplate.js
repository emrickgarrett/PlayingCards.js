var gametypes = (function(){

	var opt = {
				table: 'body',
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

	function init(cards, options, buildDeckFunction) {
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

		if(buildDeckFunction === null || typeof buildDeckFunction === 'undefined' || !buildDeckFunction){
			//create deck of cards and populate to all
			for (var i = start; i <= end; i++) {
				var cardH = new Card('H', i, cards.options.table);
				var cardS = new Card('S', i, cards.options.table);
				var cardD = new Card('D', i, cards.options.table);
				var cardC = new Card('C', i, cards.options.table);

				//Override GetImageUrl of Card
				if(opt.getImageURLFunction && opt.getImageURLFunction !== null && typeof opt.getImageURLFunction !== 'undefined'){
					cardH.getCardImageURL = opt.getImageURLFunction;
					cardS.getCardImageURL = opt.getImageURLFunction;
					cardD.getCardImageURL = opt.getImageURLFunction;
					cardC.getCardImageURL = opt.getImageURLFunction;
				}

				if(opt.getImageBackgroundURLFunction && opt.getImageBackgroundURLFunction !== null && typeof opt.getImageBackgroundURLFunction !== 'undefined'){
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
				if(opt.getImageURLFunction && opt.getImageURLFunction !== null && typeof opt.getImageURLFunction !== 'undefined'){
					cards.all[i].getCardImageURL = opt.getImageURLFunction;
				}
				if(opt.getImageBackgroundURLFunction && opt.getImageBackgroundURLFunction !== null && typeof opt.getImageBackgroundURLFunction !== 'undefined'){
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

	function Player(id, name, hand, deck, pile, options){
		this.init(id, name, hand, deck, pile, options);
	}

	Player.prototype = {
		init: function(id, name, hand, deck, pile, options){
			this.id = id;
			this.name = name;
			this.hand = hand;
			this.deck = deck;
			this.pile = pile;
			
			this.options = {
				players: 2,
				displayUI: true,
				width: "auto",
				height: "auto",
				border: "none",
				padding: "5px",
				position: "absolute",
				top: "auto",
				left: "auto",
				right: "auto",
				bottom: "auto",
				backgroundColor: "auto",
				color: "white",
				textAlign: "left",
				renderUIFunc: null,
				AI: true
			};

			this.calcPosition(id, this.options.players, hand);			

			if (options) {
				for (var i in options) {
					if (this.options.hasOwnProperty(i)) {
						this.options[i] = options[i];
					}
				}
			}

			if(this.options.AI){
				this.AI = new AI(hand, deck, pile);
				this.name = (this.name === null || typeof this.name === "undefined" || this.name === "") ? this.AI.name: this.name;
				this.AI.sendMessage(this.AI.getGreeting());
			}

			if(this.options.displayUI){
				this.renderUI();
			}

		},

		toString: function(){
			return "Name: " + this.name + ", id: " + this.id;
		},

		renderUI: function(){
			if(typeof this.options.renderUIFunc === "undefined" || this.options.renderUIFunc === null){
				this.el = $('<div/>').css({
					width:this.options.width,
					height:this.options.height,
					position:this.options.position,
					border:this.options.border,
					"background-color": this.options.backgroundColor,
					color: this.options.color,
					top: this.options.top,
					left: this.options.left,
					right: this.options.right,
					bottom: this.options.bottom,
					padding: this.options.padding,
					"text-align": this.options.textAlign
				}).attr('id', 'player' + this.id + 'ui').data('player', this).appendTo($(opt.table)); 

				this.nameEl = $('<span/>').css({
					"font-weight": "bold",
					color : this.options.color,
					"font-size": "2em"
				}).text(this.name).appendTo(this.el);
			}else{
				//You can decide not to render a UI or you can use the options to render a UI yourself...
				this.options.renderUIFunc(this.options);
			}

		},

		calcPosition: function(id, players, hand){
			if(players < 4){
				if(players > 2){
					switch(id){
						case 0:
						// bottom of table
						break;
						case 1:
						// left of table
						break;
						case 2:
						// top of table
						break;
						case 3:
						// right of table
						break;
					}
				}else{
					if(id === 0){
						// bottom of table
						this.options.right = 0;
						this.options.bottom = 0;
					}else{
						// top of table
						this.options.left = 0;
						this.options.top = 0;
					}
				}
			}else{ // Game has 5-many players

			}
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
				maximized: true,
				callback: null,
				chatCallback: null, //Overriding the chat callback will require you to send the message yourself!
				toolbarCallback: null
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
			this.toolbar = this.createToolbar(this.options.toolbarCallback, speed);

			if(this.options.maximized){
				this.maximize();
			}else{
				this.minimize();
			}

			if (this.options.callback) {
				setTimeout(this.options.chatCallback, speed);
			}

			return this;
		},

		createChatInput: function(callback, speed){
			return new ChatInput(callback, speed);
		},

		createToolbar: function(callback, speed){
			return new ChatToolBar(this, this.toolbarCallback, speed);
		},

		sendMessage: function(message, senderName, options){
			this.input.sendMessage(message, senderName, options);
		},

		maximize: function(){
			this.input.show();
			this.el.height(this.options.height);
			this.el.show();
			this.toolbar.maximize();
		},

		minimize: function(){
			this.input.hide();
			this.el.height(this.toolbar.size);
			this.toolbar.minimize();
		},

		close: function(){
			this.el.hide();
		},

		toolbarCallback: function(caller, actiontype){
			if(caller.options.toolbarCallback){
				caller.options.toolbarCallback(actiontype);
			}else{
				switch(actiontype){
					case ChatBoxAction.CLOSE:
						caller.close();
					break;
					case ChatBoxAction.MINIMIZE:
						caller.minimize();
					break;
					case ChatBoxAction.MAXIMIZE:
						caller.maximize();
					break;
				}
			}
		}

	}

	function ChatInput(callback, speed, colors){
		this.init(callback, speed, colors);
	}

	ChatInput.prototype = {
		init: function(callback, speed, colors){
			this.callback = callback;
			this.speed = speed;


			if(colors && colors !== null && typeof colors !== "undefined" && colors.count === 4) {
				this.primaryColor = colors[0];
				this.secondaryColor = colors[1];
				this.primaryTextColor = colors[2];
				this.secondaryTextColor = colors[3];
			}else{
				this.primaryTextColor = "white";
				this.secondaryTextColor = "white";
				this.primaryColor = "#2196F3";
				this.secondaryColor = "#3f51b5";
			}

			this.render();
		},

		render: function(){
			var me = this;
			var inputIdName = "pcjs_chatInput";
			var buttonIdName = "pcjs_chatboxSendButton"
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
				color: this.primaryTextColor,
				"background-color": this.primaryColor,
				cursor: "pointer"
			}


			this.chatInput = $('<input/>').css(defInputCSS).attr("id", inputIdName).data('input', this).appendTo($('#pcjs_chatbox'));
			this.chatButtonSend = $('<input type=\'button\'/>').css(defButtonCSS).attr("id", buttonIdName).attr('value', '>').data('button', this).appendTo($('#pcjs_chatbox'));

			//ETC styling for chatInput
			this.chatInput.focus(function() {
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
					"background-color":me.secondaryColor,
					"color": me.secondaryTextColor
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
				callback(ChatBoxAction.SEND, message);
			}else{
				this.sendMessage(message);
			}

			this.chatInput.val("");
		},

		hide: function(){
			this.chatInput.hide();
			this.chatButtonSend.hide();
		},

		show: function(){
			this.chatInput.show();
			this.chatButtonSend.show();
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

			$('<span/>').css(defMessageCSS).addClass("pcjs_chatMessage").data("message", builtMessage).appendTo($('#pcjs_chatbox')).html(builtMessage);

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

	function ChatToolBar(caller, callback, speed, colors){
		this.init(caller, callback, speed, colors);
	}

	ChatToolBar.prototype = {
		init: function(caller, callback, speed, colors){
			this.caller = caller;
			this.callback = callback;
			this.speed = speed;
			this.size = 15;

			if(colors && colors !== null && typeof colors !== "undefined" && colors.count === 4) {
				this.primaryColor = colors[0];
				this.secondaryColor = colors[1];
				this.primaryTextColor = colors[2];
				this.secondaryTextColor = colors[3];
			}else{
				this.primaryTextColor = "white";
				this.secondaryTextColor = "white";
				this.primaryColor = "#2196F3";
				this.secondaryColor = "#3f51b5";
			}

			this.render();
		},

		render: function(){
			var me = this;

			var toolbarCSS = {
				position: "absolute",
				top: "0",
				left: "0",
				right: "auto",
				bottom: "auto",
				"background-color": this.primaryColor,
				width:"100%",
				height: this.size + "px"
			};
			var minimizeCSS = {
				"background-color": this.primaryColor,
				color: this.primaryTextColor,
				float:"right",
				width: this.size + "px",
				height: this.size + "px",
				"line-height": this.size + "px",
				"text-align": "center",
				cursor: "pointer"				
			};
			var maximizeCSS = {
				"background-color": this.primaryColor,
				color: this.primaryTextColor,
				float:"right",
				width: this.size + "px",
				height: this.size + "px",
				"line-height": this.size + "px",
				"text-align": "center",
				cursor: "pointer"				
			};
			var closeCSS = {
				"background-color": "red",
				color: this.primaryTextColor,
				float:"right",
				width: this.size + "px",
				height: this.size + "px",
				"line-height": this.size + "px",
				"text-align": "center",
				cursor: "pointer"
			};

			this.toolbar = $("<div/>").css(toolbarCSS).addClass("pcjs_toolbar").data("toolbar", this).appendTo($("#pcjs_chatbox"));
			this.close = $("<div/>").css(closeCSS).addClass("pcjs_toolbar_close").data("toolbar", this).text("x").appendTo(this.toolbar);
			this.maximizeDiv = $("<div/>").css(maximizeCSS).addClass("pcjs_toolbar_maximize").data("toolbar", this).text("+").appendTo(this.toolbar);
			this.minimizeDiv = $("<div/>").css(minimizeCSS).addClass("pcjs_toolbar_minimize").data("toolbar", this).text("-").appendTo(this.toolbar);

			this.close.hover(
				function(){
					$(this).css({
						"background-color": "darkred"
					})
				}, 
				function(){
					$(this).css(closeCSS);
				}
			);

			this.maximizeDiv.hover(
				function(){
					$(this).css({
						"background-color": me.secondaryColor,
						color: me.secondaryTextColor
					});
				},
				function(){
					$(this).css(maximizeCSS);
				}
			);

			this.minimizeDiv.hover(
				function(){
					$(this).css({
						"background-color": me.secondaryColor,
						color: me.secondaryTextColor
					});
				},
				function(){
					$(this).css(minimizeCSS);
				}
			);

			this.close.click(function(){
				if(me.callback){
					me.callback(me.caller, ChatBoxAction.CLOSE);
				}
			});

			this.maximizeDiv.click(function(){
				if(me.callback){
					me.callback(me.caller, ChatBoxAction.MAXIMIZE);
				}
			});

			this.minimizeDiv.click(function(){
				if(me.callback){
					me.callback(me.caller, ChatBoxAction.MINIMIZE);
				}
			})


		},

		minimize: function(){
			this.minimizeDiv.hide();
			this.maximizeDiv.show();
		},

		maximize: function(){
			this.maximizeDiv.hide();
			this.minimizeDiv.show();
		}
	}

	ChatBoxAction = {
		CLOSE: 1,
		MINIMIZE: 2,
		MAXIMIZE: 3,
		SEND: 4,
		UPDATE: 5
	}

	function AI(hand, deck, pile, callback){
		this.init(hand, deck, pile, callback);
	}

	AI.prototype = {
		init: function(hand, deck, pile, callback){
			this.hand = hand;
			this.deck = deck;
			this.pile = pile;
			this.callback = callback;
			this.name = this.generateAIName();
		},

		generateAIName: function(){
			var nameResult = "";
			switch(parseInt(Math.random()*10)){
				case 0:
					nameResult = "Tim";
				break;
				case 1:
					nameResult = "Hugh";
				break;
				case 2:
					nameResult = "Randy";
				break;
				case 3:
					nameResult = "Elias";
				break;
				case 4:
					nameResult = "Erik";
				break;
				case 5:
					nameResult = "Kim";
				break;
				case 6:
					nameResult = "Damon";
				break;
				case 7:
					nameResult = "George";
				break;
				case 8:
					nameResult = "Jodi";
				break;
				case 9:
					nameResult = "Ruth";
				break;
				case 10:
					nameResult = "Alex";
				break;
			}

			return nameResult + " Bot";
		},

		getTaunt: function(){
			switch(parseInt(Math.random()*3)){
				case 0:
					return "What were you thinking?";
				break;
				case 1:
					return "You're going to regret that!";
				break;
				case 2:
					return "You're making this too easy";
				break;
			}
		},

		getCompliment: function(){
			switch(parseInt(Math.random()*3)){
				case 0:
					return "Great play!";
				break;
				case 1:
					return "What a move!";
				break;
				case 2:
					return "Nice one!";
				break;
			}
		},

		getGreeting: function(){
			switch(parseInt(Math.random()*3)){
				case 0:
					return "Hello!";
				break;
				case 1:
					return "Glad to see you!";
				break;
				case 2:
					return "Let's do this!";
				break;
			}
		},

		sendMessage: function(message){
			var chatbox = $("#pcjs_chatbox");
			if(chatbox !== null && typeof chatbox !== "undefined"){
				var obj = chatbox.data("chatbox");
				if(obj !== null && typeof obj !== "undefined"){
					obj.sendMessage(message, this.name);
				}
			}
		}
	}


	return {
		init: init,
		options : opt,
		GameType: GameType,
		Player: Player,
		GameMaster: GameMaster,
		ChatBox: ChatBox,
		ChatBoxAction: ChatBoxAction
	};

})();