export function haptic(duration = 10): void {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }
  } catch {
    // Silently ignore on unsupported platforms
  }
}
