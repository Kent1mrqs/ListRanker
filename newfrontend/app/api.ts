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
