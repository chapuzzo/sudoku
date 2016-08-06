'use strict'
;(function(){
  var container = document.getElementById('sudoku')

  var sudokuCell = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'cell'},
        React.createElement('input', {maxLength: 1})
      )
      return containerDiv
    }
  })

  var sudokuSquareRow = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'squareRow'},
        React.createElement(sudokuCell),
        React.createElement(sudokuCell),
        React.createElement(sudokuCell)
      )
      return containerDiv
    }
  })

  var sudokuSquare = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'square'},
        React.createElement(sudokuSquareRow),
        React.createElement(sudokuSquareRow),
        React.createElement(sudokuSquareRow)
      )
      return containerDiv
    }
  })

  var sudokuRow = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'row'},
        React.createElement(sudokuSquare),
        React.createElement(sudokuSquare),
        React.createElement(sudokuSquare)
      )
      return containerDiv
    }
  })

  var sudokuBoard = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'board'},
        React.createElement(sudokuRow),
        React.createElement(sudokuRow),
        React.createElement(sudokuRow)
      )
      return containerDiv
    }
  })

  ReactDOM.render(
    React.createElement(sudokuBoard),
    container
  )

}())
