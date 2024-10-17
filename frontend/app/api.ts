export const fetchData = async <T>(route: string, setData: (data: T) => void): Promise<void> => {
    const url = "http://127.0.0.1:8080/" + route;
    console.log(url)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error when fetching ' + route);
        }
        const result = await response.json() as T;
        setData(result);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const postData = async <T>(route: string, data: T): Promise<T> => {
    const url = "http://127.0.0.1:8080/" + route;
    console.info(JSON.stringify(data))
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
        const result = await response.json() as T;
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};