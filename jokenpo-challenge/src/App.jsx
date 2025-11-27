import React, { useState, useCallback } from 'react';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Play } from './components/play';
import { ResultScreen } from './components/game';
import './App.css';

function App() {
	const [score, setScore] = useState(0);
	const [view, setView] = useState('play');

	const [playerChoice, setPlayerChoice] = useState(null);

	const handlePlayerChoice = useCallback((choice) => {
		setPlayerChoice(choice);
		setView('game');
	}, []);

	const handleScoreUpdate = useCallback((scoreChange) => {
		setScore((prevScore) => prevScore + scoreChange);
	}, []);

	const handlePlayAgain = useCallback(() => {
		setPlayerChoice(null);
		setView('play');
	}, []);

	const renderView = () => {
		if (view === 'game' && playerChoice) {
			return (
				<ResultScreen
					playerChoice={playerChoice}
					onScoreUpdate={handleScoreUpdate}
					onPlayAgain={handlePlayAgain}
				/>
			);
		}
		return <Play onSelectChoice={handlePlayerChoice} />;
	};

	return (
		<div className='app-container'>
			<Header score={score} />

			<main className='game-area'>{renderView()}</main>

			<Footer />
		</div>
	);
}

export default App;
