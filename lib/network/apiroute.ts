export const apiRoute = {
    createOrder: "/orders/reg",

} as const satisfies Record<string, string>

export type ApiRoute = keyof typeof apiRoute;