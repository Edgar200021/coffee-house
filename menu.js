import products from "../products.json" with { type: "json" };

window.addEventListener("load", () => {
	const productList = document.querySelector(".menu__list"),
		tabsList = document.querySelector(".tabs__list"),
		tabsBtns = Array.from(document.querySelectorAll(".tabs__btn")),
		container = productList.closest(".container"),
		refreshBtn = container.querySelector(".menu__refresh-btn"),
		modal = document.querySelector(".modal");

	let category = "coffee",
		count = window.matchMedia("(max-width: 768px)") ? 4 : 8;

	function renderProducts(category, count = 8) {
		let productsHtml = "";

		productList.innerHTML = "";

		const filteredProduct = products.filter(
			(product) => product.category === category,
		);

		for (const product of filteredProduct.slice(0, count)) {
			productsHtml += `<li class="menu__item card" data-id=${product.id}>
	  <div class="card__img-box">
		<img
		  src="./assets/img/drinks/${product.category}-${product.id}.jpg"
		  alt=${product.name}
		  class="card__img"
		/>
	  </div>
	  <div class="card__info">
		<span class="card__title">${product.name}</span>
		<p class="card__descr">
		  ${product.description}
		</p>
		<span class="card__price">$${product.price}</span>
	  </div>
	</li>`;
		}

		productList.insertAdjacentHTML("beforeend", productsHtml);

		return filteredProduct.length;
	}

	renderProducts(category, count);

	tabsList.addEventListener("click", async (e) => {
		if (!e.target.matches(".tabs__btn")) return;

		const button = e.target;

		tabsBtns.forEach((btn) => {
			btn.classList.remove("btn_tab_inactive");
			btn.disabled = false;
		});

		button.classList.add("btn_tab_inactive");
		button.disabled = true;

		category = button.dataset.category;
		count = 4;

		const productsListLength = renderProducts(category, count);

		refreshBtn.style.display = productsListLength > 4 ? "flex" : "none";
	});

	const resizeObserver = new ResizeObserver((entries) => {
		const box = entries[0];

		if (box.target.offsetWidth > 768) {
			renderProducts(category, 8);
			refreshBtn.style.display = "none";
			return;
		}

		const productsListLength = renderProducts(category, count);
		refreshBtn.style.display =
			count === 8 || productsListLength <= 4 ? "none" : "flex";
	});

	resizeObserver.observe(container);

	refreshBtn.addEventListener("click", (e) => {
		count += 4;

		renderProducts(category, count);

		e.target.style.display = "none";
	});

	let product;

	function createProductModal(e) {
		const target = e.target.closest(".menu__item");
		if (!target) return;

		const modalInner = modal.querySelector(".modal__inner");

		product = products.find(
			(product) => product.id === Number(target.dataset.id),
		);

		modal.classList.add("modal_active");

		const productHtml = `<div class="modal__product single-product" data-id=${
			product.id
		}>
                <div class="single-product__img-box">
                  <img
                    src="./assets//img/drinks/${product.category}-${
											product.id
										}.jpg"
                    class="single-product__img"
                    alt=${product.name}
                  />
                </div>
                <div class="single-product__info">
                  <h2 class="single-product__title third-title">${
										product.name
									}</h2>
                  <p class="single-product__description">
                    ${product.description}
                  </p>

                  <div class="single-product__size">
                    <span class="single-product__size-title">Size</span>
                    <div class="single-product__size-container">
					${Object.entries(product.sizes)
						.map(([key, value], i) => {
							return ` <label
								class="single-product__size-label ${i === 0 && "active-label"}"
								data-input=${key}
							>
								<input
								class="single-product__size-input"
								type="radio"
								value=${value["add-price"]}
								/>
								${value.size}
							</label>`;
						})
						.join("")}
                    </div>
                  </div>

                  <div class="single-product__ingridients">
                    <span class="single-product__ingridients-title"
                      >Additives</span
                    >
    				<div class="single-product__ingridients-container">
					${product.additives
						.map((value, i) => {
							return `<label
							class="single-product__ingridients-label"
							data-input=${i + 1}
						>
							<input

							class="single-product__ingridients-input"
							type="checkbox"
							value=${value["add-price"]}
							/>
							${value.name}
						</label>`;
						})
						.join("")}

    				</div>
                  </div>

                  <div class="single-product__price">
                    <span class="single-product__price-text">Total:</span>
                    <span class="single-product__price-summary">$${
											product.price
										}</span>
                  </div>

                  <div class="single-product__download-app">
                    <p class="single-product__download-app-text">
                      The cost is not final. Download our mobile app to see the
                      final price and place your order. Earn loyalty points and
                      enjoy your favorite coffee with up to 20% discount.
                    </p>
                  </div>

                  <button class="single-product__btn btn">Close</button>
                </div>
              </div>`;

		modalInner.innerHTML = productHtml;
		document.body.style.overflow = "hidden";
	}

	function closeModal() {
		modal.classList.remove("modal_active");
		modal.querySelector(".modal__inner").innerHTML = "";
		document.body.style.overflow = "auto";
	}

	productList.addEventListener("click", createProductModal);

	let additionalSizePrice = 0,
		additionalAdditivyPrice = 0;

	modal.addEventListener("click", (e) => {
		const target = e.target;
		if (
			target.matches(".single-product__btn") ||
			target.matches(".modal__container")
		) {
			closeModal();
			return;
		}

		if (target.closest("label")) {
			const input = target.firstElementChild;
			const priceElement = target
				.closest(".single-product")
				.querySelector(".single-product__price-summary");
			const starterPrice = Number(product.price);

			console.log(input);
			switch (input.type) {
				case "radio": {
					const labels = Array.from(
						target
							.closest(".single-product__size-container")
							.querySelectorAll("label"),
					);

					labels.forEach((label) => {
						label.classList.remove("active-label");
						label.style.pointerEvents = "auto";
					});

					target.classList.add("active-label");
					target.style.pointerEvents = "none";

					additionalSizePrice = Number(input.value);
					break;
				}
				case "checkbox":
					target.classList.toggle("active-label");
					additionalAdditivyPrice = input.checked
						? additionalAdditivyPrice - Number(input.value)
						: additionalAdditivyPrice + Number(input.value);
					break;
			}

			const summaryPrice = additionalAdditivyPrice + additionalSizePrice;

			priceElement.innerText = `$${(summaryPrice + starterPrice).toFixed(2)}`;
			return;
		}
	});
});
