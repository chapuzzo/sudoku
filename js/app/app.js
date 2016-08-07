'use strict';
(function(){
  var container = document.getElementById('sudoku')

  var sudokuCell = React.createClass({
    getInitialState: function(){
      return {
        status: null,
        value: ''
      }
    },
    handleChange: function(event){
      console.log(this.props)
      var sudoku = this.props.sudoku
      var coords = this.props
      sudoku.input(coords, event.target.value, this.markAs, this.setState.bind(this, {value: event.target.value}))
    },
    markAs: function(type){
      var typesMap = {
        blank: '',
        correct: 'valid',
        wrong: 'invalid'
      }

      if (!Object.keys(typesMap).includes(type)){
        console.error('invalid type specified')
        return
      }

      this.setState({status: typesMap[type]})
    },
    render: function(){
      var containerDiv = React.createElement('div', {className: ['cell', this.state.status].join(' ')},
        React.createElement('input', {maxLength: 1, onChange: this.handleChange, value: this.state.value})
      )
      return containerDiv
    }
  })

  var sudokuSquareRow = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'squareRow'},
        React.createElement(sudokuCell, Object.assign({}, this.props, {col: 0})),
        React.createElement(sudokuCell, Object.assign({}, this.props, {col: 1})),
        React.createElement(sudokuCell, Object.assign({}, this.props, {col: 2}))
      )
      return containerDiv
    }
  })

  var sudokuSquare = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'square'},
        React.createElement(sudokuSquareRow, Object.assign({}, this.props, {row: 0})),
        React.createElement(sudokuSquareRow, Object.assign({}, this.props, {row: 1})),
        React.createElement(sudokuSquareRow, Object.assign({}, this.props, {row: 2}))
      )
      return containerDiv
    }
  })

  var sudokuRow = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'row'},
        React.createElement(sudokuSquare, Object.assign({}, this.props, {squareCol: 0})),
        React.createElement(sudokuSquare, Object.assign({}, this.props, {squareCol: 1})),
        React.createElement(sudokuSquare, Object.assign({}, this.props, {squareCol: 2}))
      )
      return containerDiv
    }
  })

  var sudokuBoard = React.createClass({
    render: function(){
      var containerDiv = React.createElement('div', {className: 'board'},
        React.createElement(sudokuRow, Object.assign({}, this.props, {squareRow: 0})),
        React.createElement(sudokuRow, Object.assign({}, this.props, {squareRow: 1})),
        React.createElement(sudokuRow, Object.assign({}, this.props, {squareRow: 2}))
      )
      return containerDiv
    }
  })

  var sudoku = Sudoku(3)
  window.renderedboard = ReactDOM.render(
    React.createElement(sudokuBoard, {sudoku: sudoku}),
    container
  )

}())