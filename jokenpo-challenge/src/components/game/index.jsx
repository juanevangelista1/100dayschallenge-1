import React, { useState, useEffect, useCallback } from 'react';
import { getMachineChoice, determineGameResult } from '../gameControlOptions';

export function ResultScreen({ playerChoice, onScoreUpdate, onPlayAgain }) {
	const [machineChoice, setMachineChoice] = useState('');
	const [winner, setWinner] = useState(null);
	const [resultMessage, setResultMessage] = useState('Waitin...');
	const [isProcessing, setIsProcessing] = useState(true);

	const processGameResult = useCallback(() => {
		const machine = getMachineChoice();
		setMachineChoice(machine);

		const result = determineGameResult(playerChoice, machine);

		setWinner(result.winner);
		setResultMessage(result.message);
		onScoreUpdate(result.scoreChange);
		setIsProcessing(false);
	}, [playerChoice, onScoreUpdate]);

	useEffect(() => {
		const timer = setTimeout(() => {
			processGameResult();
		}, 1500);

		return () => clearTimeout(timer);
	}, [processGameResult]);

	const translateChoice = (choice) => {
		const choicesMap = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };
		return choicesMap[choice] || 'Waitin...';
	};

	return (
		<div className='game-container p-8 text-center'>
			<h2 className='text-3xl font-bold mb-8'>Round Result</h2>

			<div className='flex justify-around items-center mb-10'>
				<div className='player-choice'>
					<p className='text-xl font-semibold mb-2'>Player 1</p>
					<div
						className={`p-6 rounded-full shadow-lg ${
							isProcessing ? 'bg-gray-400 animate-pulse' : 'bg-blue-500 text-white'
						}`}>
						<span className='text-4xl'>{translateChoice(playerChoice)}</span>
					</div>
				</div>

				<div className='machine-choice'>
					<p className='text-xl font-semibold mb-2'>Player 2</p>
					<div
						className={`p-6 rounded-full shadow-lg ${
							isProcessing ? 'bg-gray-400 animate-pulse' : 'bg-red-500 text-white'
						}`}>
						<span className='text-4xl'>{translateChoice(machineChoice)}</span>
					</div>
				</div>
			</div>

			{isProcessing ? (
				<p className='text-2xl text-yellow-500'>Machine is choosing...</p>
			) : (
				<>
					<p
						className={`text-4xl font-extrabold my-8 ${
							winner === 'player'
								? 'text-green-500'
								: winner === 'machine'
								? 'text-red-500'
								: 'text-yellow-500'
						}`}>
						{resultMessage}
					</p>
					<button
						onClick={onPlayAgain}
						className='mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300'>
						Play Again
					</button>
				</>
			)}
		</div>
	);
}
