import { checkAuhtUser, logout } from "../../../utils/auth";
import { navigate } from "../../../utils/navigate";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

const initPage = (): void => {
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
  // Una vez autenticado como admin, redirige al panel de gestión
  navigate("/src/pages/store/admin/admin.html");
};

initPage();
