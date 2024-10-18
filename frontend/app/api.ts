export const fetchData = async <T>(route: string, setData: (data: T) => void): Promise<void> => {
    const url = "http://127.0.0.1:8080/" + route;
    console.info("fetch ", url)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error when fetching ' + route);
        }
        const result = await response.json() as T;
        console.info("fetch get ", result)
        setData(result);
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
        console.info("post get", response)
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};