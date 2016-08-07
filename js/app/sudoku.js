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

      _input(coords, 2, function(){}, function(){})
    }
  }


  var _checkCell = function(coords, value){
    return value === '' || (value > 0) && (value <= Math.pow(size, 2))
  }

  var _checkSquare = function(coords){
    var square = board[coords.squareRow][coords.squareCol]
    var resultingArray = square.reduce(function(prev, curr){
      return prev.concat(curr)
    }, [])

    return resultingArray
      .filter(
        (x) => x != null && x != ''
      )
      .every(
        (x, _, array) =>
          array.filter(
            (y) => x == y
          ).length < 2
      )
  }

  var _checkRow = function(coords){
    var squareRow = board[coords.squareRow]

    var resultingArray = squareRow.reduce(function(prev, curr){
      return prev.concat(curr[coords.row])
    }, [])

    return resultingArray
      .filter(
        (x) => x != null && x != ''
      )
      .every(
        (x, _, array) =>
          array.filter(
            (y) => x == y
          ).length < 2
      )
  }

  var _checkCol = function(coords){
    var resultingArray = board.reduce(function(prev, curr){
      return prev.concat(curr[coords.squareCol])
    }, []).reduce(function(prev, curr){
      return prev.concat(curr[coords.col])
    }, [])

    return resultingArray
      .filter(
        (x) => x != null && x != ''
      )
      .every(
        (x, _, array) =>
          array.filter(
            (y) => x == y
          ).length < 2
      )
  }

  var _log = function(){
    console.log(board)
  }

  var _input = function(coords, value, statusCallback, valueCallback){
    console.log(value)

    if (_checkCell(coords, value)){
      valueCallback(value, function(){ console.log(arguments) })
    }

    board[coords.squareRow][coords.squareCol][coords.row][coords.col] = value

    if (value.length == 0){
      statusCallback('blank', function(){ console.log(arguments) })
      return
    }

    var resultMap = {
      true: 'correct',
      false: 'wrong'
    }

    _log()
    statusCallback(resultMap[ _checkSquare(coords) && _checkRow(coords) && _checkCol(coords)], function(){ console.log(arguments) })
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
