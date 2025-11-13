window.addEventListener("load", () => {
	const favorite = document.querySelector(".favorite"),
		favoriteDrinks = Array.from(
			favorite.querySelectorAll(".favorite__favorite-drink"),
		),
		dots = Array.from(favorite.querySelectorAll(".favorite__slider-dots"));

	dots[0].classList.add("favorite__slider-dots_active");

	//! Slider //

	let currentSlider = 0,
		timerMs = 5000,
		timerMsSecondsPassed = 5;

	function changeSlide(isToLeft) {
		isToLeft ? currentSlider-- : currentSlider++;

		if (currentSlider === -1) {
			currentSlider = 2;
		}

		if (currentSlider === 3) {
			currentSlider = 0;
		}

		favoriteDrinks.forEach((favoriteDrink) => {
			if (Number(favoriteDrink.dataset["favorite"]) === currentSlider + 1) {
				favoriteDrink.dataset.active = true;
			} else {
				favoriteDrink.dataset.active = false;
			}
			favoriteDrink.style.transform = `translateX(-${currentSlider * 100}%)`;
		});

		dots.forEach((dot) => {
			if (Number(dot.dataset["dots"]) === currentSlider + 1) {
				dot.firstElementChild.style.width = "100%";
				dot.classList.add("favorite__slider-dots_active");
			} else {
				dot.firstElementChild.style.width = 0;
				dot.classList.remove("favorite__slider-dots_active");
			}
		});
	}

	function createSliderInterval(ms) {
		return setInterval(() => {
			changeSlide();
		}, ms);
	}

	function createSecondsPassedInterval(reset = true) {
		return setInterval(() => {
			timerMsSecondsPassed--;

			if (reset && timerMsSecondsPassed === 0) timerMsSecondsPassed = 5;
		}, 1000);
	}

	let slideIntervalId = createSliderInterval(timerMs),
		secondsPasssedIntervalId = createSecondsPassedInterval();

	favorite.addEventListener("click", (e) => {
		if (!e.target.matches(".favorite__btn")) return;

		const isToLeft = e.target.matches(".favorite__btn-left");

		clearInterval(slideIntervalId);
		changeSlide(isToLeft);

		slideIntervalId = createSliderInterval(timerMs);
	});

	function continueSlide(e) {
		const activeDot =
			dots[
				Number(e.target.closest('[data-active="true"]').dataset["favorite"]) - 1
			];

		activeDot.firstElementChild.style.width = "100%";

		secondsPasssedIntervalId = createSecondsPassedInterval(false);

		if (timerMsSecondsPassed === 1) {
			changeSlide();
			return;
		}
		slideIntervalId = createSliderInterval(timerMsSecondsPassed * 1000);
	}

	function stopSlide(e) {
		const activeDot =
			dots[
				Number(e.target.closest('[data-active="true"]').dataset["favorite"]) - 1
			];

		activeDot.firstElementChild.style.width =
			activeDot.firstElementChild.offsetWidth + "px";

		clearInterval(slideIntervalId);
		clearInterval(secondsPasssedIntervalId);
	}

	function changePointerAndTouchEvents(element, value) {
		element.style.pointerEvents = value;
		element.style["touch-action"] = value;

		const parentBlock = element.closest(".favorite");

		Array.from(parentBlock.querySelectorAll(".favorite__btn")).forEach(
			(btn) => (btn.style.pointerEvents = value),
		);
	}

	function startTransition(e) {
		changePointerAndTouchEvents(e.target, "none");

		clearInterval(slideIntervalId);
		clearInterval(secondsPasssedIntervalId);

		slideIntervalId = createSliderInterval(timerMs);

		timerMsSecondsPassed = 5;

		secondsPasssedIntervalId = createSecondsPassedInterval();
	}

	function endTransition(e) {
		changePointerAndTouchEvents(e.target, "auto");
	}

	let touchstartX = 0;
	let touchendX = 0;

	favoriteDrinks.forEach((drink) => {
		drink.addEventListener("transitionstart", startTransition);
		drink.addEventListener("transitionend", endTransition);
		drink.addEventListener("mouseenter", stopSlide);
		drink.addEventListener("mouseleave", continueSlide);
		drink.addEventListener("touchstart", (e) => {
			touchstartX = e.changedTouches[0].screenX;
			stopSlide(e);
		});
		drink.addEventListener("touchend", continueSlide);
		drink.addEventListener("touchend", (e) => {
			touchendX = e.changedTouches[0].screenX;

			if (touchendX < touchstartX) changeSlide();
			if (touchendX > touchstartX) changeSlide(true);
		});
	});
});
