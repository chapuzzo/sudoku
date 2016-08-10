'use strict';

function Sudoku(size, callback){
  var board = []

  var maxValue = Math.pow(size, 2)

  var boardCells = Math.pow(size, 4)

  var _noop = () => {}

  var _position = () => _.random(size - 1)

  var _inverse = (position) => (size * 2 - 1 - position) % size

  var _removeNullOrEmpty = (x) => !(x == null || x == '')

  var _hasNoDuplicate = (who) =>
    (x) => who != x

  var _occupation = () => _.filter(_.flattenDeep(board), _removeNullOrEmpty).length

  var _log = () => console.log(board)

  var _createBoard = function(){
    board = []
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

  var _seed = function(hollows, callback){

    _createBoard()

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

    _.times(10, function(){

      var squareCol = _position()
      if (_.random()) _swapCols(board, squareCol, _position(), squareCol, _position())

      var squareRow = _position()
      if (_.random()) _swapRows(board, squareRow, _position(), squareRow, _position())

      if (_.random())
        _horizontalSwap(board)
      if (_.random())
        _verticalSwap(board)
      if (_.random())
        _upperDiagonalSwap(board)
      if (_.random())
        _lowerDiagonalSwap(board)
    })

    while (_occupation() > (boardCells - hollows)) {
      var coords = {
        squareRow: _position(),
        squareCol: _position(),
        row: _position(),
        col: _position()
      }

      _input(coords, '', _noop, _noop)
    }

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

  var _verticalSwap = (board) => {
    _swapCols(board, 0, 0, 2, 2)
    _swapCols(board, 0, 1, 2, 1)
    _swapCols(board, 0, 2, 2, 0)
  }

  // var _verticalSwapBlock = function(){
  //   _swapCols(board, 0, 0, 0, 2)
  //   _swapCols(board, 1, 0, 1, 2)
  //   _swapCols(board, 2, 0, 2, 2)
  // }

  var _swapRows = (board, firstSquareRow, firstRow, secondSquareRow, secondRow) => {
    _.times(size, function(squareCol){
      _.times(size, function(col){
        var tmp = board[firstSquareRow][squareCol][firstRow][col]
        board[firstSquareRow][squareCol][firstRow][col] = board[secondSquareRow][squareCol][secondRow][col]
        board[secondSquareRow][squareCol][secondRow][col] = tmp
      })
    })
  }

  var _horizontalSwap = (board) => {
    _swapRows(board, 0, 0, 2, 2)
    _swapRows(board, 0, 1, 2, 1)
    _swapRows(board, 0, 2, 2, 0)
  }

  // var _horizontalSwapBlock = function(){
  //   _swapRows(board, 0, 0, 0, 2)
  //   _swapRows(board, 1, 0, 1, 2)
  //   _swapRows(board, 2, 0, 2, 2)
  // }

  var _upperDiagonalSwap = function(board){
    _.times(size, function(squareRow){
      _.times(size, function(row){
        _.times(size, function(squareCol){
          _.times(size, function(col){

            var y = squareRow * size + row
            var x = squareCol * size + col

            if (!((x+y) < 8)) return

            var tmp = board[squareRow][squareCol][row][col]
            board[squareRow][squareCol][row][col] = board[_inverse(squareCol)][_inverse(squareRow)][_inverse(col)][_inverse(row)]
            board[_inverse(squareCol)][_inverse(squareRow)][_inverse(col)][_inverse(row)] = tmp
          })
        })
      })
    })
  }

  var _lowerDiagonalSwap = function(board){
    _.times(size, function(squareRow){
      _.times(size, function(row){
        _.times(size, function(squareCol){
          _.times(size, function(col){

            var y = squareRow * size + row
            var x = squareCol * size + col

            if (x <= y) return

            var tmp = board[squareRow][squareCol][row][col]
            board[squareRow][squareCol][row][col] = board[squareCol][squareRow][col][row]
            board[squareCol][squareRow][col][row] = tmp
          })
        })
      })
    })
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

  return {
    input: _input,
    output: _output,
    size: size,
    seed: _seed
  }
}
