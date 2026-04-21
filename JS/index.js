//!  Auto Type Phrase
const typed = new Typed(".auto-input", {
  strings: ["We do everything nice nice for the right price!"],
  typeSpeed: 75,
  // backSpeed: 25,
  // delay: 1000,
  loop: false,
});




//mt  -- AutoPic --          ---------
// Image array
// const images = [
//   "before-1.jpg",
//   "before-2.jpg",
//   "before-3.jpg",
//   "before-4.jpg",
//   "before-5.jpg",
//   "before-6.jpg",
//   "before-7.jpg",
//   "before-8.jpg",
//   "before-9.jpg",
//   "after-1.jpg",
//   "after-2.jpg",
//   "after-3.jpg",
//   "after-4.jpg",
//   "after-5.jpg",
//   "after-6.jpg",
//   "after-7.jpg"
// ]

// //st assign element
// const imgElement = document.getElementById("autoPic_return");

// let index = 0;

// //st           Fade effect
// function changeImage() {
//   // Opacity
//   imgElement.style.opacity = 0;

//   // Set Source + Image
//   setTimeout(() => {
//     imgElement.src = "image/jobs/brisbon-RD/" + images[index];
//     imgElement.style.opacity = 1;
//     imgElement.style.opacity = 2;


//     index = (index + 1) % images.length;

//     // Random delay
//     const delay = Math.floor(Math.random() * (8000 - 3000 + 1)) + 2000;

//     setTimeout(changeImage, delay);
//   }, 600); // fade out duration
// }


// // run after window load
// window.onload = function () {
//   changeImage();
// };





//mt   ----------        Reusable function for quick pic feature    ------------------------------

// Image Selector By Job + Display
function createSlideshow(elementId, images, minDelay = 5000, maxDelay = 10000) {
  const imgElement = document.getElementById(elementId);

  if (!imgElement) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  let index = 0;

  //st Change Image/ Fade
  function changeImage() {
    // Fade out
    imgElement.style.opacity = 0;

    setTimeout(() => {
      // Change image
      imgElement.src = images[index];

      // Fade in
      imgElement.style.opacity = 1;

      // Next image index
      index = (index + 1) % images.length;

      // Random delay
      const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

      setTimeout(changeImage, delay);
    }, 500); // matches CSS transition
  }

  // Start slideshow
  changeImage();
}

//st Organized slideshow data By Job
const slideshows = [
  {
    id: "job1",
    // Brisbon RD.
    images: [
      "image/jobs/brisbon-RD/before-1.jpg",
      "image/jobs/brisbon-RD/before-2.jpg",
      "image/jobs/brisbon-RD/before-3.jpg",
      "image/jobs/brisbon-RD/before-4.jpg",
      "image/jobs/brisbon-RD/before-5.jpg",
      "image/jobs/brisbon-RD/before-6.jpg",
      "image/jobs/brisbon-RD/before-7.jpg",
      "image/jobs/brisbon-RD/before-8.jpg",
      "image/jobs/brisbon-RD/before-9.jpg",
      "image/jobs/brisbon-RD/after-1.jpg",
      "image/jobs/brisbon-RD/after-2.jpg",
      "image/jobs/brisbon-RD/after-3.jpg",
      "image/jobs/brisbon-RD/after-4.jpg",
      "image/jobs/brisbon-RD/after-5.jpg",
      "image/jobs/brisbon-RD/after-6.jpg",
      "image/jobs/brisbon-RD/after-7.jpg"
    ]
  },
  {
    id: "job2",
    // 103 Hemlock St Somerset.
    images: [
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-1.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-2.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-3.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-4.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-5.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-6.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-7.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-8.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/before-9.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-1.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-2.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-3.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-4.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-5.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-6.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-7.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-8.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-9.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-10.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-11.jpg",
      "image/jobs/Somerset-MA_103-Hemlock-ST_02726/after-12.jpg"
    ]
  },
  {
    id: "job3",
    // 13 Charlotte White rd Westport Ma
    images: [
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-1.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-2.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-3.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-4.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-5.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-6.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-7.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-8.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/before-9.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-1.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-2.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-3.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-4.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-5.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-6.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-7.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-8.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-9.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-10.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-11.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-12.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-13.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-14.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-15.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-16.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-17.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-18.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-19.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-20.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-21.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-22.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-23.jpg",
      "image/jobs/Westport-MA_13-Charlotte-White-RD_02790/after-24.jpg"
    ],
    minDelay: 3000,
    maxDelay: 8000
  }
];

// Start them all
slideshows.forEach(slideshow => {
  createSlideshow(
    slideshow.id,
    slideshow.images,
    slideshow.minDelay,
    slideshow.maxDelay
  );
});