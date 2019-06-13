//var _express = require('express');
//var _app = express();

var _grid;
var _currentUserID; //Spieler, der aktuell an der Reihe ist
var _player1; //Spieler 1
var _player2; //Spieler 2
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
*/

function test(){
	let board = [];
	for (let i=0; i<6; i++) {
        
        board[i] = [];

        for (let j=0; j<7; j++) {
            board[i][j] = 0;
			if(i == j){
				board[i][j] = 3;
			}
        }
    }
	
	this._grid = board;
	
	console.log(checkGameOver());
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
	var grid = _grid;
	
	for (let column=0; column<6; column++){
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
	var grid = _grid;
	
	for (let column=0; column<6; column++){
        for (let offset=0; offset<4; offset++) {
            var flag = true;
			var lowestPlayerTile = grid[offset][column];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != grid[offset+i][column]){
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
	var grid = _grid;
	
	for (let offsetHorizontal=0; offsetHorizontal<4; offsetHorizontal++){
        for (let offsetVertical=0; offsetVertical<4; offsetVertical++) {
            var flag = true;
			var lowestPlayerTile = grid[offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != grid[offsetHorizontal+i][offsetVertical+i]){
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
	
	for (let offsetHorizontal=3; offsetHorizontal<7; offsetHorizontal++){
        for (let offsetVertical=0; offsetVertical<3; offsetVertical++) {
            var flag = true;
			var lowestPlayerTile = grid[offsetHorizontal][offsetVertical];
			if (lowestPlayerTile != 0){
				for (let i=1; i<4; i++){
					if (lowestPlayerTile != grid[offsetHorizontal-i][offsetVertical+i]){
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

   /* Grid.prototype.getGrid = function(){

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



