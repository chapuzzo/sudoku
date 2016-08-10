'use strict';

function Sudoku(size, callback){
  var board = []

  var _noop = () => {}

  var _position = () => _.random(size - 1)

  var _init = function(){
    _.times(size, (squareRow) => {
      board.push([])
      _.times(size, (squareCol) => {
        board[squareRow].push([])
        _.times(size, (row) => {
          board[squareRow][squareCol].push([])
          _.times(size, (col) => {
            board[squareRow][squareCol][row][col] = '';
          })
        })
      })
    })
  }

  var _occupation = function(){
    return _.filter(_.flattenDeep(board), _removeNullOrEmpty).length
  }

  var _seed = function(callback){
    var maxValue = Math.pow(size, 2)

    _.times(size, function(squareRow){
      _.times(size, function(row){
        _.times(size, function(squareCol){
          _.times(size, function(col){

              var coords = {
                squareRow: squareRow,
                squareCol: squareCol,
                row: row,
                col: col
              }

              var i_x_n = squareRow * size + col
              var i_d_n = squareRow
              var j = squareCol * size + row
              var n_n = maxValue

              var value = (i_x_n + i_d_n + j) % n_n + 1
              _input(coords, value, _noop, _noop)
          })
        })
      })
    })

    callback()
  }

  var _checkCell = function(coords, value){
    return value === '' || (value > 0) && (value <= Math.pow(size, 2))
  }

  var _removeNullOrEmpty = (x) => !(x == null || x == '')

  var _hasNoDuplicate = function(who){
    return (x) => who != x
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
      statusCallback('blank', _noop)
    else
      statusCallback(resultMap[ validGuess(coords, value) ], _noop)

    board[coords.squareRow][coords.squareCol][coords.row][coords.col] = value
    valueCallback(value, _noop)
  }

  var _output = function(coords){
    return board[coords.squareRow][coords.squareCol][coords.row][coords.col]
  }

  _init()

  return {
    input: _input,
    output: _output,
    size: size,
    seed: _seed
  }
}
