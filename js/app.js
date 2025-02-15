var App = (function () {
    var loadSlider = function () {
        var AboutSlider = $(".about-slider");
        var JournalistsSlider = $(".journalists-slider");
        var CustomerTestimonialSlider = $(".customer-testimonial-slider");
        var TestimonialSlider = $(".testimonial-slider");
        var owl = $(
            ".about-slider, .testimonial-slider, .journalists-slider, .customer-testimonial-slider"
        );

        var MouseScrolling = $(".mouse-scrolling");

        if (MouseScrolling.length > 0) {
            MouseScrolling.owlCarousel({
                nav: false,
                autoplayTimeout: 20000,
                slideSpeed: 5000,
                paginationSpeed: 600,
                autoplay: true,
                dots: true,
                dotsData: true,
                margin: 20,
                items: 1,
                loop: true,
            });
        }

        /*
        Disabling as per request - 4_5823287414931592245
        owl.on("mousewheel", ".owl-stage", function (e) {
            if (e.deltaY > 0) {
                owl.trigger("next.owl");
            } else {
                owl.trigger("prev.owl");
            }
            e.preventDefault();
        });
        */

        $(".next-btn").click(function () {
            owl.trigger("next.owl.carousel");
        });
        $(".prev-btn").click(function () {
            owl.trigger("prev.owl.carousel");
        });

        if (AboutSlider.length > 0) {
            AboutSlider.owlCarousel({
                nav: false,
                autoplayTimeout: 7000,
                slideSpeed: 500,
                paginationSpeed: 600,
                autoplay: true,
                dots: false,
                margin: 20,
                items: 1.3,
                loop: true,
                autoplaySpeed: 3000,
                center: true,
                responsive: {
                    600: {
                        items: 2,
                    },
                    768: {
                        items: 2,
                    },
                    1000: {
                        items: 3,
                    },
                    1200: {
                        items: 3.5,
                    },
                    1600: {
                        items: 3.5,
                    },
                    1900: {
                        items: 4.5,
                    },
                },
            });
        }

        if (JournalistsSlider.length > 0) {
            JournalistsSlider.owlCarousel({
                nav: false,
                autoplayTimeout: 7000,
                slideSpeed: 500,
                paginationSpeed: 600,
                autoplay: false,
                dots: false,
                margin: 20,
                items: 1,
                loop: true,
                autoplaySpeed: 3000,
                center: true,
                responsive: {
                    600: {
                        items: 1,
                    },
                    768: {
                        items: 3,
                    },
                    1000: {
                        items: 3,
                    },
                },
            });
        }

        if (CustomerTestimonialSlider.length > 0) {
            CustomerTestimonialSlider.owlCarousel({
                nav: false,
                autoplayTimeout: 7000,
                slideSpeed: 500,
                paginationSpeed: 600,
                autoplay: false,
                dots: false,
                margin: 20,
                items: 1,
                loop: true,
                autoplaySpeed: 3000,
                center: true,
                responsive: {
                    600: {
                        items: 1,
                    },
                    768: {
                        items: 3,
                    },
                    1000: {
                        items: 3,
                    },
                },
            });
        }

        if (TestimonialSlider.length > 0) {
            TestimonialSlider.owlCarousel({
                nav: false,
                autoplayTimeout: 7000,
                slideSpeed: 500,
                paginationSpeed: 600,
                autoplay: true,
                dots: false,
                margin: 20,
                items: 1.3,
                loop: true,
                autoplaySpeed: 3000,
                center: true,
                responsive: {
                    600: {
                        items: 2,
                    },
                    768: {
                        items: 2,
                    },
                    1000: {
                        items: 2.5,
                    },
                    1360: {
                        items: 2.5,
                        center: false,
                    },
                    1600: {
                        items: 3.5,
                        center: false,
                    },
                    1900: {
                        items: 3.5,
                        center: false,
                    },
                },
            });
        }
    };

    var ScrollHeader = function () {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            if (scroll >= 100) {
                $("header").addClass("scroll-header");
            } else {
                $("header").removeClass("scroll-header");
            }
        });
    };

    var ToolTip = function () {
        var tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    };

    var mailToggleMobile = function () {
        $(".mail-toggle, .mail-back").click(function () {
            windowWidth = $(window).width();

            if (windowWidth <= 1365) {
                $(".right-side").slideToggle("slow", function () {
                    if ($(".right-side").css("display") == "none") {
                        $("body").removeClass("no-scroll");
                    } else {
                        $("body").addClass("no-scroll");
                    }
                });
            }
        });
    };

    var copyEmail = function () {
        try {
            document.getElementById("email-copy").onclick = function () {
                var toastElList = [].slice.call(
                    document.querySelectorAll(".toast")
                );
                var toastList = toastElList.map(function (toastEl) {
                    // Creates an array of toasts (it only initializes them)
                    return new bootstrap.Toast(toastEl); // No need for options; use the default options
                });
                toastList.forEach((toast) => toast.show()); // This show them

                console.log(toastList); // Testing to see if it works
            };
        } catch (e) {
            console.log(`copy email error`);
        }
    };

    const refresh = function () {
        try {
            $("body").on("click", "referesh-btn", function () {
                console.log(`clicked refresh`);
            });
        } catch (e) {
            console.log(`well`);
        }
    };

    const enableContactButton = function () {
        try {
            const formEmail = $('#report-form input[type="email"]');
            const formMessage = $("#report-form textarea");
            $('#report-form input[type="email"]').on("keyup", function () {
                if (
                    $(this).val().toString() !== "" &&
                    formMessage.val().toString() !== ""
                ) {
                    $('#report-form button[type="submit"]').removeAttr(
                        "disabled"
                    );
                } else {
                    $('#report-form button[type="submit"]').attr(
                        "disabled",
                        "disabled"
                    );
                }
            });
            $("#report-form textarea").on("keyup", function () {
                const characterCount = $(this).val().length;
                $("#character_count").text(parseInt(800 - characterCount));
                if (
                    $(this).val().toString() !== "" &&
                    formEmail.val().toString() !== ""
                ) {
                    $('#report-form button[type="submit"]').removeAttr(
                        "disabled"
                    );
                } else {
                    $('#report-form button[type="submit"]').attr(
                        "disabled",
                        "disabled"
                    );
                }
            });
        } catch (e) {
            console.log(`well`);
        }
    };

    return {
        init: function () {
            loadSlider();
            ScrollHeader();
            ToolTip();
            mailToggleMobile();
            copyEmail();
            refresh();
            enableContactButton();
        },
    };
})();

$(document).ready(function () {
    App.init();
});
