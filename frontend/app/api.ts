import dotenv from 'dotenv';

dotenv.config();

const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8080/";

const handleAuth = (): string | null => {
    const token = localStorage.getItem('jwt');
    if (!token) {
        if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
            localStorage.removeItem("userId");
            window.location.href = '/signin';
        }
        return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    if (Date.now() >= exp && window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
        localStorage.removeItem("userId");
        window.location.href = '/signin';
    }
    return token;
};

const createFetchOptions = (method: string, token: string | null, data?: any): RequestInit => {
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

const apiRequest = async <T, R>(method: string, route: string, data?: T): Promise<R> => {
    const url = `${backendUrl}${route}`;
    const token = handleAuth();

    try {
        const response = await fetch(url, createFetchOptions(method, token, data));
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

export const fetchData = async <R>(route: string): Promise<R> => {
    return apiRequest<undefined, R>('GET', route);
};

export const postData = async <T, R>(route: string, data: T): Promise<R> => {
    return apiRequest<T, R>('POST', route, data);
};

export const deleteData = async <R>(route: string): Promise<R> => {
    return apiRequest<undefined, R>('DELETE', route);
};

export const editData = async <T, R>(route: string, data: T): Promise<R> => {
    return apiRequest<T, R>('PUT', route, data);
};
