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
*/
function checkGameOver() {

}

function checkVerticalGameOver(){
	var grid = _grid;
	
	for (let i=0; i<6; i++){
        for (let offset=0; offset<3; offset++) {
            var flag = true;
			var lowestPlayerTile = grid[i][offset];
			if (lowestPlayerTile != 0){
				for (let j=0; j<4; j++){
					if (lowestPlayerTile != grid[i][offset+j]){
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

}

function checkDiagonalGameOver(){

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

    this._grid = board;

    Grid.prototype.getGrid = function(){

      return this._grid;
    }
}


