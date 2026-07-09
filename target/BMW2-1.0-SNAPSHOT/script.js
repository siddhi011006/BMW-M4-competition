console.log("SCRIPT VERSION: STARTING FROM FRAME 1");

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


let frames = [];
let current = 0;

const totalFrames = 100; // CHANGE THIS to your total number of images


// Load all images
for (let i = 1; i <= totalFrames; i++) {

    let img = new Image();

    let number = String(i).padStart(3, "0");

    img.src = `image/imagefile/ezgif-frame-${number}.png`;

    img.onload = () => {
        frames[i - 1] = img;
        console.log("Loaded frame", i);
    };
}


// Draw image full screen
function draw(img) {

    if (!img) return;

    const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
    );

    const width = img.width * scale;
    const height = img.height * scale;

    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.drawImage(
        img,
        x,
        y,
        width,
        height
    );
}


// Play animation
function animate() {

    if (frames.length > 0 && frames[current]) {

        draw(frames[current]);

        current++;

        if (current >= frames.length) {
            current = frames.length - 1; // stay at last frame
        }
    }


    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / 10);

}


animate();

// --- NEW UI LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Intersection Observer for Cinematic Animations
    const fadeElements = document.querySelectorAll('.fade-up, .fade-right, .fade-left, .zoom-in');
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => {
        // If element is already above the current viewport (user reloaded while scrolled down),
        // make it visible immediately so it doesn't animate when scrolling back up.
        if (el.getBoundingClientRect().top < window.innerHeight / 2) {
            el.classList.add('visible');
        } else {
            fadeObserver.observe(el);
        }
    });

    // 4. Number Counters Animation
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
        const duration = 1200; // ms, quick and snappy
        const steps = 60; // standard 60fps feel
        const stepTime = Math.abs(Math.floor(duration / steps));
        
        let current = 0;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target.toFixed(decimals);
                clearInterval(timer);
            } else {
                counter.innerText = current.toFixed(decimals);
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));

    // 5. Background Animation Reset on Return to Home
    const homeSection = document.getElementById('home');
    let hasLeftHome = false;
    
    if (homeSection) {
        const homeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    hasLeftHome = true;
                } else if (entry.isIntersecting && hasLeftHome) {
                    // Smoothly restart the background canvas animation from the first frame
                    current = 0; 
                    hasLeftHome = false;
                }
            });
        }, {
            threshold: 0.1
        });
        
        homeObserver.observe(homeSection);
    }
});