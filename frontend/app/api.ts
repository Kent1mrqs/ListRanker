const handleAuth = (): string | null => {
    const token = localStorage.getItem('jwt');
    if (!token) {
        if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
            localStorage.removeItem("userId");
            window.location.href = '/signin';
        }
        return null; // Retourne null si pas de token
    } else {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convertir en millisecondes
        if (Date.now() >= exp && window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
            localStorage.removeItem("userId");
            window.location.href = '/signin';
        }
    }
    return token; // Retourne le token valide
};

const createFetchOptions = (method: string, token: string | null, data?: any) => {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
};

export const fetchData = async <R>(route: string): Promise<R> => {
    const url = "http://127.0.0.1:8080/" + route;
    const token = handleAuth();

    try {
        const response = await fetch(url, createFetchOptions('GET', token));
        if (!response.ok) {
            throw new Error(String(response.status));
        }
        return await response.json() as R;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
};

export const postData = async <T, R>(route: string, data: T): Promise<R> => {
    const url = "http://127.0.0.1:8080/" + route;
    const token = handleAuth();
 
    try {
        const response = await fetch(url, createFetchOptions('POST', token, data));
        if (!response.ok) {
            throw new Error(String(response.status));
        }
        return await response.json() as R;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
};

export const deleteData = async <T>(route: string): Promise<T> => {
    const url = "http://127.0.0.1:8080/" + route;
    const token = handleAuth();

    try {
        const response = await fetch(url, createFetchOptions('DELETE', token));
        if (!response.ok) {
            throw new Error(String(response.status));
        }
        return await response.json() as T;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
};

export const editData = async <T>(route: string, data: T): Promise<T> => {
    const url = "http://127.0.0.1:8080/" + route;
    const token = handleAuth();

    try {
        const response = await fetch(url, createFetchOptions('PUT', token, data));
        if (!response.ok) {
            throw new Error(String(response.status));
        }
        return await response.json() as T;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
};
