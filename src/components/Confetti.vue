<template>
    <div class="confetti-container">
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      this.initParticles();
    },
    methods: {
      initParticles() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let particles = [];
        const particleCount = 400;
        const colors = ["#FF0A47", "#FF8C00", "#FFD700", "#32CD32", "#00CED1", "#1E90FF", "#8A2BE2"];
        
        function createParticle() {
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            opacity: Math.random() * 0.8 + 0.2,
            lifespan: Math.random() * 200 + 400,
            dx: (Math.random() - 0.5) * 4,
            dy: Math.random() * 2 + 1,
            dr: Math.random() * 5 - 2.5
          };
        }
        
        function updateParticles() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach((particle, index) => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.rotation += particle.dr;
            particle.lifespan -= 1;
            particle.opacity = Math.max(particle.lifespan / 200, 0);
            
            if (particle.y > canvas.height || particle.lifespan <= 0) {
              particles[index] = createParticle();
              particles[index].y = 0;
            }
          });
        }
        
        function drawParticles() {
          particles.forEach(particle => {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate((particle.rotation * Math.PI) / 180);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
          });
        }
        
        function animate() {
          updateParticles();
          drawParticles();
          requestAnimationFrame(animate);
        }
        
        for (let i = 0; i < particleCount; i++) {
          particles.push(createParticle());
        }
        
        animate();
      }
    }
  };
  </script>
  
  <style>
  .confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
  }
  canvas {
    display: block;
  }
  </style>