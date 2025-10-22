import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },

  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterLogin.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/players",
    name: "Players",
    component: () => import("../views/Players.vue"),
  },
  {
    path: "/teams",
    name: "Teams",
    component: () => import("../views/Teams.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ranking",
    name: "Ranking",
    component: () => import("../views/Ranking.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.requiresGuest && token) {
    next("/");
  } else {
    next();
  }
});

export default router;
