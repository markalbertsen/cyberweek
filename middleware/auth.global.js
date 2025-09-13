import { useAuth } from "../composables/useAuth";
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/welcome") {
    const { isAuthenticated } = useAuth();
    console.log(
      "[middleware] /welcome guard -> isAuth?",
      isAuthenticated.value
    );
    if (!isAuthenticated.value) {
      return navigateTo("/login");
    }
  }
});
