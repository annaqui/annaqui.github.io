$(document).ready(function () {
    //Scrollspy, to change active menu item when scrolling
    $('body').scrollspy({ target: '.navbar-default' })
    
    //To close the dropdown menu after clicking - from twbs Github issue
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
            $(this).collapse('hide');
        }
    });
    
    //insert current year into footer
    document.getElementById("year").innerHTML = new Date().getFullYear();
});
