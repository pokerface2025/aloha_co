import { apiRoute, ApiRoute } from "./apiroute";

export async function networkFetch(route: ApiRoute, body?: any) {
    const uri = "http://localhost:4000"   // TODO: make this dynamic
    const fullURI = uri + apiRoute[route];
   

    const reqInit: RequestInit = {
        body: body ? JSON.stringify(body) : undefined,
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
    }

    const result = await fetch(fullURI, reqInit);

    if (!result.ok) {

        let errorText = await result.text();

        try {
            errorText = JSON.parse(errorText);
            console.error("Error response from server:", errorText);
        } catch (error) {
            console.error("Error response from server (not JSON):", errorText);
        }
        throw new Error(errorText);
    }

    let text = await result.text();

    try {
        text = JSON.parse(text);
    } catch (error) {
    }

    return text;
}