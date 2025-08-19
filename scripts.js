(function () {
	const tryPlayAudio = (audioEl) => {
		if (!audioEl) return Promise.resolve();
		try {
			const playPromise = audioEl.play();
			if (playPromise && typeof playPromise.then === "function") {
				return playPromise.catch(() => Promise.reject());
			}
			return Promise.resolve();
		} catch (_) {
			return Promise.reject();
		}
	};

	const createAudioToggle = (audioEl) => {
		const btn = document.createElement("button");
		btn.className = "audio-toggle";
		btn.type = "button";
		btn.textContent = audioEl && !audioEl.paused ? "Pause music" : "Play music";
		btn.addEventListener("click", () => {
			if (!audioEl) return;
			if (audioEl.paused) {
				audioEl.play().then(() => {
					btn.textContent = "Pause music";
				}).catch(() => {/* ignore */});
			} else {
				audioEl.pause();
				btn.textContent = "Play music";
			}
		});
		document.body.appendChild(btn);
		return btn;
	};

	const spawnConfetti = (count = 80) => {
		const colors = ["#ff4e50", "#ff7a59", "#f9d423", "#24c6dc", "#4cb8c4", "#36d1dc", "#a1c4fd", "#c2e9fb"];
		const pieces = [];
		for (let i = 0; i < count; i++) {
			const piece = document.createElement("div");
			piece.className = "confetti-piece";
			piece.style.background = colors[Math.floor(Math.random() * colors.length)];
			piece.style.left = Math.random() * 100 + "vw";
			piece.style.transform = `translateY(-20px) rotate(${Math.random() * 360}deg)`;
			document.body.appendChild(piece);
			pieces.push(piece);
		}

		pieces.forEach((piece) => {
			const duration = 2 + Math.random() * 2.5;
			const delay = Math.random() * 0.35;
			const xDrift = (Math.random() - 0.5) * 200;
			gsap.to(piece, {
				y: window.innerHeight + 40,
				x: `+=${xDrift}`,
				rotation: `+=${180 + Math.random() * 360}`,
				opacity: 0.9,
				ease: "power1.out",
				duration,
				delay,
				onComplete: () => piece.remove()
			});
		});
	};

	window.addEventListener("DOMContentLoaded", () => {
		const container = document.querySelector(".container");
		const title = document.querySelector("h1");
		const icons = document.querySelectorAll(".icon-container i");
		const message = document.querySelector(".birthday-message");
		const gift = document.querySelector(".gift-box-1");
		const giftReveal = document.querySelector(".gift-box-2");
		const audioEl = document.getElementById("birthdaySong");

		gsap.set([title, icons, message, gift, giftReveal], { autoAlpha: 0, y: 10 });

		const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
		tl.to(title, { autoAlpha: 1, y: 0, scale: 1.02 })
			.to(icons, { autoAlpha: 1, y: 0, stagger: 0.12 }, "<0.05")
			.to(message, { autoAlpha: 1, y: 0 }, "-=0.2")
			.to(gift, { autoAlpha: 1, y: 0 }, "-=0.35");

		// Subtle floating for icons
		icons.forEach((icon, idx) => {
			gsap.to(icon, {
				y: "+=6",
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				duration: 1.4 + idx * 0.2
			});
		});

		let isOpen = false;
		if (gift) {
			gift.addEventListener("click", () => {
				if (!isOpen) {
					isOpen = true;
					if (giftReveal) {
						gsap.set(giftReveal, { autoAlpha: 0, scale: 0.85, y: -8 });
						gsap.to(giftReveal, { autoAlpha: 1, scale: 1, y: 0, ease: "back.out(1.6)", duration: 0.9 });
					}
					gsap.to(gift, { rotation: 10, y: -10, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.inOut" });
					spawnConfetti(90);
				} else {
					isOpen = false;
					if (giftReveal) {
						gsap.to(giftReveal, { autoAlpha: 0, scale: 0.9, y: -8, duration: 0.4, ease: "power2.in" });
					}
				}
			});
		}

		// Audio handling with autoplay fallback
		let btn;
		tryPlayAudio(audioEl)
			.then(() => {
				btn = createAudioToggle(audioEl);
				btn.textContent = "Pause music";
			})
			.catch(() => {
				btn = createAudioToggle(audioEl);
				btn.textContent = "Play music";
			});
	});
})();

// Remove unused GSAP animation since there's no .box element
function createStar() {
    const star = document.createElement('i');
    star.className = 'fas fa-star falling-star';
    star.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 3000);
}

setInterval(createStar, 300);

const giftBox = document.querySelector('.gift-box-1');
const teddy = document.querySelector('.gift-box-2');

giftBox.addEventListener('click', () => {
    giftBox.style.display = 'none';
    teddy.style.display = 'block';
    
    setTimeout(() => {
        giftBox.style.display = 'block';
        teddy.style.display = 'none';
    }, 6000);
});

// ... existing code ...

// Method 1: Try to play as soon as possible
window.addEventListener('load', function() {
    const audio = document.getElementById('birthdaySong');
    audio.loop = true;
    
    // Try multiple times to start playing
    const playAttempt = setInterval(() => {
        audio.play()
        .then(() => {
            clearInterval(playAttempt);
        })
        .catch((error) => {
            console.log("Play prevented by browser", error);
        });
    }, 1000);
});

// Method 2: Play on any user interaction with the page
document.addEventListener('click', function() {
    const audio = document.getElementById('birthdaySong');
    audio.loop = true;
    audio.play();
}, { once: true }); // Will only trigger once