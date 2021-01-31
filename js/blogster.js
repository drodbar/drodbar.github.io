var url = location.href.replace(/\/$/, '').split("/");

var currentPage = url[url.length - 1];
console.debug(currentPage)
var navLinks = document.getElementsByTagName("nav")[0].getElementsByTagName("a");
var i = 0;
for (i; i < navLinks.length; i++) {
    var lb = navLinks[i].href.replace(/\/$/, '').split("/");
    var elem = lb[lb.length - 1]
    console.debug(elem)
    if (elem == currentPage) {
        navLinks[i].className += " active";

    }
}

// Generate link anchors for all headlines.
$('h2,h3,h4,h5,h6').filter('[id]').each(function () {
    $(this).html('<a href="#'+$(this).attr('id')+'">' + $(this).text() + '</a>');
});