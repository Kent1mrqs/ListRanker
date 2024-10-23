export const fetchData = async <R>(route: string): Promise<R> => {
    const url = "http://127.0.0.1:8080/" + route;
    console.info("fetch ", url)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error when fetching ' + route);
        }
        const result = await response.json() as R;
        console.info("fetch get ", result)
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const postData = async <T, R>(route: string, data: T): Promise<R> => {
    const url = "http://127.0.0.1:8080/" + route;
    console.info("post ", url, " data : ", data)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error when posting ' + route);
        }
        const result = await response.json() as R;
        console.info("post response : ", response)
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const deleteData = async <T>(route: string): Promise<T> => {
    const url = "http://127.0.0.1:8080/" + route;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Error when posting ' + route);
        }
        const result = await response.json() as T;
        console.info("post response : ", response)
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
export const editData = async <T>(route: string, data: T): Promise<T> => {
    const url = "http://127.0.0.1:8080/" + route;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error when editing ' + route);
        }
        const result = await response.json() as T;
        console.info("put response : ", response)
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};