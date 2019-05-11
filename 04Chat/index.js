var _grid = [];
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2
var _Message;
global._wait = 0;

var express = require('express');

var app = express();

var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js', express.static(__dirname + '/js'));

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next(); }
}

app.get('/', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    var user = req.body.username,
        pw = req.body.password;

    if (user === 'u1' && pw === 'test') {
        req.session.user = 'u1';
    } else if (user === 'u2' && pw === 'test') {
        req.session.user = 'u2';
    }

    res.redirect('/chat');
});

app.get('/chat', checkAuth, function (req, res) {
    res.render('chat', {user: req.session.user});
});

app.get('/logout', function (req, res) {
    connections[req.session.user].close();
    delete connections[req.session.user];

    delete req.session.user;

    var msg = '{"type": "join", "names": ["' +
        Object.keys(connections).join('","') + '"]}';

    for (var key in connections) {
        if (connections[key] && connections[key].send) {
            connections[key].send(msg);
        }
    }
    res.redirect('/');
});


app.listen(8080);

var WSS = require('websocket').server,
    http = require('http');

var server = http.createServer();
server.listen(8181);

var wss = new WSS({
    httpServer: server,
    autoAcceptConnections: false
});

var connections = {};
wss.on('request', function (request) {
    var connection = request.accept('chat', request.origin);

    connection.on('message', function(message) {
        var name = '';

        for (var key in connections) {
            if (connection === connections[key]) {
                name = key; }
        }

        var data = JSON.parse(message.utf8Data);

        switch (data.type) {
            case 'join':
                connections[data.name] = connection;
                var msg = '{"type": "join", "names": ["' + Object.keys(connections).join('","') + '"]}';
                break;
            case 'msg':
                var msg = '{"type": "msg", "name": "' + name + '", "msg":"' + data.msg + '"}';
                break;
            case 'start':
                if(initGame(name) == 0){
                    var msg = '{"type": "error", "name": "' + name + '", "msg":"Bitte warten auf 2. Spieler"}';
                }
                else{
                    var msg = '{"type": "start", "name1": "' + getPlayer1() + '", "name2": "' + getPlayer2() + '", "msg":"' + data.msg + '", "msg2":"' + JSON.stringify(getGrid()) + '", "msg3":"Spieler ' + getCurrentUserID() + ' beginnt"}';
                }
                break;
            case 'board':
                if(setTile(data.msg,name)==1){
                    var msg = '{"type": "board", "name1": "' + getPlayer1() + '", "name2": "' + getPlayer2() + '", "msg": "' + JSON.stringify(getGrid()) + '", "msg2":"Spieler ' + getCurrentUserID() + ' an der Reihe"}';
                } else {
                    var msg = '{"type": "error", "name": "' + name + '", "msg": "'+ getMessage() +'"}';   
                }
                break;
            /*case 'setTile':
                setTile(data.msg, name);
                var msg = '{"type": "setTile", "name": "' + name + '", "msg": "Nächster Spieler"}';
                break;*/
        }

        for (var key in connections) {
            if (connections[key] && connections[key].send) {
                connections[key].send(msg);
            }
        }
    });
});

function initGame(player){

if(_wait == 0){
  this._player1 = player;
  _wait++;
  return 0;
}else{
    //Prüfe, ob Player1 gegen sich selbst spielt 
    if(this._player1 == player){
        return 0;
    }else{
        this._player2 = player;
        this._grid = new Grid ();
        _wait = 0;
        this._currentUserID = this._player1; //Spieler 1 beginnt
        return 1;
    }
}

}

function Grid(){

    let yMax = 7;
    let xMax = 6;
    let board = [];

    for (let i=0; i<xMax; i++) {
        
        board[i] = [];

        for (let j=0; j<yMax; j++) {
            board[i][j] = 0;
        }
    }
    return board;
}

function getGrid(){

  return this._grid;

}

function setTile(column, player){

if(this._currentUserID == player){ //Prüfe, ob Spieler an der Reihe ist
  //if(column>0 && column<8){ //Prüfe, ob gültiger Zug
        var set;
        switch (this._currentUserID){
            case this._player1: set = 1; break;
            case this._player2: set = 2; break;
        }
        for (let i=5; i>=0; i--) {
            
            if (this._grid[i][column-1] == 0){
                this._grid[i][column-1] = set;

                if(checkGameOver()==this._currentUserID){
                    this._Message = 'Spieler ' + this._currentUserID + ' hat gewonnen';
                    return 0; 
                }

                switch(this._currentUserID){
                    case this._player1: this._currentUserID = this._player2; break;
                    case this._player2: this._currentUserID = this._player1; break;
                } 
                return 1;
            }
        }
    //}
    this._Message = 'Ungültiger Zug, bitte erneut versuchen';
    return 0;
}
    this._Message = 'Sie sind nicht an der Reihe';
    return 0;
}

function getPlayer1(){

    return this._player1;
  
  }

function getPlayer2(){

    return this._player2;
  
  }

function getCurrentUserID(){

    return this._currentUserID;
  
  }

function getMessage(){

    return this._Message;
  
  }

function checkGameOver() {
	var flag;
	flag = checkVerticalGameOver();
	
	if(flag != 0){
		return flag;
	}
	
	flag = checkHorizontalGameOver();
	
	if(flag != 0){
		return flag;
	}
	
	flag = checkDiagonalGameOver();
	
	if(flag != 0){
		return flag;
	}
	
	return 0;
}

function checkVerticalGameOver(){
	var grid = this._grid;
	//hier geändert column 7 statt 6
	for (let column=0; column<7; column++){
        for (let offset=0; offset<3; offset++) {
            var flag = true;
			var lowestPlayerTile = grid[column][offset];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != grid[column][i+offset]){
						flag = false;
						break;
					}
				}
				if(flag == true){
					return lowestPlayerTile;
				}
			}
        }
    }

	return 0;
}

function checkHorizontalGameOver(){
  
	//var grid = this._grid;
	//hier geändert column 7 statt 6
	for (let column=0; column<7; column++){
        for (let offset=0; offset<4; offset++) {
            var flag = true;
			var lowestPlayerTile = this._grid[offset][column];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[offset+i][column]){
						flag = false;
						break;
					}
				}
				if(flag == true){
					return lowestPlayerTile;
				}
			}
        }
    }

	return 0;
}

function checkDiagonalGameOver(){
	console.log(this._grid);
	
	for (let offsetHorizontal=0; offsetHorizontal<4; offsetHorizontal++){
        for (let offsetVertical=0; offsetVertical<4; offsetVertical++) {
            var flag = true;
			var lowestPlayerTile = this._grid[offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[offsetHorizontal+i][offsetVertical+i]){
						flag = false;
						break;
					}
				}
				if(flag == true){
					return lowestPlayerTile;
				}
			}
        }
    }
	//Hier wurde geändert
	for (let offsetHorizontal=3; offsetHorizontal<6; offsetHorizontal++){
        for (let offsetVertical=0; offsetVertical<3; offsetVertical++) {
            var flag = true;
			var lowestPlayerTile = this._grid[offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[offsetHorizontal-i][offsetVertical+i]){
						flag = false;
						break;
					}
				}
				if(flag == true){
					return lowestPlayerTile;
				}
			}
        }
    }

	return 0;
}