export const fetchData = async (route,setData) => {
	const url = "http://127.0.0.1:8080/" + route
	try {
		const response = await fetch(url);
		console.log(response)
		if (!response.ok) {
			throw new Error('Error when fetching ' + route);
		}
		const result = await response.json();
		setData(result);
	} catch (error) {
		throw new Error(error.message);
	}
};