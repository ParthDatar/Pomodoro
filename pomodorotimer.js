import { Timer } from './timer.js';

export class PomodoroTimer {
	/**
	 * @param {Timer} workTimer - Timer instance for work.
	 * @param {Timer} breakTimer - Timer instance for break.
	 * @param {HTMLElement} cycleCounterElement - Element displaying the cycle count.
	 */
	constructor(workTimer, breakTimer, cycleCounterElement) {
		this.workTimer = workTimer;
		this.breakTimer = breakTimer;
		this.cycleCounterElement = cycleCounterElement;
		this.currentMode = 'work'; // 'work' or 'break'
		this.currentCycle = 0;
		this.running = false;
		this.animationFrameId = null;
	}

	/**
	 * Animation loop that updates the timers and automatically switches modes.
	 */
	animateCycle() {
		if (!this.running) return;

		let finished = false;
		if (this.currentMode === 'work') {
			finished = this.workTimer.update();
			if (finished) {
				// When work period finishes, switch to break.
				this.currentMode = 'break';
				this.workTimer.reset();
				this.breakTimer.reset();
				this.breakTimer.start();
			}
		} else { // break mode
			finished = this.breakTimer.update();
			if (finished) {
				// When break period finishes, increment cycle and switch back to work.
				this.breakTimer.reset();
				this.currentCycle++;
				if (this.cycleCounterElement)
					this.cycleCounterElement.textContent = this.currentCycle;
				this.currentMode = 'work';
				this.workTimer.reset();
				this.workTimer.start();
			}
		}

		this.animationFrameId = requestAnimationFrame(() => this.animateCycle());
	}

	/**
	 * Starts or resumes the active timer and begins the animation loop.
	 */
	start() {
		if (this.running) return;
		this.running = true;
		// Only start the active timer.
		if (this.currentMode === 'work') {
			this.workTimer.start();
		} else {
			this.breakTimer.start();
		}
		this.animateCycle();
	}

	/**
	 * Pauses the active timer and stops the animation loop.
	 */
	pause() {
		this.running = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		if (this.currentMode === 'work') {
			this.workTimer.pause();
		} else {
			this.breakTimer.pause();
		}
	}

	/**
	 * Resets both timers and the cycle counter.
	 */
	reset() {
		this.pause();
		this.currentCycle = 0;
		if (this.cycleCounterElement)
			this.cycleCounterElement.textContent = this.currentCycle;
		this.currentMode = 'work';
		this.workTimer.reset();
		this.breakTimer.reset();
	}
}