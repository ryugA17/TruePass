function loadSVG () {
    fetch("city.svg")
    .then((response) => { return response.text();})
    .then((svg) => {
        const bgCity = document.getElementById('bg_city');
        if (bgCity) {
            bgCity.innerHTML = svg;
            const svgElement = document.querySelector('#bg_city svg');
            if (svgElement) {
                svgElement.setAttribute("preserveAspectRatio", "xMidYMid slice");
                setAnimationScroll();
            }
        }
    }).catch(error => {
        console.error("Error loading SVG:", error);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load the SVG
    loadSVG();
    
    // Set up the navigation button
    const enterAppLink = document.getElementById('enter-app-link');
    if (enterAppLink) {
        enterAppLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Set visited flag in localStorage and navigate
            localStorage.setItem('visited', 'true');
            console.log('Navigating to main app...');
            
            // Navigate to the React app root
            window.location.href = '/';
        });
    } else {
        console.error("Navigation button not found!");
    }
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