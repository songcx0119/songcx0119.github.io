var audioPlayer = document.querySelector('.audio-player');
var playBtn = audioPlayer.querySelector('#playBtn');
var pauseBtn = audioPlayer.querySelector('#pauseBtn');
var loading = audioPlayer.querySelector('.loading');
var progress = audioPlayer.querySelector('.progress');
var sliders = audioPlayer.querySelectorAll('.slider');
var volumeBtn = audioPlayer.querySelector('.volume-btn');
var volumeControls = audioPlayer.querySelector('.volume-controls');
var volumeProgress = volumeControls.querySelector('.slider #myRange');
var player = audioPlayer.querySelector('audio');
var currentTime = audioPlayer.querySelector('.current-time');
var totalTime = audioPlayer.querySelector('.total-time');
var speaker = audioPlayer.querySelector('#speaker');

playBtn.addEventListener('click', togglePlay);
pauseBtn.addEventListener('click', togglePlay);
player.addEventListener('timeupdate', updateProgress);
player.addEventListener('volumechange', updateVolume);
player.addEventListener('loadedmetadata', function () {
	totalTime.textContent = formatTime(player.duration);
});
player.addEventListener('canplay', makePlay);
player.addEventListener('ended', function () {
	pauseBtn.style.display = 'none';
	playBtn.style.display = 'block';
	player.currentTime = 0;
});

volumeBtn.addEventListener('click', function () {
	volumeBtn.classList.toggle('open');
	volumeControls.classList.toggle('hidden');
});

//window.addEventListener('resize', directionAware);
//
//directionAware();

volumeProgress.oninput = function () {
	changeVolume(this.value);
	updateVolume(this.value);
}

function updateProgress() {
	var current = player.currentTime;
	var percent = current / player.duration * 100;
	progress.style.width = percent + '%';

	currentTime.textContent = formatTime(current);
}

function updateVolume(value) {
	if (value >= 50) {
		speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
	} else if (value < 50 && value > 5) {
		speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
	} else if (value <= 5) {
		speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
	}
}

function rewind(event) {
	if (inRange(event)) {
		player.currentTime = player.duration * getCoefficient(event);
	}
}

function changeVolume(value) {
	if (value <= 100 && value > 0) {
		player.volume = value / 100;
	}
}

function formatTime(time) {
	var min = Math.floor(time / 60);
	var sec = Math.floor(time % 60);
	return min + ':' + (sec < 10 ? '0' + sec : sec);
}

function togglePlay() {
	if (player.paused) {
		pauseBtn.style.display = 'block';
		playBtn.style.display = 'none';
		player.play();
	} else {
		pauseBtn.style.display = 'none';
		playBtn.style.display = 'block';
		player.pause();
	}
}

function makePlay() {
	playBtn.style.display = 'block';
	pauseBtn.style.display = 'none';
	loading.style.display = 'none';
}

//function directionAware() {
//	if (window.innerHeight < 250) {
//		volumeControls.style.bottom = '0px';
//		volumeControls.style.left = '40px';
//	} else if (audioPlayer.offsetTop < 154) {
//		volumeControls.style.bottom = '0px';
//		volumeControls.style.left = '40px';
//	} else {
//		volumeControls.style.bottom = '0px';
//		volumeControls.style.left = '40px';
//	}
//}
