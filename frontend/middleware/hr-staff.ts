export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.client) return;
  const { user, tryRefresh, isLoggedIn } = useAuth();

  // Hydrate auth state if not already loaded
  if (!isLoggedIn.value) {
    await tryRefresh();
  }

  // If still not logged in after refresh attempt, redirect to the
  // HR/Admin login (separate from the employee login).
  if (!isLoggedIn.value) {
    return navigateTo("/hr-login");
  }

  const isHrStaff =
    user.value?.role === "hr-staff" || user.value?.role === "admin";

  if (!isHrStaff) {
    return navigateTo("/");
  }
});