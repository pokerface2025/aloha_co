export const apiRoute = {
    orderList: "/orders/list",
    createOrder: "/orders/reg",
    login: "/auth/login",

} as const satisfies Record<string, string>

export type ApiRoute = keyof typeof apiRoute;