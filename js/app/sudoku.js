'use strict';

function Sudoku(size){
  var board = []

  for (var w=0; w < size; w++){
    board.push([])
    for (var x=0; x < size; x++){
      board[w].push([])
      for (var y=0; y < size; y++){
        board[w][x].push([])
        for (var z=0; z < size; z++){
          board[w][x][y][z] = null;
        }
      }
    }
  }

  var _checkCell = function(coords){
    var value = board[coords.squareRow][coords.squareCol][coords.row][coords.col]

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


  var _input = function(coords, value, statusCallback, valueCallback){
    board[coords.squareRow][coords.squareCol][coords.row][coords.col] = value

    if (_checkCell(coords))
      valueCallback()

    if (value.length == 0){
      statusCallback('blank')
      return
    }

    var resultMap = {
      true: 'correct',
      false: 'wrong'
    }

    statusCallback(resultMap[ _checkSquare(coords) && _checkRow(coords) && _checkCol(coords)])
  }

  var _output = function(coords){
    return board[coords.squareRow][coords.squareCol][coords.row][coords.col]
  }

  var _log = function(){
    console.log(board)
  }

  return {
    input: _input,
    output: _output
  }
}
