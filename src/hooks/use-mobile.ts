export function useIsMobile() {
  // Temporary override: force desktop behavior everywhere that uses useIsMobile.
  // Original mobile detection logic is intentionally disabled for now.
  return false
}
