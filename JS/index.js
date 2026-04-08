//!  Auto Type Phrase
const typed = new Typed(".auto-input", {
  strings: ["We do everything nice nice for the right price!"],
  typeSpeed: 75,
  // backSpeed: 25,
  // delay: 1000,
  loop: false,
});





const images = [
  "before-1.jpg",
  "before-2.jpg",
  "before-3.jpg",
  "before-4.jpg",
  "before-5.jpg",
  "before-6.jpg",
  "before-7.jpg",
  "before-8.jpg",
  "before-9.jpg",
  "after-1.jpg",
  "after-2.jpg",
  "after-3.jpg",
  "after-4.jpg",
  "after-5.jpg",
  "after-6.jpg",
  "after-7.jpg"
]

const imgElement = document.getElementById("autoPic_return");

let index = 0;

// function changeImage() {
//   // change image
//   imgElement.src = "image/jobs/brisbon-RD/" + images[index];

//   // move to next index
//   index = (index + 1) % images.length; // loop back to start

//   // Random delay between 2 to 5 seconds
//   const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

//   setTimeout(changeImage, delay);

// }


//@          Fade effect
function changeImage() {
  // Opacity
  imgElement.style.opacity = 0;

  // Set Source + Image
  setTimeout(() => {
    imgElement.src = "image/jobs/brisbon-RD/" + images[index];
    imgElement.style.opacity = 1;
    imgElement.style.opacity = 2;


    index = (index + 1) % images.length;

    // Random delay
    const delay = Math.floor(Math.random() * (8000 - 3000 + 1)) + 2000;

    setTimeout(changeImage, delay);
  }, 600); // fade out duration
}


window.onload = function () {
  changeImage();
};