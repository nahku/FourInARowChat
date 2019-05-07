var _grid;
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2

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
                initGame(1,2);
                var msg = '{"type": "start", "name": "' + name + '", "msg":"' + data.msg + '"}';
                break;
            case 'board':
                var tmp = JSON.stringify(getGrid());
                tmp = tmp.split(":")
                var msg = '{"type": "board", "name": "' + name + '", "msg": "' + tmp[1] + '"}';
                break;
        }

        for (var key in connections) {
            if (connections[key] && connections[key].send) {
                connections[key].send(msg);
            }
        }
    });
});

function initGame(player1, player2){
  //je nachdem wer startet ggf. Anfangsspieler auslosen
  _currentUserID = 1;
  _player1 = player1;
  _player2 = player2;
  this._grid = new Grid ();
}

/*app.post('/setTile', function (req, res) {
    var position = req.body.position,
        userID = req.body.userID;

    if(_currentUserID != userID){
      //sende Client Nachricht, dass anderer Spieler dran ist

    }
    else{
      do{
          var correct = grid.setTile(position, userID);
          if(!correct){
            //neue Position von Spieler anfordern
          }
      }while(!correct);

      //sende aktualisiertes Spielfeld an Clients
      //check
      if(_grid.checkGameOver()){
        //sende an clients Winner Player mit userID
      }
      //sende anderem Spieler, er nun an der Reihe
    }
});

function checkGameOver() {

}

function checkVerticalGameOver(){

}

function checkHorizontalGameOver(){

}

function checkDiagonalGameOver(){

}
*/
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
    this._grid = board;

   /*Grid.prototype.getGrid = function(){

      return this._grid;
    }*/

    Grid.prototype.setTile = function (column, player){

      let xMax = 6;
      var set;
      if (player == 'u1'){
        set = 1;
      } else if (player == 'u2'){
        set = 2;
      }
      for (let i=5; i>=0; i--) {
          
          if (this._grid[i][column-1] == 0){
            this._grid[i][column-1] = set; 
            break;
          };
      }
    }
}

function getGrid(){

  return this._grid;

}

function set(column, player){

  let xMax = 6;
  var set;
  if (player == 'u1'){
    set = 1;
  } else if (player == 'u2'){
    set = 2;
  }
  for (let i=5; i>=0; i--) {
      
      if (this._grid[i][column-1] == 0){
        this._grid[i][column-1] = set; 
        break;
      };
  }
}
