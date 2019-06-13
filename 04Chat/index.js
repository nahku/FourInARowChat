global._grid = null;
global._gameManager = new Array(10); //Array, das mehrere Spieler und Spielfelder verwaltet
global._wait = 0;
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2
var _errorMessage;
var _Message;
var express = require('express');
var app = express(); //Einbinden des Express-Frameworks
const mongoose = require('mongoose'); //Einbinden von Mongoose-Funktionalitaeten
const User = require('./js/user');  //Einbinden des definierten Datenbankschemas
const port = 3000;        //Definieren des internen Ports, auf dem der Server laeuft

//Session-Handeling
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js', express.static(__dirname + '/js'));

//Order, in dem die View-Files abgelegt sind
//Einbinden von JADE
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

//Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(port, () => console.log('HIServer running...'));

//Session-Check
function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        next(); }
}

//Startseite der Anwendung
app.get('/', function (req, res) {
    res.render('login');
});

//Weiterleitung nach Klicken des Registerbuttons auf der Startseite
app.post('/registerbtn', function (req, res) {
    res.render('register');
});

//Aktion, die ausgefuehrt wird, nachdem der Registerbutton geklickt wurde 
//Bei erfolgreicher Registrierung wird der User in der Datenbank gespeichert
app.post('/user/register', function (req, res) {
   
    const newUser = new User({
        name: req.body.username,
        password: req.body.password
    });

    User.find({name: new RegExp(newUser.name, 'i'), password: new RegExp(newUser.password, 'i')},function(err, data){
        if (err) throw err;
        if (!data.length){
            newUser.save().then(() => res.redirect('/'));
        }else {
            res.render('register');
        }
    });
});

//Diese Funktion wird nach Klicken des Loginbuttons ausgefuehrt
//Ueberpruefung der Login-Daten
app.post('/login', function (req, res) {

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
});

//User wird der aktuellen Session hinzugefuegt
app.get('/chat', checkAuth, function (req, res) {
    res.render('chat', {user: req.session.user});
});

//Nach dem Logout wird der User aus der aktuellen Session geloescht
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

//Hier wird der Websocket-Server definiert
var WSS = require('websocket').server,
    http = require('http');

var server = http.createServer();
server.listen(8181);

var wss = new WSS({
    httpServer: server,
    autoAcceptConnections: false
});

var connections = {};
//Im Nachfolgenden ist aufgelistet, wie der Server reagiert, wenn er eine Request-Anfrage bekommt
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
                    var msg = '{"type": "start", "name1": "' + getPlayer1(name) + '", "name2": "' + getPlayer2(name) + '", "msg":"' + data.msg + '", "msg2":"' + JSON.stringify(getGrid(name)) + '", "msg3":"Spieler ' + getCurrentUserID(name) + ' beginnt"}';
                }
                break;
            case 'board':
                if(setTile(data.msg,name) == 1){
                    var msg = '{"type": "board", "name1": "' + getPlayer1(name) + '", "name2": "' + getPlayer2(name) + '", "msg": "' + JSON.stringify(getGrid(name)) + '", "msg2":"' + getMessage()+'"}';
                    if(getMessage().includes("gewonnen")){
                        deleteGame(name);
                    }
                } else {
                    var msg = '{"type": "error", "name": "' + name + '", "msg": "'+ getErrorMessage() +'"}';   
                }
                break;
        }

        for (var key in connections) {
            if (connections[key] && connections[key].send) {
                connections[key].send(msg);
            }
        }
    });
});


//Methode, um ein neues Spielfeld zu erstellen
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

//In dieser Funktion wird das Spiel gestartet und geprueft, ob es bereits einen Gegenspieler gibt
function initGame(player){

  var player2, grid, currentUserID;

  if(_wait == 0){

      this._player1 = player;
      _wait++;
      return 0;

  }else{

      player2 = player;
      grid = new Grid ();
      _wait = 0;
      currentUserID = this._player1; 
        
      for (let i=0; i<this._gameManager.length; i++) {
            
        if(this._gameManager[i] == null){
        
          this._gameManager[i] = []
          this._gameManager[i][0] = grid;
          this._gameManager[i][1] = this._player1;
          this._gameManager[i][2] = player2;
          this._gameManager[i][3] = currentUserID;
          return 1;

        }
      }
  }
}

//Get-Methode, um ein Spiel (Spielfeld, Spieler1, Spieler2, aktueller Spieler) zu erhalten
//Paramter name: ein Spieler mit diesem Namen ist ein Spieler des Spieles, das gefunden werden soll
function getGame(name){

    for(i = 0; i<this._gameManager.length; i++){

        if(name == this._gameManager[i][1] || name == this._gameManager[i][2]){
            return i;
        }
    }
}

//Get-Methode, um ein Spielfeld zu bekommen
//Paramter name: ein Spieler mit diesem Namen ist ein Spieler des Spieles, das gefunden werden soll
function getGrid(name){

  return this._gameManager[getGame(name)][0];
}

//Get-Methode, um den Namen des ersten Spielers eines Spieles zu bekommen
//Paramter name: ein Spieler mit diesem Namen ist ein Spieler des Spieles, das gefunden werden soll
function getPlayer1(name){

    //return this._player1;
    return this._gameManager[getGame(name)][1];
  
}

