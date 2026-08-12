export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.client) return;
  const { isLoggedIn, ensureAuthChecked } = useAuth();
  await ensureAuthChecked();
  if (!isLoggedIn.value) {
    return navigateTo("/login");
  }
});