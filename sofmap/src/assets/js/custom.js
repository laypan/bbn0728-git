$(document).ready(function() {

    function initSideMenu() {
        const $sideMenu = $('#side-menu');

        $('#menu-bar').click(function() {
            $sideMenu.toggleClass('show');
        });

        $('#side-menu__backdrop').click(function() {
            $sideMenu.removeClass('show');
        });
    }

    function initJumpToTop() {
        $window = $(window);

        $('#jump-btn, #jump-m').click(function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }

    $(function() {
        initSideMenu();
        initJumpToTop();
    });




});


// // Add smooth scrolling to all links
$("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 800, function() {

            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    } // End if
});


window.onload = event => {
    resizeHEADER()

}
window.onresize = event => {
    resizeHEADER()
}
document.getElementById('newbar').addEventListener('click', event => {
    resizeHEADER()
})
document.getElementById('bgafter').addEventListener('click', event => {
    reSetCheckbox()
})
/*document.getElementById('bgafter').addEventListener('touchstart', event => {
    reSetCheckbox()
})*/

function reSetCheckbox() {
    document.getElementById('newbar').checked = false;
}

function resizeHEADER() {
    let hh = document.getElementsByClassName('real-header')[0].offsetHeight;
    let bh = document.body.offsetHeight - hh;
    let bw = document.body.offsetWidth + 3;
    const o2 = document.querySelector('header.real-header').querySelector('div.bgafter');
    const o = document.querySelector('div.mobile-menu');
    o.style.height = String(bh) + 'px';
    o2.style.width = String(bw) + 'px';
}
