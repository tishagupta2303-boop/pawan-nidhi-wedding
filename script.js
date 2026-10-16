document.addEventListener("DOMContentLoaded", function () {

    // OPENING ENVELOPE

    const openingScreen = document.getElementById("opening-screen");
    const envelope = document.getElementById("envelope");
    const openButton = document.getElementById("open-button");const weddingMusic = document.getElementById("wedding-music");
    const weddingContent = document.getElementById("wedding-content");

    let websiteOpened = false;

    if (openButton) {

        openButton.addEventListener("click", function () {if (weddingMusic) {
    weddingMusic.volume = 0.45;

    weddingMusic.play().catch(function (error) {
        console.log("Music playback could not start:", error);
    });
}

            if (websiteOpened) return;

            websiteOpened = true;

            envelope.classList.add("is-opening");

            setTimeout(function () {

                weddingContent.classList.remove("hidden");
                openingScreen.classList.add("opened");

                initialiseRevealAnimations();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }, 1600);

            setTimeout(function () {
                openingScreen.style.display = "none";
            }, 3000);

        });

    }


    // SCROLL REVEAL

    function initialiseRevealAnimations() {

        const elements = document.querySelectorAll(".reveal");

        if ("IntersectionObserver" in window) {

            const observer = new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            }, {
                threshold: 0.12
            });

            elements.forEach(function (element) {
                observer.observe(element);
            });

        } else {

            elements.forEach(function (element) {
                element.classList.add("visible");
            });

        }

    }


    // HEART SCRATCH TO REVEAL

    const canvas = document.getElementById("scratch-canvas");
    const sparkleLayer = document.getElementById("sparkle-layer");

    if (canvas && sparkleLayer) {

        const ctx = canvas.getContext("2d");

        let isScratching = false;
        let scratchRevealed = false;
        let lastCheck = 0;

        function setupScratchCanvas() {

            if (scratchRevealed) return;

            const rect = canvas.getBoundingClientRect();

            if (!rect.width || !rect.height) return;

            const dpr = window.devicePixelRatio || 1;

            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const gradient = ctx.createLinearGradient(
                0,
                0,
                rect.width,
                rect.height
            );

            gradient.addColorStop(0, "#c6a04b");
            gradient.addColorStop(0.2, "#fff0bd");
            gradient.addColorStop(0.4, "#e8c86f");
            gradient.addColorStop(0.65, "#fff4d1");
            gradient.addColorStop(0.85, "#bd9138");
            gradient.addColorStop(1, "#f9e5a0");

            ctx.globalCompositeOperation = "source-over";

            ctx.fillStyle = gradient;

            ctx.fillRect(
                0,
                0,
                rect.width,
                rect.height
            );

            // Golden sparkles on the scratch layer

            for (let i = 0; i < 120; i++) {

                const x = Math.random() * rect.width;
                const y = Math.random() * rect.height;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    Math.random() * 1.8 + 0.4,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "rgba(255,255,255,0.65)";
                ctx.fill();

            }

            ctx.globalCompositeOperation = "destination-out";

        }


        function getPosition(event) {

            const rect = canvas.getBoundingClientRect();

            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };

        }


        function scratchAt(event) {

            if (!isScratching || scratchRevealed) return;

            const position = getPosition(event);

            ctx.beginPath();

            ctx.arc(
                position.x,
                position.y,
                27,
                0,
                Math.PI * 2
            );

            ctx.fill();

            const now = Date.now();

            if (now - lastCheck > 150) {

                lastCheck = now;

                checkScratchProgress();

            }

        }


        function checkScratchProgress() {

            if (scratchRevealed) return;

            const rect = canvas.getBoundingClientRect();

            const sampleCanvas = document.createElement("canvas");

            sampleCanvas.width = Math.max(
                1,
                Math.floor(rect.width / 5)
            );

            sampleCanvas.height = Math.max(
                1,
                Math.floor(rect.height / 5)
            );

            const sampleCtx = sampleCanvas.getContext("2d", {
                willReadFrequently: true
            });

            sampleCtx.drawImage(
                canvas,
                0,
                0,
                sampleCanvas.width,
                sampleCanvas.height
            );

            const pixels = sampleCtx.getImageData(
                0,
                0,
                sampleCanvas.width,
                sampleCanvas.height
            ).data;

            let transparentPixels = 0;

            const totalPixels =
                sampleCanvas.width * sampleCanvas.height;

            for (let i = 3; i < pixels.length; i += 4) {

                if (pixels[i] < 100) {
                    transparentPixels++;
                }

            }

            const scratchedPercentage =
                transparentPixels / totalPixels;

            // Reveal after approximately 20% of the canvas is scratched.

            if (scratchedPercentage >= 0.20) {

                scratchRevealed = true;

                canvas.classList.add("cleared");

                createFallingSparkles();

            }

        }


        function createFallingSparkles() {

            const symbols = ["✦", "✧", "✦", "·", "✧"];

            for (let i = 0; i < 42; i++) {

                const sparkle = document.createElement("span");

                sparkle.className = "falling-sparkle";

                sparkle.textContent =
                    symbols[Math.floor(Math.random() * symbols.length)];

                sparkle.style.left = Math.random() * 100 + "%";

                sparkle.style.animationDelay =
                    Math.random() * 1.4 + "s";

                sparkle.style.fontSize =
                    (10 + Math.random() * 12) + "px";

                sparkleLayer.appendChild(sparkle);

                setTimeout(function () {
                    sparkle.remove();
                }, 4500);

            }

        }


        canvas.addEventListener("pointerdown", function (event) {

            if (scratchRevealed) return;

            isScratching = true;

            canvas.setPointerCapture(event.pointerId);

            scratchAt(event);

        });


        canvas.addEventListener("pointermove", function (event) {

            scratchAt(event);

        });


        canvas.addEventListener("pointerup", function () {

            isScratching = false;

            checkScratchProgress();

        });


        canvas.addEventListener("pointercancel", function () {

            isScratching = false;

        });


        // Wait for the website to open before measuring the canvas.

        if (!weddingContent.classList.contains("hidden")) {
            requestAnimationFrame(setupScratchCanvas);
        } else {

            openButton.addEventListener("click", function () {

                setTimeout(function () {
                    requestAnimationFrame(setupScratchCanvas);
                }, 1700);

            }, { once: true });

        }


        window.addEventListener("resize", function () {

            if (!scratchRevealed) {
                setupScratchCanvas();
            }

        });

    }


    // LIVE COUNTDOWN
    // 11 December 2026, 7:30 PM IST

    const weddingDate = new Date(
        "2026-12-11T19:30:00+05:30"
    );

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const countdownMessage = document.getElementById("countdown-message");

    function updateCountdown() {

        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }

        const difference = weddingDate.getTime() - Date.now();

        if (difference <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            if (countdownMessage) {
                countdownMessage.textContent =
                    "Today is the beginning of forever.";
            }

            return;

        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");

        if (countdownMessage) {
            countdownMessage.textContent =
                "Every second brings us closer.";
        }

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);


    // GUEST OPINION FORM

    const guestForm = document.getElementById("guest-form");
    const thankYouMessage = document.getElementById("thank-you-message");

    if (guestForm && thankYouMessage) {

        guestForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!guestForm.reportValidity()) {
                return;
            }

            const guestName =
                document.getElementById("guest-name").value.trim();

            const guestOpinion =
                document.getElementById("guest-opinion").value.trim();

            if (!guestName || !guestOpinion) {
                return;
            }

            guestForm.classList.add("hidden");

            thankYouMessage.classList.remove("hidden");

            thankYouMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    }

});