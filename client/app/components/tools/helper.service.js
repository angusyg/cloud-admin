(function(angular) {
	'use strict';

	angular.module('cloud.admin.client')
		.factory('Helper', Helper);

	Helper.$inject = [];

	function Helper() {
		return {
			decodeToken: decodeToken,
			scrollTo: scrollTo
		};

		function decodeToken(token) {
			var parts = token.split('.');
			if (parts.length !== 3) {
				throw new Error('JWT must have 3 parts');
			}
			return angular.fromJson(atob(parts[1]));
		}

		function scrollTo(eID) {
			var startY = currentYPosition();
			var stopY = elmYPosition(eID);
			var distance = stopY > startY ? stopY - startY : startY - stopY;
			if (distance < 100) {
				scrollTo(0, stopY);
				return;
			}
			var speed = 10000;//Math.round(distance / 100);
			//if (speed >= 20) speed = 20;
			var step = 100;
			var leapY = stopY > startY ? startY + step : startY - step;
			var timer = 0;
			if (stopY > startY) {
				for (var i = startY; i < stopY; i += step) {
					setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
					leapY += step;
					if (leapY > stopY) leapY = stopY;
					timer++;
				}
				return;
			}
			for (var i = startY; i > stopY; i -= step) {
				setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
				leapY -= step;
				if (leapY < stopY) leapY = stopY;
				timer++;
			}
		}

		function currentYPosition() {
			// Firefox, Chrome, Opera, Safari
			if (self.pageYOffset) return self.pageYOffset;
			// Internet Explorer 6 - standards mode
			if (document.documentElement && document.documentElement.scrollTop)
				return document.documentElement.scrollTop;
			// Internet Explorer 6, 7 and 8
			if (document.body.scrollTop) return document.body.scrollTop;
			return 0;
		}

		function elmYPosition(eID) {
			var elm = document.getElementById(eID);
			var y = elm.offsetTop;
			var node = elm;
			while (node.offsetParent && node.offsetParent != document.body) {
				node = node.offsetParent;
				y += node.offsetTop;
			}
			return y;
		}
	}
})(angular);
