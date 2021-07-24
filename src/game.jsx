import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import get from './utils/get'
import './styles.css';

const socket = io.connect("http://localhost:3000");

function Game() {
  const defaultPlayers = {
    player1: {
      name: '',
      score: 0
    },
    player2: {
      name: '',
      score: 0
    }
  };

  const [action, setAction] = useState({})
  const [message, setMessage] = useState('')
  const [roomId, setRoomId] = useState()
  const [players, setPlayers] = useState(defaultPlayers)
  const [isStarter, setIsStarter] = useState(false)
  const [canPlay, setCanPlay] = useState(true)


  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("gameCreated",(data) => {
      console.log(data)
      setRoomId(data.roomId)
      setMessage(`Waiting for player to join at room ${data.roomId}...`)
    })
  
    socket.on("newPlayerJoinEvent",(data) => {
      initializeGame(data);
    })

    return function() {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on("scoreProcessed",(data) => {
      setCanPlay(true)
      if(data.isWin === 'draw'){
          setMessage('Its a drawn!')
      } else {
          updateScores(data)
      }
    })
  }, [])

  const updateScores = (data) => {
    const winner = isStarter === data.isWin ? 'player1' : 'player2'
    setPlayers(prevPlayers => {
      setMessage(`${get(prevPlayers[winner], 'name')} has won!`)
      prevPlayers[winner].score++
      return prevPlayers
    })
  }

  const initializeGame=(data) => {
    setPlayers({
      player1: {
        name: data.currentPlayer,
        score: 0
      },
      player2: {
        name: data.opponent,
        score: 0
      }
    })
    console.log('innitializing game', data)
    setMessage(`${data.opponent} has joined game`)
  }

  const handleStart = () => {
      if (action.name === 'create') {
        setIsStarter(true)
        socket.emit('createGame', { name: action.playerName });
      }
      if (action.name === 'join') {
        socket.emit('joinGameEvent', { roomId: action.gameRoomId, name: action.playerName });
        setRoomId(action.gameRoomId)
      }
  }

  const handleExit = (value) => {
    setCanPlay(false)
    setMessage('Exitting game...')
    socket.emit('userLeft', {
        roomId : roomId,
        [isStarter ? 'currentPlayer' : 'opponent'] : value
    });
    setRoomId(null)
    setAction({})
    setPlayers(defaultPlayers)
    socket.disconnect()
    setMessage('')
  }

  const handleSelection = (value) => {
    setCanPlay(false)
    setMessage(`Waiting for opponent...`)
    socket.emit('userPlayed', {
        roomId : roomId,
        [isStarter ? 'currentPlayer' : 'opponent'] : value
    });
  }

  const ready = canPlay && roomId && get(players, 'player1.name') && get(players, 'player2.name')

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Rock Paper Scissors
        </p>
        <p className='message'>{message}</p>
        {ready ? <div className='game'>
          <div className='players'>
            <div className='player'>{get(players, 'player1.name')}</div>
            <div className='player'>{get(players, 'player2.name')}</div>
            <span className='score'>{get(players, 'player1.score', 0)}</span> : <span className='score'>{get(players, 'player2.score', 0)}</span>
          </div>
          <h5>Play</h5>
          <div className='choices'>
            <img className='choice' onClick={() => handleSelection('Rock')} width={100} height={100} src='/rock.png' alt='Rock' />
            <img className='choice' onClick={() => handleSelection('Paper')} width={100} height={100} src='/paper.png' alt='Paper' />
            <img className='choice' onClick={() => handleSelection('Scissor')} width={100} height={100} src='/scissor.png' alt='Scissors' />
          </div>
          <button
            className="exit-btn"
            rel="noopener noreferrer"
            onClick={() => handleExit()}
          >
            Exit
        </button>
        </div> :
        !roomId && <SetupForm action={action} onChange={setAction} submit={handleStart} />
        }
        
      </header>
    </div>
  );
}

const SetupForm = ({ action, onChange, submit }) => {
  return (
    <div className='setup'>
      {!action.playerName && <div className='action-buttons'>
        <button
          className="new-btn"
          onClick={() => onChange({ name: 'create' })}
        >
          Create Game
        </button>
        <button
          className="join-btn"
          rel="noopener noreferrer"
          onClick={() => onChange({ name: 'join' })}
        >
          Join Game
        </button>
      </div>}
        {action.name === 'create' && <input type="text" placeholder="Enter Your Name" onChange={(evt) => onChange({ ...action, playerName: evt.target.value })} />}
        {action.name === 'join' && (
            <div>
                <input type="text" placeholder="Enter Game Id" onChange={(evt) => onChange({ ...action, gameRoomId: evt.target.value })} />
                <input type="text" placeholder="Enter Your Name" onChange={(evt) => onChange({ ...action, playerName: evt.target.value })} />
            </div>
        )}
        {action.playerName && (action.gameRoomId || action.name === 'create') && <button
          className="join-btn"
          onClick={submit}
        >
          Start
        </button>}
    </div>
  )
}

export default Game;