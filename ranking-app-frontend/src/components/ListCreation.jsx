import {Button, TextField, Typography} from "@mui/material";
import {useState} from "react";


export default function ListCreation() {
	const [input, setInput] = useState('');
	const [list, setList] = useState([]);
	const [separator, setSeparator] = useState('\n');

	function onClick() {
		setList(input.split(separator))
	}
	function onChange(e) {
		setInput(e.target.value)
		console.log(input)
	}

	return (
		<>
		<TextField
			id="outlined-multiline-flexible"
			label="Multiline"
			multiline
			onChange={onChange}
			value={input}
			maxRows={4}
		/>
			<Button onClick={onClick}>Validate</Button>
			<Typography>Elements de la liste : </Typography>
			{list.map(el => {
				return (<Typography>{el}</Typography>)
			})}
		</>
	)
}