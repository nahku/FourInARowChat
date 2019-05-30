global._grid = null;
<<<<<<< HEAD
global._gameManager = new Array(10);
=======
>>>>>>> hanna
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2
var _errorMessage;
var _Message;
global._wait = 0;
<<<<<<< HEAD
=======

>>>>>>> hanna
var express = require('express');
var app = express();
const mongoose = require('mongoose');


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

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const User = require('./js/user');

<<<<<<< HEAD
=======
/*app.get('/', function(req, res, next){
    User.find()
    .then(users => res.render('index', { users }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));

    console.log(users);
    /*var query = { name: "hasi" };
    User.find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
  });

  router.get('/data.json', function(req, res, next) {
    var db = req.db;
    db.myCollection.find(function (err, docs) {
        if(err) {
            // Handle error
        } else {
            res.json({title: 'Data', 'mydata': docs});
        }
    });
});

});*/

>>>>>>> hanna
app.post('/user/register', function (req, res) {
   
    const newUser = new User({
        name: req.body.username,
        password: req.body.password
    });
<<<<<<< HEAD

    User.find({name: new RegExp(newUser.name, 'i'), password: new RegExp(newUser.password, 'i')},function(err, data){
        if (err) throw err;
        if (!data.length){
            newUser.save().then(() => res.redirect('/'));
        }else {
            res.render('register');
        }
    });
});

app.post('/registerFailed', function (req, res) {
    res.redirect('/register');
=======
    /*var dbo = res.db("docker-node-mongo");
    dbo.myCollection.insertOne(newUser, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      res.redirect('/');
    })*/

    newUser.save().then(() => res.redirect('/'));
>>>>>>> hanna
});

const port = 3000;

app.listen(port, () => console.log('HIServer running...'));

function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next(); }
}

app.get('/', function (req, res) {
    res.render('login');
});

app.post('/registerbtn', function (req, res) {
    res.render('register');
});


app.post('/login', function (req, res) {
<<<<<<< HEAD

    var user = req.body.username;
        pw = req.body.password;

    User.find({name: new RegExp(user, 'i'), password: new RegExp(pw, 'i')},function(err, data){
        if (!data.length){
            res.redirect('/');
        }else {
            req.session.user = user;
            res.redirect('/chat');
        }
    });
=======

    var user = req.body.username;
        pw = req.body.password;

   /* User.query.byName = function(name){
        return this.where({name: new RegExp(name, 'i')});
    };*/

    User.find({'name': new RegExp(user, 'i')},function(err, data){
        var json = JSON.parse(data);
        console.log(json.name); 
        if(user == json.name)
        {
            res.redirect('/chat');
        };
    });
    /*({
        "name" : { user },
        "password" : { pw }
    }, function(err, cursor){
        if (err) throw err; 
        console.log(cursor);
        cursor.toArray(callback);
        if (callback != null){
            req.session.user = user;
            res.redirect('/chat');
        }

        });
    //.then(items => Auth(items, user), console.log(items))
    //.catch(err => res.status(404).json({ msg: 'No User found' }));
    //res.redirect('/chat');
 
  /*
    var user = req.body.username,
        pw = req.body.password;

    if (user === 'u1' && pw === 'test') {
        req.session.user = 'u1';
    } else if (user === 'u2' && pw === 'test') {
        req.session.user = 'u2';
    } else if (user === 'u3' && pw === 'test') {
        req.session.user = 'u3';
    }
    
    res.redirect('/chat');*/
>>>>>>> hanna
});

function Auth(req, res, items, user) {
    if (items != null) {
        res.redirect('/chat');
        req.session.user = user;
    }
}

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


