// Teodora Kovacevic, teko5467
// Rolig funktion: gör att man kan flytta runt fönstret
$(document).ready(function () {
    const $window = $(".xp-window");
    const $titlebar = $(".xp-titlebar");

    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    $titlebar.mousedown(function (e) {
        isDragging = true;

        const rect = $window[0].getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        $window.css("z-index", 1000);

        e.preventDefault();
    });

    $(document).mousemove(function (e) {
        if (!isDragging) return;

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, $(window).width() - $window.outerWidth()));
        newTop = Math.max(0, Math.min(newTop, $(window).height() - $window.outerHeight()));

        $window.css({
            left: newLeft + "px",
            top: newTop + "px"
        });
    });

    $(document).mouseup(function () {
        if (isDragging) {
            isDragging = false;
            $window.css("z-index", 100);
        }
    });

    const centerLeft = ($(window).width() - $window.outerWidth()) / 2;
    $window.css({ left: centerLeft + "px" });
});
