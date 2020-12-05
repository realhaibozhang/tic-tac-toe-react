import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className= {"square" + (props.win? ' win': '')}
      onClick={ props.onClick }
    >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        win={this.props.wins.includes(i)}
      />
    );
  }

  render() {
    console.log(this.props)
    return (
      <div>
        {
          // new Array(this.props.rowCount).map(
            new Array(this.props.rowCount).fill(0).map(
            (rowElement, row) => (
              <div className="board-row">
                {
                  new Array(this.props.colCount).fill(0).map((colElement, col) => (
                    this.renderSquare(col + row * this.props.colCount)
                  ))
                }
              </div>
            )
          )
        }
      </div>
    );
  }
}

const SORT = {
  ASC: 0,
  DESC: 1,
}

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        loc: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: SORT.ASC,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[this.state.stepNumber].squares.slice();
    if (squares[i] || calculateWinner(squares, [])) {
      return;
    }

    console.log(squares, i);
    squares[i] = this.state.xIsNext? 'X': 'O';
    this.setState({
      history: history.concat({squares: squares, loc: i}),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
    });
  }

  goToRound(i) {
    const xIsNext = this.state.stepNumber % 2 === 1;
    this.setState({
      xIsNext,
      stepNumber: i,
    });
  }

  toggleSort() {
    const sort = this.state.sort === SORT.ASC? SORT.DESC: SORT.ASC;
    this.setState({
      sort,
    });
  }

  render() {
    const history = this.state.history;
    const squares = history[this.state.stepNumber].squares;
    const winIndexes = [];
    const winner = calculateWinner(squares, winIndexes);
    console.log(winIndexes);
    let status;

    if (winner) {
      status = 'Winner is ' + winner;
    } else if (this.state.stepNumber === 3 * 3) {
      status = "It's a draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
    }

    let historyDisplay = [];
    if (this.state.sort === SORT.DESC) {
      for (let i = history.length -1; i >= 0; --i) {
        historyDisplay.push(history[i])
      }
    } else {
      historyDisplay = history;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            onClick = {(i) => this.handleClick(i)}
            squares={squares}
            xIsNext={this.state.xIsNext}
            rowCount={3}
            colCount={3}
            wins={winIndexes}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleSort()}>{this.state.sort === SORT.ASC? '/\\' : '\\/'}</button>
          <ol>
            {
            historyDisplay.map((board, i) => {
              const row = Math.floor(i / 3);
              const col = Math.floor(i % 3);
              const player = i % 2 === 1? 'X': 'O';
              const desc = i ? `Player ${player}: row ${row}, col ${col}`: 'Go start initial start';
              return (
              <li key={i}>
                <button onClick={() => this.goToRound(i)} className={this.state.stepNumber === i? 'current-step': ''}>{desc}</button>
              </li>
              )
            })
          }
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  
function calculateWinner(squares, wins) {
  const lines = []
  // check rows
  for (let row = 0; row < 3; ++row) {
    lines.push([row * 3, row * 3 + 1, row * 3 + 2]);
  }

  // check cols
  for (let col = 0; col < 3; ++ col) {
    lines.push([col, 3 + col, 3 * 2 + col]);
  }

  // check corners
  lines.push([0, 4, 8]);
  lines.push([2, 4, 6]);

  // console.log(squares, lines);
  for (const [a, b, c] of lines) {
    if (squares[a] === squares[b] && squares[a] === squares[c] && ['X', 'O'].includes(squares[a])) {
      wins.push(a, b, c);
      return squares[a];
    }
  }

  return null;
}