'use strict';

function Sudoku(size, callback){
  var board = []

  var _noop = () => {}

  var _position = () => _.random(size - 1)

  var _removeNullOrEmpty = (x) => !(x == null || x == '')

  var _hasNoDuplicate = (who) =>
    (x) => who != x

  var _occupation = () => _.filter(_.flattenDeep(board), _removeNullOrEmpty).length

  var _log = () => console.log(board)

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

              var y = squareRow * size + row
              var x = squareCol * size + col
              var value = (y * size + squareRow + x) % maxValue + 1

              if (_validGuess(coords, value))
                _input(coords, value, _noop, _noop)
          })
        })
      })
    })

    if (_.random())
      _verticalSwap()

    callback()
  }

  var _swapCols = (board, firstSquareCol, firstCol, secondSquareCol, secondCol) => {

    _.times(size, function(squareRow){
      _.times(size, function(row){
        var tmp = board[squareRow][firstSquareCol][row][firstCol]
        board[squareRow][firstSquareCol][row][firstCol] = board[squareRow][secondSquareCol][row][secondCol]
        board[squareRow][secondSquareCol][row][secondCol] = tmp
      })
    })
  }

  var _verticalSwap = (board)=>{
    _swapCols(board, 0, 0, 2, 2)
    _swapCols(board, 0, 1, 2, 1)
    _swapCols(board, 0, 2, 2, 0)
    _swapCols(board, 1, 0, 1, 2)
  }

  var _checkCell = function(coords, value){
    return value === '' || (value > 0) && (value <= Math.pow(size, 2))
  }

  var _checkValid = (array, value) => {

    var result = array
      .filter(
        _removeNullOrEmpty
      )
      .every(
        _hasNoDuplicate(value)
      )

      if (!result)
        console.log(array, value)

      return result
  }

  var _checkSquare = function(coords, value){
    var squareCells = board[coords.squareRow][coords.squareCol]
    var square = squareCells.reduce(function(prev, curr){
      return prev.concat(curr)
    }, [])

    return _checkValid(square, value)
  }

  var _checkRow = function(coords, value){
    var rowCells = board[coords.squareRow]

    var row = rowCells.reduce(function(prev, curr){
      return prev.concat(curr[coords.row])
    }, [])

    return _checkValid(row, value)
  }

  var _checkCol = function(coords, value){
    var col = board.reduce(function(prev, curr){
      return prev.concat(curr[coords.squareCol])
    }, []).reduce(function(prev, curr){
      return prev.concat(curr[coords.col])
    }, [])

    return _checkValid(col, value)
  }

  var _validGuess = function(coords, value){
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
      statusCallback(resultMap[ _validGuess(coords, value) ], _noop)

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
