import confetti from 'canvas-confetti'

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#B91C1C', '#D97706', '#FFD700', '#FF6B6B'],
  })
}
