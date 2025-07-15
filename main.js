// script.js

// Example: Block click for coming soon games
document.querySelectorAll('.game-card.coming-soon').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    alert('This game is coming soon! 🚧');
  });
});

// Example: Add simple animation to header (optional, can remove)
document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('h1');
  if(h1) {
    h1.animate([
      { transform: 'scale(0.95)', opacity: 0.3 },
      { transform: 'scale(1.02)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: 650, fill: 'forwards' });
  }
});
