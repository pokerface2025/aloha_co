export const apiRoute = {
    createOrder: "/orders/reg",
    login: "/auth/login",

} as const satisfies Record<string, string>

export type ApiRoute = keyof typeof apiRoute;