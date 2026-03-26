import { apiRoute, ApiRoute } from "./apiroute";
import { useAuthStore } from "@/lib/auth-store";

export class TokenExpiredError extends Error {
    constructor(message: string = "Token expirado") {
        super(message);
        this.name = "TokenExpiredError";
    }
}

export class NetworkError extends Error {
    public readonly statusCode?: number;
    public readonly error?: boolean;

    constructor(message: string, statusCode?: number, error?: boolean) {
        super(message);
        this.name = "NetworkError";
        this.statusCode = statusCode;
        this.error = error;
    }
}

export async function networkFetch(route: ApiRoute, body?: any) {
    const uri = "http://localhost:4000"   // TODO: make this dynamic
    const fullURI = uri + apiRoute[route];
   
    // Obtener sesión del store
    const session = useAuthStore.getState().session;
    const isExpired = useAuthStore.getState().isExpired();

    // Verificar si el token está expirado (excepto en ruta de login)
    if (session && isExpired && route !== "login") {
        // Limpiar la sesión
        useAuthStore.getState().clearSession();
        throw new TokenExpiredError("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Añadir token al header si existe y no está expirado
    if (session?.token && !isExpired) {
        headers["Authorization"] = `Bearer ${session.token}`;
    }

    const reqInit: RequestInit = {
        body: body ? JSON.stringify(body) : undefined,
        headers,
        method: "POST",
    }

    const result = await fetch(fullURI, reqInit);

    if (!result.ok) {

        let errorData: any = null;
        let errorText = await result.text();

        try {
            errorData = JSON.parse(errorText);
            console.error("Error response from server:", errorData);
        } catch (error) {
            console.error("Error response from server (not JSON):", errorText);
        }

        // Extraer el mensaje del error del backend
        const errorMessage = errorData?.message || errorText || "Error en la solicitud";
        throw new NetworkError(errorMessage, result.status, errorData?.error);
    }

    let text = await result.text();

    try {
        text = JSON.parse(text);
    } catch (error) {
    }

    return text;
}