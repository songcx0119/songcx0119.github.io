'use strict';
console.log("Nothing here this time!");

var timeElm = document.getElementById('time');
var doc = document.documentElement;
var clientWidth = doc.clientWidth;
var clientHeight = doc.clientHeight;

var pad = function pad(val) {
	return val < 10 ? '0' + val : val;
};

var time$ = Rx.Observable.interval(1000).map(function () {
	var deadline = 'Thur Mar 16 2017 23:59:59 GMT+0800';
	var t = Date.parse(deadline) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));

	return {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds
	};
}).subscribe(function (_ref) {
	var days = _ref.days;
	var hours = _ref.hours;
	var minutes = _ref.minutes;
	var seconds = _ref.seconds;

	timeElm.setAttribute('data-date', pad(days));
	timeElm.setAttribute('data-hours', pad(hours));
	timeElm.setAttribute('data-minutes', pad(minutes));
	timeElm.setAttribute('data-seconds', pad(seconds));
});

var mouse$ = Rx.Observable.fromEvent(document, 'mousemove').map(function (_ref2) {
	var clientX = _ref2.clientX;
	var clientY = _ref2.clientY;
	return {
		x: (clientWidth / 2 - clientX) / clientWidth / 2.5,
		y: (clientHeight / 2 - clientY) / clientHeight / 2.5
	};
});

RxCSS({
	mouse: RxCSS.animationFrame.withLatestFrom(mouse$, function (_, m) {
		return m;
	}).scan(RxCSS.lerp(0.2))
}, timeElm);
