//var _express = require('express');
//var _app = express();

var _grid = new Grid();
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2
function initGame(player1, player2){
  //je nachdem wer startet ggf. Anfangsspieler auslosen
  _currentUserID = 1;
  _player1 = player1;
  _player2 = player2;
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
class Grid(){

  constructor (){
    let yMax = 7;
    let xMax = 6;
    let board = [];

    for (let i=0; i<xMax; i++) {
        
        board[i] = [];

        for (let j=0; j<yMax; j++) {
            board[i][j] = 0;
        }
    }}
}

function getGrid(){

  return _grid;
}