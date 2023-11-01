// document.addEventListener('DOMContentLoaded', () => {
//     const canvas = document.querySelector('canvas');
//     const ctx = canvas.getContext('2d');
//     const particlesArray = [];

//     const img = new Image();
//     img.src = 'logo.png';

//     img.addEventListener('load', () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0);

        
//     });
// });


  window.addEventListener('load', function () {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gap = 3;
    const mouse = {
      radius: 30000,
      x: undefined,
      y: undefined
    };

    const particlesArray = [];

    const image = new Image();
    image.src = 'logo.png';

    image.addEventListener('load', function () {
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;
      const x = centerX - image.width * 0.5;
      const y = centerY - image.height * 0.5;

      window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
      });


      function init(context) {
        context.drawImage(image, x, y);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let y = 0; y < canvas.height; y ++) {
          for (let x = 0; x < canvas.width; x ++) {
            const index = (y * canvas.width + x) * 4;
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const alpha = pixels[index + 3];
            const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

            if (alpha > 0) {
              particlesArray.push({
                x,
                y,
                originX: x,
                originY: y,
                color,
                size: 5,
                vx: 0,
                vy: 0,
                ease: 0.1,
                friction: 0.10,
                dx: 0,
                dy: 0,
                distance: 0,
                fourse: 0,
                angle: 0
              });
            }
          }
        }
      }

      function drawParticle(particle, context) {
        context.fillStyle = particle.color;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      function updateParticle(particle) {
        particle.dx = mouse.x - particle.x;
        particle.dy = mouse.y - particle.y;
        particle.distance = particle.dx * particle.dx + particle.dy * particle.dy;
        particle.fourse = -mouse.radius / particle.distance;

        if (particle.distance < mouse.radius) {
          particle.angle = Math.atan2(particle.dy, particle.dx);
          particle.vx += particle.fourse * Math.cos(particle.angle);
          particle.vy += particle.fourse * Math.cos(particle.angle);
        }

        particle.x += (particle.vx *= particle.friction) + (particle.originX - particle.x) * particle.ease;
        particle.y += (particle.vy *= particle.friction) + (particle.originY - particle.y) * particle.ease;
      }

      function draw(context) {
        particlesArray.forEach(particle => drawParticle(particle, context));
      }

      function update() {
        particlesArray.forEach(updateParticle);
      }

      init(ctx);

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(ctx);
        update();
        requestAnimationFrame(animate);
      }
      animate();
    });
  });


