import React from 'react';

export function Play({ onSelectChoice }) {
	const choices = [
		{ name: 'Rock ✊🏻', value: 'rock', color: 'bg-red-500' },
		{ name: 'Paper 🤚🏻', value: 'paper', color: 'bg-green-500' },
		{ name: 'Scissors ✌🏻', value: 'scissors', color: 'bg-blue-500' },
	];

	return (
		<div className='flex flex-col items-center p-8 '>
			<h2 className='text-3xl font-bold mb-10'>Choose Your Move</h2>
			<div className='flex justify-center w-full gap-[10px] mx-auto'>
				{choices.map((choice) => (
					<button
						key={choice.value}
						onClick={() => onSelectChoice(choice.value)}
						className={`p-8 my-2 rounded-full text-white text-2xl font-semibold shadow-xl transition-transform hover:scale-105 ${choice.color}`}>
						{choice.name}
					</button>
				))}
			</div>
		</div>
	);
}
