document.addEventListener('DOMContentLoaded', function() {
	// Select DOM elements
	const workTimerDisplay    = document.querySelector('#work-timer');
	const breakTimerDisplay   = document.querySelector('#break-timer');
	const cycleCounterDisplay = document.querySelector('#cycle-counter');
	
	const startButton = document.getElementById('start');
	const stopButton  = document.getElementById('stop');
	const resetButton = document.getElementById('reset');
	
	// Select the progress circle elements
	const workCircle = document.querySelector('#work-container .progress-bar');
	const breakCircle = document.querySelector('#break-container .progress-bar');
	
	// Calculate circle properties (r is 50 as defined in the HTML)
	const workRadius = workCircle.r.baseVal.value;
	const workCircumference = 2 * Math.PI * workRadius;
	workCircle.style.strokeDasharray = workCircumference;
	workCircle.style.strokeDashoffset = workCircumference;
	
	const breakRadius = breakCircle.r.baseVal.value;
	const breakCircumference = 2 * Math.PI * breakRadius;
	breakCircle.style.strokeDasharray = breakCircumference;
	breakCircle.style.strokeDashoffset = breakCircumference;
	
	// Create an Audio object for the ding sound
	const bellSound = new Audio('bell-at-daitokuji-templekyoto.wav');
	
	// Durations in milliseconds
	let initialBreakDuration = 5 * 60 * 1000;
	let workDuration  = 25 * 60 * 1000; // 25 minutes
	let breakDuration = initialBreakDuration;  // 5 minutes
	
	// Timer and state variables
	let timerInterval = null;
	let cycleStartTime = null;
	let currentCycle = 0;
	let currentMode = 'work'; // either 'work' or 'break'
    let intervalDuration = 100;
    let accumulatedElapsed = 0;
	
	/**
	 * Helper function to format milliseconds as mm:ss
	 */
	function formatTime(ms) {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	}
	
	/**
	 * Updates the timer display and progress circle.
	 */
	function updateTimer() {
		const now = new Date();
		const elapsed = (cycleStartTime ? now - cycleStartTime : 0) + accumulatedElapsed;
		let remaining;
		
		if (currentMode === 'work') {
			remaining = workDuration - elapsed;
			if (remaining < 0) remaining = 0;
			workTimerDisplay.textContent = formatTime(remaining);
		
			// Update progress for work period
			const progress = Math.min(elapsed / workDuration, 1);
			workCircle.style.strokeDashoffset = workCircumference * (1 - progress);
		} else { // break mode
			remaining = breakDuration - elapsed;
			if (remaining < 0) remaining = 0;
			breakTimerDisplay.textContent = formatTime(remaining);
		
			// Update progress for break period
			const progress = Math.min(elapsed / breakDuration, 1);
			breakCircle.style.strokeDashoffset = breakCircumference * (1 - progress);
		}
		
		// When the current period finishes, play the sound and switch modes
		if (elapsed >= (currentMode === 'work' ? workDuration : breakDuration)) {
			// Play the ding sound
			bellSound.play();
		
			if (currentMode === 'work') {
				// Switch from work to break
				currentMode = 'break';
                accumulatedElapsed = 0;
				cycleStartTime = new Date();
				if(currentCycle % 4 == 3){
					breakDuration *= 4;
				} else {
					breakDuration = initialBreakDuration;
				}
				breakTimerDisplay.textContent = formatTime(breakDuration);
				// Reset break progress circle
				breakCircle.style.strokeDashoffset = breakCircumference;
			} else {
				// End of break: increment cycle and switch back to work
				currentCycle++;
				cycleCounterDisplay.textContent = currentCycle;
				currentMode = 'work';
                accumulatedElapsed = 0;
				cycleStartTime = new Date();
				workTimerDisplay.textContent = formatTime(workDuration);
				// Reset work progress circle
				workCircle.style.strokeDashoffset = workCircumference;
			}
		}
	}
	
	/**
	 * Starts the timer.
	 */
	function startTimer() {
		if (timerInterval !== null) return; // Prevent multiple intervals
        if(cycleStartTime === null){
		    cycleStartTime = new Date();
        }
		timerInterval = setInterval(updateTimer, intervalDuration);
	}
	
	/**
	 * Stops the timer.
	 */
	function stopTimer() {
		if (timerInterval !== null) {
			clearInterval(timerInterval);
			timerInterval = null;
                // Add the elapsed time from this run to accumulatedElapsed.
            if (cycleStartTime) {
                accumulatedElapsed += new Date() - cycleStartTime;
                cycleStartTime = null; // Indicate that we’re paused.
            }
		}
	}
	
	/**
	 * Resets the timer, cycle counter, and progress circles.
	 */
	function resetTimer() {
		stopTimer();
		currentCycle = 0;
		cycleCounterDisplay.textContent = currentCycle;
		currentMode = 'work';
		workTimerDisplay.textContent = formatTime(workDuration);
		breakTimerDisplay.textContent = formatTime(breakDuration);
        accumulatedElapsed = 0;
		// Reset progress circles
		workCircle.style.strokeDashoffset = workCircumference;
		breakCircle.style.strokeDashoffset = breakCircumference;
	}
	
	// Attach event listeners
	startButton.addEventListener('click', startTimer);
	stopButton.addEventListener('click', stopTimer);
	resetButton.addEventListener('click', resetTimer);
	
	// Initialize displays on page load
	resetTimer();
});