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
    "/src/pages/admin/home/home.html",
    "client"
  );
  // Una vez autenticado como client, redirige al catálogo
  navigate("/src/pages/store/home/home.html");
};

initPage();
