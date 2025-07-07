// Extract JWT from URL (Telegram will pass it like ?token=xyz)
function getToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}
