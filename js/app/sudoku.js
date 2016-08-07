'use strict';

function Sudoku(size){
  var board = []

  var _init = function(){
    for (var w=0; w < size; w++){
      board.push([])
      for (var x=0; x < size; x++){
        board[w].push([])
        for (var y=0; y < size; y++){
          board[w][x].push([])
          for (var z=0; z < size; z++){
            board[w][x][y][z] = '';
          }
        }
      }
    }

    _seed()
  }

  var _seed = function(){
    for (var i = 1; i <= Math.pow(size, 2); i++){
      var squareRow = (Math.random() * Math.pow(size - 1, 1)).toFixed(0)
      var squareCol = (Math.random() * Math.pow(size - 1, 1)).toFixed(0)
      var row = (Math.random() * Math.pow(size - 1, 1)).toFixed(0)
      var col = (Math.random() * Math.pow(size - 1, 1)).toFixed(0)

      var coords = {
        squareRow: squareRow,
        squareCol: squareCol,
        row: row,
        col: col
      }

      if (validGuess(coords, i))
        _input(coords, i, function(){}, function(){})
    }
  }

  var _checkCell = function(coords, value){
    return value === '' || (value > 0) && (value <= Math.pow(size, 2))
  }

  var _removeNullOrEmpty = (x) => !(x == null || x == '')

  var _hasNoDuplicate = function(who){
    // return (x, _, array) =>
    //   array.filter(
    //     (y) => x == y
    //   ).length < 2

    // return (x) => x != who
    return function(x){
      // console.log(arguments)
      console.log(x + ' vs. ' + who)
      return who != x
    }
  }


  var _checkSquare = function(coords, value){
    var square = board[coords.squareRow][coords.squareCol]
    var resultingArray = square.reduce(function(prev, curr){
      return prev.concat(curr)
    }, [])

    return resultingArray
      .filter(
        _removeNullOrEmpty
      )
      .every(
        _hasNoDuplicate(value)
      )
  }

  var _checkRow = function(coords, value){
    var squareRow = board[coords.squareRow]

    var resultingArray = squareRow.reduce(function(prev, curr){
      return prev.concat(curr[coords.row])
    }, [])

    return resultingArray
      .filter(
        _removeNullOrEmpty
      )
      .every(
        _hasNoDuplicate(value)
      )
  }

  var _checkCol = function(coords, value){
    var resultingArray = board.reduce(function(prev, curr){
      return prev.concat(curr[coords.squareCol])
    }, []).reduce(function(prev, curr){
      return prev.concat(curr[coords.col])
    }, [])

    return resultingArray
      .filter(
        _removeNullOrEmpty
      )
      .every(
        _hasNoDuplicate(value)
      )
  }

  var _log = function(){
    console.log(board)
  }

  var validGuess = function(coords, value){
    return _checkSquare(coords, value) && _checkRow(coords, value) && _checkCol(coords, value)
  }

  var _input = function(coords, value, statusCallback, valueCallback){

    if (!_checkCell(coords, value))
      return

    var resultMap = {
      true: 'correct',
      false: 'wrong'
    }

    if (value.length == 0)
      statusCallback('blank', function(){ _log() })
    else
      statusCallback(resultMap[ validGuess(coords, value) ], function(){ console.log('length > 0, guess: ' + validGuess); _log() })

    board[coords.squareRow][coords.squareCol][coords.row][coords.col] = value
    valueCallback(value, function(){ console.log('valid cell') })
  }

  var _output = function(coords){
    return board[coords.squareRow][coords.squareCol][coords.row][coords.col]
  }

  _init()

  return {
    input: _input,
    output: _output
  }
}
