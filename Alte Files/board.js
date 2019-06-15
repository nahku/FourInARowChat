function Board(){

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