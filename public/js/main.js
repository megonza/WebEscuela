// ---------- Main Slider ---------- //
let slideIndex = 1;
showSlides(slideIndex);

// Control next and previous slides
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Control thumbnail image
function currentSlide(n) {
    showSlides(slideIndex = n);
} 
// Display current slide
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("header-slider");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1;}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active"
}