//app.listen(8080);

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
<<<<<<< HEAD
                    var msg = '{"type": "start", "name1": "' + getPlayer1(name) + '", "name2": "' + getPlayer2(name) + '", "msg":"' + data.msg + '", "msg2":"' + JSON.stringify(getGrid(name)) + '", "msg3":"Spieler ' + getCurrentUserID(name) + ' beginnt"}';
                }
                break;
            case 'board':
                if(setTile(data.msg,name) == 1){
                    var msg = '{"type": "board", "name1": "' + getPlayer1(name) + '", "name2": "' + getPlayer2(name) + '", "msg": "' + JSON.stringify(getGrid(name)) + '", "msg2":"' + getMessage()+'"}';
                    if(getMessage().includes("gewonnen")){
                        deleteGame(name);
                    }
=======
                    var msg = '{"type": "start", "name1": "' + getPlayer1() + '", "name2": "' + getPlayer2() + '", "msg":"' + data.msg + '", "msg2":"' + JSON.stringify(getGrid()) + '", "msg3":"Spieler ' + getCurrentUserID() + ' beginnt"}';
                }
                break;
            case 'board':
                if(setTile(data.msg,name)==1){
                    var msg = '{"type": "board", "name1": "' + getPlayer1() + '", "name2": "' + getPlayer2() + '", "msg": "' + JSON.stringify(getGrid()) + '", "msg2":"' + getMessage()+'"}';
>>>>>>> hanna
                } else {
                    var msg = '{"type": "error", "name": "' + name + '", "msg": "'+ getErrorMessage() +'"}';   
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
<<<<<<< HEAD
var player2, grid, currentUserID;
if(_wait == 0){
  //this._player1 = player;
=======

if(_wait == 0){
>>>>>>> hanna
  this._player1 = player;
  _wait++;
  return 0;
}else{
    //Prüfe, ob Player1 gegen sich selbst spielt 
   /* if(this._player1 == player){
        return 0;
   */// }else{
<<<<<<< HEAD
        /*this._player2 = player;
        this._grid = new Grid ();
        _wait = 0;
        this._currentUserID = this._player1; //Spieler 1 beginnt*/

        player2 = player;
        grid = new Grid ();
        _wait = 0;
        currentUserID = this._player1; 
        
    //}

    for (let i=0; i<this._gameManager.length; i++) {
        
        if(this._gameManager[i] == null){
            this._gameManager[i] = []
            this._gameManager[i][0] = grid;
            this._gameManager[i][1] = this._player1;
            this._gameManager[i][2] = player2;
            this._gameManager[i][3] = currentUserID;
            return 1;
        }
        // return 1;
    }

    }
}

function getGame(name){

    for(i = 0; i<this._gameManager.length; i++){

        if(name == this._gameManager[i][1] || name == this._gameManager[i][2]){
            return i;
        }
    }
}

function deleteGame(name){

    for(let i = 0; i<this._gameManager.length; i++){

        if(name == this._gameManager[i][1] || name == this._gameManager[i][2]){
            this._gameManager[i] = null;
        }
    }
=======
        this._player2 = player;
        this._grid = new Grid ();
        _wait = 0;
        this._currentUserID = this._player1; //Spieler 1 beginnt
        return 1;
    //}
}


>>>>>>> hanna
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

<<<<<<< HEAD
function getGrid(name){

 // return this._grid;
  return this._gameManager[getGame(name)][0];
=======
function getGrid(){

  return this._grid;
>>>>>>> hanna

}

function setTile(column, player){

<<<<<<< HEAD
    var game = getGame(player);

    if(this._gameManager[game][3] == player){ //Prüfe, ob Spieler an der Reihe ist
    //if(column>0 && column<8){ //Prüfe, ob gültiger Zug
            var set;
            switch (this._gameManager[game][3]){
                case this._gameManager[game][1]: set = 1; break;
                case this._gameManager[game][2]: set = 2; break;
            }
            for (let i=5; i>=0; i--) {
                
                if (this._gameManager[game][0][i][column-1] == 0){
                    this._gameManager[game][0][i][column-1] = set;

                    if(checkGameOver(game) == 3){
                        this._Message = 'Unentschieden, niemand hat gewonnen';
                        return 1;
                    }

                    if(checkGameOver(game)==set){
                        this._Message = 'Spieler ' + this._gameManager[game][3] + ' hat gewonnen';
                        return 1; 
                    }

                    switch(this._gameManager[game][3]){
                        case this._gameManager[game][1]: this._gameManager[game][3] = this._gameManager[game][2]; break;
                        case this._gameManager[game][2]: this._gameManager[game][3] = this._gameManager[game][1]; break;
                    } 

                    this._Message = 'Spieler ' + this._gameManager[game][3] + ' an der Reihe';

                    return 1;
                }
            }
        //}
        this._errorMessage = 'Ungültiger Zug, bitte erneut versuchen';
        return 0;
    }
        this._errorMessage = 'Sie sind nicht an der Reihe';
        return 0;

    /*if(this._currentUserID == player){ //Prüfe, ob Spieler an der Reihe ist
    //if(column>0 && column<8){ //Prüfe, ob gültiger Zug
            var set;
            switch (this._currentUserID){
                case this._player1: set = 1; break;
                case this._player2: set = 2; break;
            }
            for (let i=5; i>=0; i--) {
                
                if (this._grid[i][column-1] == 0){
                    this._grid[i][column-1] = set;

                    if(checkGameOver() == 3){
                        this._Message = 'Unentschieden';
                        return 1;
                    }

                    if(checkGameOver()==set){
                        this._Message = 'Spieler ' + this._currentUserID + ' hat gewonnen';
                        return 1; 
                    }

                    switch(this._currentUserID){
                        case this._player1: this._currentUserID = this._player2; break;
                        case this._player2: this._currentUserID = this._player1; break;
                    } 

                    this._Message = 'Spieler ' + this._currentUserID + ' an der Reihe';

                    return 1;
                }
            }
        //}
        this._errorMessage = 'Ungültiger Zug, bitte erneut versuchen';
        return 0;
    }
        this._errorMessage = 'Sie sind nicht an der Reihe';
        return 0;*/
}

function getPlayer1(name){

    //return this._player1;
    return this._gameManager[getGame(name)][1];
  
}

function getPlayer2(name){

    //return this._player2;
    return this._gameManager[getGame(name)][2];
  
}

function getCurrentUserID(name){

    //return this._currentUserID;
    return this._gameManager[getGame(name)][3];
  
}
=======
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

                if(checkGameOver()==set){
                    this._Message = 'Spieler ' + this._currentUserID + ' hat gewonnen';
                    return 1; 
                }

                switch(this._currentUserID){
                    case this._player1: this._currentUserID = this._player2; break;
                    case this._player2: this._currentUserID = this._player1; break;
                } 

                this._Message = 'Spieler ' + this._currentUserID + ' an der Reihe';

                return 1;
            }
        }
    //}
    this._errorMessage = 'Ungültiger Zug, bitte erneut versuchen';
    return 0;
}
    this._errorMessage = 'Sie sind nicht an der Reihe';
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
>>>>>>> hanna

