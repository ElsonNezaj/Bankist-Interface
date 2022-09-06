'use strict'

const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const nav = document.querySelector('.nav')
const tabs = document.querySelectorAll('.operations__tab')
const tabsCOntainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = function () {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal))

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal)

btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

/////////////////////////////////////////////////////////////
// Smooth scrolling (Learn More)
btnScrollTo.addEventListener('click', (e) => {
  const s1coords = section1.getBoundingClientRect()
  // console.log(s1coords)

  // console.log(e.target.getBoundingClientRect())

  // console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset)

  // console.log(
  //   'HEIGHT/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // )
  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // )

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // })

  section1.scrollIntoView({ behavior: 'smooth' })
})

////////////////////////////////////////////////////
// Page Navigation
// 1. Add event listener to common parent element
// 2. Determine what element orginated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault()

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

/////////////////////////////////////////////
// Tabbed component
tabsCOntainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')

  if (!clicked) return

  // Active tab
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')

  // Activate content area

  tabsContent.forEach((c) => c.classList.remove('operations__content--active'))
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active')
})

/////////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}
// Passing argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5))

nav.addEventListener('mouseout', handleHover.bind(1))

/////////////////////////////////////////////
// Sticky Navigation
/*const initialCoords = section1.getBoundingClientRect()
console.log(initialCoords)

window.addEventListener('scroll', function (e) {
  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
})*/

/////////////////////////////////////////////
// Sticky Navigation : Intersectin Observer API
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height

const stickyNav = function (entries) {
  const [entry] = entries
  // console.log(entry)
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
})
headerObs.observe(header)

/////////////////////////////////////////////
// Revealing elements on scroll
const allSections = document.querySelectorAll('.section')

const revealSection = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

allSections.forEach(function (sec) {
  sectionObs.observe(sec)
  // sec.classList.add('section--hidden')
})

/////////////////////////////////////////////
// Loading lazy images
const imgTargets = document.querySelectorAll('img[data-src]')

const loadImg = function (entries, observer) {
  const [entry] = entries

  if (!entry.isIntersecting) return

  // Replace the src attribute with data-src
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  })

  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
})

imgTargets.forEach((img) => imgObserver.observe(img))

//////////////////////////////////////////////////////
// Slider Component
const slider = function () {
  const slides = document.querySelectorAll('.slide')
  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRight = document.querySelector('.slider__btn--right')
  const dotContainer = document.querySelector('.dots')

  let curSlide = 0
  const maxSlide = slides.length

  // Functions
  const createDots = function () {
    slides.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    })
  }

  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active')
    })

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active')
  }

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    })
  }

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0
    } else {
      curSlide++
    }
    goToSlide(curSlide)
    activeDot(curSlide)
  }

  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1
    } else {
      curSlide--
    }
    goToSlide(curSlide)
    activeDot(curSlide)
  }

  // Init Slider
  const init = function () {
    goToSlide(0)
    createDots()
    activeDot(0)
  }
  init()

  // Event Handlers
  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide()
    if (e.key === 'ArrowRight') nextSlide()
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset
      goToSlide(slide)
      activeDot(slide)
    }
  })
}
slider()

/////////////////////////////////
////////////////////////////////
///////////////////////////////
// LECTURES

// Selecting Elements
/*console.log(document.documentElement)
console.log(document.head)
console.log(document.body)

const header = document.querySelector('.header')
const allSections = document.querySelectorAll('.section')
console.log(allSections)

document.getElementById('section--1')
const allButtons = document.getElementsByTagName('button')
console.log(allButtons)

// Creating and Inserting elements
// .insertAdjacentHTML

const message = document.createElement('div')
message.classList.add('cookie-message')
// message.textContent = 'We use cookies for improved functionality and analytics'
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button> '
// header.prepend(message)
header.append(message)
// header.append(message.cloneNode(true))

// header.before(message)
// header.after(message)

// Delete Elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove()
  })

// STYLES
message.style.backgroundColor = '#37383d'
message.style.width = '120%'

console.log(message.style.backgroundColor)
console.log(getComputedStyle(message).height)

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'

// document.documentElement.style.setProperty('--color-primary', 'orangered')

// Attributes
const logo = document.querySelector('.nav__logo')
console.log(logo.src)
logo.alt = 'Beautiful minimalist logo'
console.log(logo.alt)

// non-standard
console.log(logo.designer)
console.log(logo.getAttribute('designer'))
logo.setAttribute('company', 'bankist')

console.log(logo.src)
console.log(logo.getAttribute('src'))

const link = document.querySelector('.nav__link--btn')
console.log(link.href)
console.log(link.getAttribute('href'))

// Data Attributes
console.log(logo.dataset.versionNumber)

// Classes
logo.classList.add('c', 'j')
logo.classList.remove('c', 'j')
logo.classList.toggle('c', 'j')
logo.classList.contains('c', 'j')
// Don't use
// logo.className = 'joans'*/

//--------------------------------------
// Types of Events and Event Handlers
//--------------------------------------
// const alerth1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading')
// }

// const h1 = document.querySelector('h1')
// h1.addEventListener('mouseenter', alerth1)

// setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000)

// h1.onmouseenter = function (e) {
//   alert('Do vdesesh')
// }

//--------------------------------------
// Capturing And Bubbling
//--------------------------------------

// Random color
/*const randomColorPicker = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const randomColor = () =>
  `rgb(${randomColorPicker(0, 255)},${randomColorPicker(
    0,
    255
  )},${randomColorPicker(0, 255)})`
console.log(randomColor())

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor()
  console.log('Link', e.target, e.currentTarget)

  // Stop propagation
  e.stopPropagation()   
})

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor()
  console.log('Container', e.target, e.currentTarget)

  e.stopPropagation()
})

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor()
  console.log('Nav', e.target, e.currentTarget)
})*/

//--------------------------------------
// DOM Traversing
//--------------------------------------
/*const h1 = document.querySelector('h1')

// Going downwards : child
console.log(h1.querySelectorAll('.highlight'))
console.log(h1.childNodes)
h1.firstElementChild.style.color = 'white'
h1.lastElementChild.style.color = 'orangered'

// Going upwards : parents
console.log(h1.parentNode)
console.log(h1.parentElement)

h1.closest('.header').style.background = 'var(--gradient-secondary)'
h1.closest('h1').style.background = 'var(--gradient-primary)'

// GOing Sideways
console.log(h1.nextElementSibling)

console.log(h1.previousSibling)
console.log(h1.nextSibling)

console.log(h1.parentElement.children)
;[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'
})*/

//--------------------------------------
// Intersection Observer API
//--------------------------------------
// const obsCallback = function (entries, observer) {
//   entries.forEach((ent) => {
//     console.log(ent)
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1)
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e)
// })

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e)
// })
