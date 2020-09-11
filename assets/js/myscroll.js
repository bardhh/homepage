// $(document).on("scroll", function(){ 
// if($(document).scrollTop() > 400)
//     {
//         $(".bs-docs-sidenav").css("position","fixed");
//         $(".bs-docs-sidenav").animate({"top":"0"},500);
//     }
// else
//     {
//         // $(".bs-docs-sidenav").css("position","fixed");
//         // $(".bs-docs-sidenav").animate({"top":"0"},500);
//         $(".bs-docs-sidenav").css("position","relative");
//     }
// });

// //STICKY NAV
// $(document).ready(function () {  
//     $(".bs-docs-sidenav").css("position","fixed");
//     var top = $('.bs-docs-sidenav').offset().top - parseFloat($('.bs-docs-sidenav').css('marginTop').replace(/auto/, 100));
//     $(document).scroll(function (event) {
//       // what the y position of the scroll is
//       var y = $(".bs-docs-sidenav").scrollTop();
  
//       // whether that's below the form
//       if (y >= top) {
//         // if so, ad the fixed class
//         $('.bs-docs-sidenav').addClass('fixed');
//       } else {
//         // otherwise remove it
//         $('.bs-docs-sidenav').removeClass('fixed');
//       }
//     });
//   }); 

// When the user scrolls the page, execute myFunction


// window.onscroll = function() {myFunction()};

// // Get the header
// var header = document.getElementById(".bs-docs-sidenav");

// // Get the offset position of the navbar
// var sticky = header.offsetTop;

// // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
// function myFunction() {
//   if (window.pageYOffset > sticky) {
//     header.classList.add("sticky");
//   } else {
//     header.classList.remove("sticky");
//   }
// }