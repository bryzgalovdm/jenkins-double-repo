const canvas = document.getElementById('neural-network');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const nodes = [];
const connections = [];
const nodeCount = 200;
const nodeRadius = 2;
const connectionDistance = 150;
const signalSpeed = 0.05;

const nodeColor = 'rgba(120, 180, 255, 0.7)';
const connectionColor = 'rgba(120, 180, 255, 0.15)';
const signalColor = 'rgba(220, 240, 255, 0.9)';

for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

function updateConnections() {
  connections.length = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        connections.push({
          from: i,
          to: j,
          distance: distance,
          signals: [],
          lastSignalTime: 0
        });

        if (Math.random() < 0.03) {
          connections[connections.length - 1].signals.push({
            position: Math.random(),
            speed: signalSpeed * (0.7 + Math.random() * 0.6),
            size: 1 + Math.random() * 2
          });
        }
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].x += nodes[i].vx;
    nodes[i].y += nodes[i].vy;

    if (nodes[i].x < 0 || nodes[i].x > canvas.width) nodes[i].vx *= -1;
    if (nodes[i].y < 0 || nodes[i].y > canvas.height) nodes[i].vy *= -1;
  }

  if (Math.random() < 0.1) updateConnections();

  ctx.strokeStyle = connectionColor;
  ctx.lineWidth = 1;

  for (let i = 0; i < connections.length; i++) {
    const from = nodes[connections[i].from];
    const to = nodes[connections[i].to];

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    if (Math.random() < 0.001) {
      connections[i].signals.push({
        position: 0,
        speed: signalSpeed * (0.7 + Math.random() * 0.6),
        size: 1 + Math.random() * 2
      });
    }

    ctx.fillStyle = signalColor;

    for (let j = 0; j < connections[i].signals.length; j++) {
      const signal = connections[i].signals[j];
      signal.position += signal.speed;

      if (signal.position > 1) {
        connections[i].signals.splice(j, 1);
        j--;
        continue;
      }

      const x = from.x + (to.x - from.x) * signal.position;
      const y = from.y + (to.y - from.y) * signal.position;

      ctx.beginPath();
      ctx.arc(x, y, signal.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = nodeColor;
  for (let i = 0; i < nodes.length; i++) {
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

animate();
