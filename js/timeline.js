// Implementation of the timeline JS
const api_url = "https://sheetdb.io/api/v1/58f61be4dda40";
// Pulls the sheets API into a json
// fetch('https://sheetdb.io/api/v1/58f61be4dda40')
//     .then(response => response.json())
//     .then(data => {
//         // console.log(data);
//         // const json = data;
//         var ogData = JSON.parse(JSON.stringify(data));
//         console.log(ogData);
//         for(var i = 0; i < ogData.length; i++){
//             console.log(ogData[i]);
//         }
//     })
//     .catch(error => {
//         console.error(error);
// });
async function getapi(url) {
    // Storing response
    const response = await fetch(url);
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        Object.keys(data[i]).forEach((key,index) => {
            // console.log(`${key}: ${data[i][key]}`);
            switch(index){
                case 0:
                    console.log("id: " + data[i][key]);
                    if(data[i][key] == 1){
                        console.log("First one");
                    }
                    break;
                case 1:
                    console.log("name: " + data[i][key]);
                    break;
                case 2:
                    console.log("age: " + data[i][key]);
                    break;
                case 3:
                    console.log("Comment: " + data[i][key]);
                    break;
            }
        })
    }
    // show(data);
}
// // Calling that async function
getapi(api_url);
    
// Original 
var $grid = $('.grid').isotope({
  itemSelector: '.element-item',
  layoutMode: 'fitRows',
  getSortData: {
    name: '.name',
    symbol: '.symbol',
    number: '.number parseInt',
    category: '[data-category]',
    weight: function( itemElem ) {
      var weight = $( itemElem ).find('.weight').text();
      return parseFloat( weight.replace( /[\(\)]/g, '') );
    }
  }
});
// var $grid = ('.grid').isotope({
//   // set itemSelector so .grid-sizer is not used in layout
//   itemSelector: '.content',
//   layoutMode: 'masonry',
//   cellsByRow:{
//     columnWidth: 200,
//     rowHeight:150
//   },
//   // percentPosition: true,
//   masonry: {
//     // use element for option
//     columnWidth: '.grid-sizer'
//   }
// })
// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan50: function() {
    var number = $(this).find('.number').text();
    return parseInt( number, 10 ) > 50;
  },
  // show if name ends with -ium
  ium: function() {
    var name = $(this).find('.name').text();
    return name.match( /ium$/ );
  }
};

// bind filter button click
$('#filters').on( 'click', 'button', function() {
  var filterValue = $( this ).attr('data-filter');
  // use filterFn if matches value
  filterValue = filterFns[ filterValue ] || filterValue;
  $grid.isotope({ filter: filterValue });
});

// bind sort button click
$('#sorts').on( 'click', 'button', function() {
  var sortByValue = $(this).attr('data-sort-by');
  $grid.isotope({ sortBy: sortByValue });
});
// (function () {
//   "use strict";

//   // define variables
//   var items = document.querySelectorAll(".timeline li");

//   // check if an element is in viewport
//   // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
//   function isElementInViewport(el) {
//     var rect = el.getBoundingClientRect();
//     return (
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <=
//         (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
//   }

//   function callbackFunc() {
//     for (var i = 0; i < items.length; i++) {
//       if (isElementInViewport(items[i])) {
//         items[i].classList.add("in-view");
//       }
//     }
//   }

//   // listen for events
//   window.addEventListener("load", callbackFunc);
//   window.addEventListener("resize", callbackFunc);
//   window.addEventListener("scroll", callbackFunc);
// })();

// change is-checked class on buttons
$('.button-group').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'button', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
  });
});