function getMessage(){

    return this._Message;
  
<<<<<<< HEAD
}
=======
  }
>>>>>>> hanna

function getErrorMessage(){

    return this._errorMessage;
  
<<<<<<< HEAD
}


function checkGameOver(game) {
    var flag;
    
    flag = checkBoardFull(game);
	
	if(flag != 0){
		return flag;
    }
    
	flag = checkVerticalGameOver(game);
=======
  }

function checkGameOver() {
	var flag;
	flag = checkVerticalGameOver();
>>>>>>> hanna
	
	if(flag != 0){
		return flag;
	}
	
<<<<<<< HEAD
	flag = checkHorizontalGameOver(game);
=======
	flag = checkHorizontalGameOver();
>>>>>>> hanna
	
	if(flag != 0){
		return flag;
	}
	
<<<<<<< HEAD
	flag = checkDiagonalGameOver(game);
=======
	flag = checkDiagonalGameOver();
>>>>>>> hanna
	
	if(flag != 0){
		return flag;
	}
	
	return 0;
}

<<<<<<< HEAD
function checkBoardFull(game){

    for (let row=0; row<7; row++){
        for (let column=0; column<8; column++) {
			if (this._gameManager[game][0][row][column] == 0){
                return 0;
			}
		}
    }
    
	return 3;

}

function checkVerticalGameOver(game){
=======
function checkVerticalGameOver(){
>>>>>>> hanna

	for (let row=0; row<6; row++){
        for (let column=0; column<4; column++) {
            var flag = true;
<<<<<<< HEAD
			var lowestPlayerTile = this._gameManager[game][0][row][column];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._gameManager[game][0][row][column+i]){
=======
			var lowestPlayerTile = this._grid[row][column];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[row][column+i]){
>>>>>>> hanna
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

<<<<<<< HEAD
function checkHorizontalGameOver(game){
=======
function checkHorizontalGameOver(){
>>>>>>> hanna
  
	for (let column=0; column<7; column++){
        for (let row=0; row<3; row++) {
            var flag = true;
<<<<<<< HEAD
			var lowestPlayerTile = this._gameManager[game][0][row][column];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._gameManager[game][0][row+1][column]){
=======
			var lowestPlayerTile = this._grid[row][column];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[row+1][column]){
>>>>>>> hanna
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

<<<<<<< HEAD
function checkDiagonalGameOver(game){
=======
function checkDiagonalGameOver(){
>>>>>>> hanna
    
    //Diagonal right
	for (let offsetHorizontal=0; offsetHorizontal<4; offsetHorizontal++){
        for (let offsetVertical=0; offsetVertical<4; offsetVertical++) {
            var flag = true;
<<<<<<< HEAD
			var lowestPlayerTile = this._gameManager[game][0][offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._gameManager[game][0][offsetHorizontal+i][offsetVertical+i]){
=======
			var lowestPlayerTile = this._grid[offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[offsetHorizontal+i][offsetVertical+i]){
>>>>>>> hanna
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
	//Diagonal left
	for (let offsetHorizontal=0; offsetHorizontal<3; offsetHorizontal++){
        for (let offsetVertical=6; offsetVertical>2; offsetVertical--) {
            var flag = true;
<<<<<<< HEAD
			var lowestPlayerTile = this._gameManager[game][0][offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._gameManager[game][0][offsetHorizontal+i][offsetVertical-i]){
=======
			var lowestPlayerTile = this._grid[offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != this._grid[offsetHorizontal+i][offsetVertical-i]){
>>>>>>> hanna
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