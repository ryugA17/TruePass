function loadSVG () {
    fetch("city.svg")
    .then((response) => { return response.text();})
    .then((svg) => {
        document.getElementById('bg_city').innerHTML = svg;
        document.querySelector('#bg_city svg').setAttribute("preserveAspectRatio", "xMidYMid slice");
        setAnimationScroll();
    })
}
loadSVG();

// Setup navigation
document.addEventListener('DOMContentLoaded', function() {
    // Find the navigation link to the React app
    const reactAppLinks = document.querySelectorAll('a[href="/"]');
    
    // Add click handler to all links pointing to React app
    reactAppLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Set visited flag in localStorage
            localStorage.setItem('visited', 'true');
            console.log('Setting visited to true, navigating to React app');
        });
    });
});

function setAnimationScroll () {
    gsap.registerPlugin(ScrollTrigger);
    let runAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: "#bg_city",
            start: "top top",
            end: "+=1000",
            scrub: true,
            pin: true
        }
    });

    runAnimation.add([
        gsap.to("#bg_city svg", 2, {
            scale: 1.5
        }),
        gsap.to("#full_city", 2, {
            opacity: 0
        })
    ])
    .add([
        gsap.to("#building_top", 2, {
            y: -200,
            opacity: 0
        }),
        gsap.to("#wall_side", 2, {
            x: -200,
            opacity: 0
        }),
        gsap.to("#wall_front", 2, {
            x: 200, y: 200,
            opacity: 0
        })
    ])
    .add([
        gsap.to("#interior_wall_side", 2, {
            x: -200,
            opacity: 0
        }),
        gsap.to("#interior_wall_top", 2, {
            y: -200,
            opacity: 0
        }),
        gsap.to("#interior_wall_side_2", 2, {
            opacity: 0
        }),
        gsap.to("#interior_wall_front", 2, {
            opacity: 0
        })
    ]);
}