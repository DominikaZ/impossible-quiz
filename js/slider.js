const slider = document.getElementById('slider');
const slides = document.querySelectorAll(".slide");
const nextSlide = document.getElementById("next-slide");
const prevSlide = document.getElementById("prev-slide");

setupSlider();

// SLIDER //////////////////////////////////////////////////////

function setupSlider() {
    let intervalID;
    let curSlide = 0;
    let maxSlide = slides.length - 2; // last one not to be alone

    slides.forEach((slide, indx) => {
        slide.style.transform = `translateX(${indx * 100}%)`;
    });

    let setSliderInterval = function() {
        intervalID = setInterval(function() {
            slideToNext()
        }, 3000);
    }

    let slideToNext = function() {
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }
    
        slides.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
    }

    let slideToPrev = function() {
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }
    
        slides.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
    }

    setSliderInterval();

    nextSlide.addEventListener("click", () => {
        slideToNext();
        clearInterval(intervalID);
        setSliderInterval();
    })

    prevSlide.addEventListener("click", () => {
        slideToPrev();
        clearInterval(intervalID);
        setSliderInterval();
    })
}