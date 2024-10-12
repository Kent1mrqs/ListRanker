export const fetchData = async <T>(route: string, setData: (data: T) => void): Promise<void> => {
    const url = "http://127.0.0.1:8080/" + route;
    try {
        const response = await fetch(url);
        console.log(response);
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

export const postData = async <T>(route: string, data: T): Promise<void> => {
    const url = "http://127.0.0.1:8080/" + route;
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
        console.log(result)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};