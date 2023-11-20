window.addEventListener('load', () => {
  const burgerBtn = document.querySelector('.header__btn'),
    menu = document.querySelector('.nav')

  burgerBtn.addEventListener('click', e => {
    e.target.classList.toggle('header__btn_active')
    menu.classList.toggle('nav_active')
    document.body.classList.toggle('overflow-hidden')
  })

  function closeModal() {
    burgerBtn.classList.remove('header__btn_active')
    menu.classList.remove('nav_active')
    document.body.classList.remove('overflow-hidden')
  }

  menu.addEventListener('click', e => {
    if (!e.target.closest('.nav__item')) return

    closeModal()
  })
})
