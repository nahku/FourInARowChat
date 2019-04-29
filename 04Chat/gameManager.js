var _express = require('express');
var _app = express();

var _grid;
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2
function initGame(player1, player2){
  //je nachdem wer startet ggf. Anfangsspieler auslosen
  _currentUserID = 1;
  _player1 = player1;
  _player2 = player2;
}

app.post('/setTile', function (req, res) {
    var position = req.body.position,
        userID = req.body.userID;

    if(_currentUserID != userID){
      //sende Client Nachricht, dass anderer Spieler dran ist

    }
    else{
      do{
          var correct = grid.setTile(position, userID));
          if(!correct){
            //neue Position von Spieler anfordern
          }
      }while(!correct);

      //sende aktualisiertes Spielfeld an Client
      //check
      if(_grid.checkGameOver()){
        //sende an clients Winner Player mit userID
      }
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
