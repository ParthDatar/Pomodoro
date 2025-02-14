import { PomodoroTimer } from "./pomodorotimer.js";
import { Timer } from "./timer.js";

document.addEventListener('DOMContentLoaded', function() {
	// Select DOM elements
	const workTimerDisplay    = document.getElementById('work-timer');
	const breakTimerDisplay   = document.getElementById('break-timer');
	const cycleCounterDisplay = document.getElementById('cycle-counter');

	const startButton = document.getElementById('start');
	const stopButton  = document.getElementById('stop');
	const resetButton = document.getElementById('reset');

	// Select the progress circle elements
	const workCircle  = document.querySelector('#work-container .progress-bar');
	const breakCircle = document.querySelector('#break-container .progress-bar');

	// Define durations (in milliseconds)
	const workDuration  = 25 * 60 * 1000; // 25 minutes
	const breakDuration = 5 * 60 * 1000;  // 5 minutes

	// Define the sound file to be used
	const bellSound = 'bell-at-daitokuji-templekyoto.wav';

	// Instantiate Timer objects for work and break periods.
	// (The Timer constructor expects: name, duration, soundUrl, displayElement, progressCircle, isPaused)
	const workTimer  = new Timer('Work',  workDuration,  bellSound, workTimerDisplay,  workCircle,  false);
	const breakTimer = new Timer('Break', breakDuration, bellSound, breakTimerDisplay, breakCircle, false);

	// Instantiate the PomodoroTimer with our two timers and the cycle counter element.
	const pomodoro = new PomodoroTimer(workTimer, breakTimer, cycleCounterDisplay);

	// Attach event listeners to the control buttons.
	startButton.addEventListener('click', () => {
		console.log('Starting Pomodoro timer.');
		pomodoro.start();
	});

	stopButton.addEventListener('click', () => {
		console.log('Pausing Pomodoro timer.');
		pomodoro.pause();
	});

	resetButton.addEventListener('click', () => {
		console.log('Resetting Pomodoro timer.');
		pomodoro.reset();
	});

	// Initialize the displays
	pomodoro.reset();
});