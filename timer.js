// Timer.js
export class Timer {
	/**
	 * @param {string} name - The timer's name.
	 * @param {number} duration - Duration in milliseconds.
	 * @param {string} soundUrl - URL for the sound to play when complete.
	 * @param {HTMLElement} displayElement - Element that shows the timer text.
	 * @param {SVGCircleElement} progressCircle - SVG circle element for progress display.
	 * @param {boolean} isPaused - Whether the timer should start paused.
	 */
	constructor(name, duration, soundUrl, displayElement, progressCircle, isPaused = true) {
		this.name = name;
		this.duration = duration;
		this.sound = new Audio(soundUrl);
		this.displayElement = displayElement;
		this.progressCircle = progressCircle;
		
		// Initialize timer state so it doesn't start accumulating immediately.
		this.isPaused = isPaused;
		this.timeSpentPaused = 0;
		this.startTime = Date.now();
		this.timePaused = isPaused ? Date.now() : null;
		
		// Set up the SVG progress circle if available.
		if (this.progressCircle) {
			const radius = this.progressCircle.r.baseVal.value;
			this.circumference = 2 * Math.PI * radius;
			this.progressCircle.style.strokeDasharray = this.circumference;
			this.progressCircle.style.strokeDashoffset = this.circumference;
		}
	}

	/**
	 * Resumes the timer.
	 */
	start() {
		if (!this.isPaused) return; // Already running.
		// Calculate how long it was paused and update the accumulated paused time.
		this.timeSpentPaused += Date.now() - this.timePaused;
		this.timePaused = null;
		this.isPaused = false;
	}

	/**
	 * Pauses the timer.
	 */
	pause() {
		if (this.isPaused) return;
		this.timePaused = Date.now();
		this.isPaused = true;
	}

	/**
	 * Resets the timer and updates the display and progress.
	 */
	reset() {
		this.startTime = Date.now();
		this.timeSpentPaused = 0;
		this.timePaused = Date.now();
		this.isPaused = true;
		this.updateDisplay();
		this.updateProgress();
	}

	/**
	 * Returns the elapsed time (excluding time spent paused).
	 */
	getElapsed() {
		if (this.isPaused && this.timePaused !== null) {
			return this.timePaused - this.startTime - this.timeSpentPaused;
		}
		return Date.now() - this.startTime - this.timeSpentPaused;
	}

	/**
	 * Updates the timer's display element with the remaining time in mm:ss.
	 */
	updateDisplay() {
		if (this.displayElement) {
			let remaining = this.duration - this.getElapsed();
			if (remaining < 0) remaining = 0;
			const totalSeconds = Math.floor(remaining / 1000);
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;
			this.displayElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}
	}

	/**
	 * Updates the SVG progress circle to visually reflect progress.
	 */
	updateProgress() {
		if (this.progressCircle) {
			const progress = Math.min(this.getElapsed() / this.duration, 1);
			this.progressCircle.style.strokeDashoffset = this.circumference * (1 - progress);
		}
	}

	/**
	 * Convenience method: updates display and progress.
	 * If the elapsed time is greater than or equal to the duration,
	 * plays the sound and returns true (indicating completion).
	 */
	update() {
		this.updateDisplay();
		this.updateProgress();
		if (this.getElapsed() >= this.duration) {
			this.sound.play();
			return true;
		}
		return false;
	}
}