export function getMachineChoice() {
	const choices = ['rock', 'paper', 'scissors'];
	const randomIndex = Math.floor(Math.random() * choices.length);
	return choices[randomIndex];
}

export function determineGameResult(playerChoice, machineChoice) {
	const choices = ['rock', 'paper', 'scissors'];
	if (!choices.includes(playerChoice) || !choices.includes(machineChoice)) {
		console.error(`Invalid choice: Player: ${playerChoice}, Machine: ${machineChoice}`);
		return {
			winner: 'error',
			message: 'Invalid choice',
			scoreChange: 0,
		};
	}

	if (playerChoice === machineChoice) {
		return {
			winner: 'draw',
			message: "It's a draw!",
			scoreChange: 0,
		};
	}

	if (
		(playerChoice === 'rock' && machineChoice === 'scissors') ||
		(playerChoice === 'paper' && machineChoice === 'rock') ||
		(playerChoice === 'scissors' && machineChoice === 'paper')
	) {
		return {
			winner: 'player',
			message: 'You Win!',
			scoreChange: 1,
		};
	}
	return {
		winner: 'machine',
		message: 'You Lose!',
		scoreChange: 0,
	};
}
