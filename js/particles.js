let CloneTemplate = document.querySelector("#CookieParticleEffetct");
const particlesElement = document.querySelector("#particles");
let x = 0;
let y = 0;

// var ParticlesSliderElement = document.getElementById("ParticlesSlider");
let MaxParticles = 10;

/* Load data */
// let DataMaxParticles = Number(localStorage.getItem("MaxParticles"));

// console.log(`>>>--------------------------`);

// MaxParticles = DataMaxParticles >= 0 ? DataMaxParticles : 0.1;

// ParticlesSliderElement.value = MaxParticles;

// function ParticlesChange() {
// MaxParticles = Number(ParticlesSliderElement.value);
// ParticlesSliderElement.nextElementSibling.innerHTML = Math.round(ParticlesSliderElement.value);

// clearInterval(PlayAudioTest);
// PlayAudioTest = setInterval(() => {
//   var audio = new Audio("audio/Config Menu VFX1.wav");
//   audio.volume = AudioVolume;
//   audio.play();
//   clearInterval(PlayAudioTest);
// }, 50);
// }

// window.addEventListener("click", (e) => {
// CreateParticles(e.clientX, e.clientY);
// });

// function CreateParticles(event) {
//   x = event.clientX;
//   y = event.clientY;
let particleAmout = 0;

function CreateParticles(wherex, wherey) {
  particleAmout++;
  if (!canChangeImage) return;
  if (particleAmout > 20) return;

  x = wherex;
  y = wherey;
  for (let i = 0; i < MaxParticles; i++) {
    // let particleSpeed = Random(8, 10);
    let particleSpeed = Random(80, 200);
    // let angle = Random(0, 360);
    let angle = Random(((i - 1) / MaxParticles) * 360, (i / MaxParticles) * 360);
    CreateParticle(particleSpeed, angle);
  }

  if (particleAmout < 20) {
    setTimeout(() => {
      CreateParticles(Random(0, window.innerWidth), Random(0, window.innerHeight));
      // let percent = Random(0, 10);
      // if (percent < 5) {
      //   CreateParticles(Random(0, window.innerWidth), Random(0, window.innerHeight));

      //   percent = Random(0, 10);
      //   if (percent < 2) {
      //     // 0.5 * 0.2 = 0.1 // 10%
      //     CreateParticles(Random(0, window.innerWidth), Random(0, window.innerHeight));
      //   }
      // }
    }, Random(200, 500));
  }
}

function CreateParticle(speed, dir) {
  // console.log(`CreateParticle(${speed}, ${dir})`);
  const template = CloneTemplate.content.cloneNode(true);
  const element = template.querySelector(".particle");
  let timer = Random(1000, 3000);

  let width = Random(50, 200);
  let height = Random(50, 200);
  let rotated = Random(0, 360);

  element.style = `left: ${x}px; top: ${y}px; width: ${width / 100}em; height: ${
    height / 100
  }em; transition: ${timer}ms ease-out; transform: translateX(-50%) translateY(-50%) Rotate(${rotated}deg);
  background-color: hsl(${Random(0, 360)}, 50%, 50%);`;

  let left = Number(element.style.left.replace("px", ""));
  let top = Number(element.style.top.replace("px", ""));

  let angle = (dir * Math.PI) / 180;
  let deltaX = Math.cos(angle) * speed;
  let deltaY = Math.sin(angle) * speed;
  let lifetime = Random(1, 3);

  element.style.left = `${(left += deltaX / 10)}px`;
  element.style.top = `${(top += deltaY / 10)}px`;

  setTimeout(() => {
    element.style.left = `${(left += deltaX)}px`;
    element.style.top = `${(top += deltaY - 100)}px`;
    element.style.opacity = 0;
    rotated = Random(rotated - 45, rotated + 45);
    element.style.transform = `translateX(-50%) translateY(-50%) Rotate(${rotated}deg) skew(${Random(
      -45,
      45
    )}deg, ${Random(-45, 45)}deg)`;

    setTimeout(() => {
      element.remove();
    }, timer);
  }, lifetime * 100);

  particlesElement.appendChild(element);
}