//Get-Methode, um den Namen des zweiten Spielers eines Spieles zu bekommen
//Paramter name: ein Spieler mit diesem Namen ist ein Spieler des Spieles, das gefunden werden soll
function getPlayer2(name){

    //return this._player2;
    return this._gameManager[getGame(name)][2];
  
}

//Get-Methode, um den Namen des Spielers, der aktuell an der Reihe ist, eines Spieles zu bekommen
//Paramter name: ein Spieler mit diesem Namen ist ein Spieler des Spieles, das gefunden werden soll
function getCurrentUserID(name){

    //return this._currentUserID;
    return this._gameManager[getGame(name)][3];
  
}

//Get-Methode, um die die zu sendene Nachricht zu erhalten
function getMessage(){

    return this._Message;
  
}

//Get-Methode, um die zu sendene Error-Nachricht zu erhalten
function getErrorMessage(){

    return this._errorMessage;
  
}


//Mit dieser Funktion kann ein Stein im Spiel gesetzt werden
//Paramter column: in diese Spalte soll der Stein gesetzt werden
//Paramter player: Name des Spielers, der den Stein setzen will
function setTile(column, player){

    var game = getGame(player);

    if(this._gameManager[game][3] == player){     //Prüfe, ob Spieler an der Reihe ist

            var set;
            switch (this._gameManager[game][3]){
                case this._gameManager[game][1]: set = 1; break;
                case this._gameManager[game][2]: set = 2; break;
            }

            for (let i=5; i>=0; i--) { //Pruefe, in welche Reihe der Stein gelegt wird
                
                if (this._gameManager[game][0][i][column-1] == 0){

                    this._gameManager[game][0][i][column-1] = set;

                    //Pruefung auf Spielende
                    if(checkGameOver(game) == 3){
                        this._Message = 'Unentschieden, niemand hat gewonnen';
                        return 1;
                    }

                    if(checkGameOver(game)==set){
                        this._Message = 'Spieler ' + this._gameManager[game][3] + ' hat gewonnen';
                        return 1; 
                    }
                    //Aktueller Spieler wird gaendert
                    switch(this._gameManager[game][3]){
                        case this._gameManager[game][1]: this._gameManager[game][3] = this._gameManager[game][2]; break;
                        case this._gameManager[game][2]: this._gameManager[game][3] = this._gameManager[game][1]; break;
                    } 

                    this._Message = 'Spieler ' + this._gameManager[game][3] + ' an der Reihe';

                    return 1;
                }
            }
      
        this._errorMessage = 'Ungültiger Zug, bitte erneut versuchen';
        return 0;
    }
        this._errorMessage = 'Sie sind nicht an der Reihe';
        return 0;
}

//Pruefe, ob das Spiel gewonnen wurde
function checkGameOver(game) {
    var flag;
    
    flag = checkBoardFull(game);
               
               if(flag != 0){
                              return flag;
    }
    
               flag = checkVerticalGameOver(game);
               
               if(flag != 0){
                              return flag;
               }
               
               flag = checkHorizontalGameOver(game);
               
               if(flag != 0){
                              return flag;
               }
               
               flag = checkDiagonalGameOver(game);
               
               if(flag != 0){
                              return flag;
               }
               
               return 0;
}

//Pruefe, ob das Spielffeld voll und das Spiel somit unentschieden ist
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

               for (let row=0; row<6; row++){
        for (let column=0; column<4; column++) {
            var flag = true;
                                            var lowestPlayerTile = this._gameManager[game][0][row][column];
                                            if (lowestPlayerTile != 0){
                                                           for (let i=1; i<4; i++){
                                                                          if (lowestPlayerTile != this._gameManager[game][0][row][column+i]){
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

function checkHorizontalGameOver(game){
  
               for (let column=0; column<7; column++){
        for (let row=0; row<3; row++) {
            var flag = true;
                                            var lowestPlayerTile = this._gameManager[game][0][row][column];
                                            if (lowestPlayerTile != 0){
                                                           for (let i=1; i<4; i++){
                                                                          if (lowestPlayerTile != this._gameManager[game][0][row+1][column]){
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

function checkDiagonalGameOver(game){
    
    //Diagonal right
               for (let offsetHorizontal=0; offsetHorizontal<4; offsetHorizontal++){
        for (let offsetVertical=0; offsetVertical<4; offsetVertical++) {
            var flag = true;
                                            var lowestPlayerTile = this._gameManager[game][0][offsetHorizontal][offsetVertical];
                                            if (lowestPlayerTile != 0){
                                                           for (let i=1; i<4; i++){
                                                                          if (lowestPlayerTile != this._gameManager[game][0][offsetHorizontal+i][offsetVertical+i]){
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
                                            var lowestPlayerTile = this._gameManager[game][0][offsetHorizontal][offsetVertical];
                                            if (lowestPlayerTile != 0){
                                                           for (let i=1; i<4; i++){
                                                                          if (lowestPlayerTile != this._gameManager[game][0][offsetHorizontal+i][offsetVertical-i]){
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


//Methode, um nach Spielende das Spielfeld zu loeschen
//Paramter name: ein Spieler mit diesem Namen ist ein Spieler des Spieles, das geloescht werden soll
function deleteGame(name){

    for(let i = 0; i<this._gameManager.length; i++){

        if(name == this._gameManager[i][1] || name == this._gameManager[i][2]){
            this._gameManager[i] = null;
        }
    }
}