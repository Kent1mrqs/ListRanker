import {Button, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";

export default function ListCreation() {
	const default_list = {
		name: '',
		elements:[]
	}
	const [nameList, setNameList] = useState('');
	const [input, setInput] = useState('');
	const [newList, setNewList] = useState(default_list);
	const [separator, setSeparator] = useState('\n');
	const [dbList, setDbList] = useState([])

	function onClick() {
		setNewList({name: nameList, elements: input.split(separator)});
		setInput('')
	}
	function saveList() {

	}

	return (
		<Stack direction='row' spacing={3}>
			<Stack spacing={1}>
				<Typography>Nom de la liste</Typography>
				<TextField onChange={e=> setNameList(e.target.value)}/>
				<TextField
					id="outlined-multiline-flexible"
					label="Multiline"
					multiline
					onChange={e=>setInput(e.target.value) }
					value={input}
					maxRows={4}
				/>
				<Select value={separator} onChange={event => setSeparator(event.target.value)}>
					<MenuItem value={'\n'}>Saut de ligne</MenuItem>
					<MenuItem value=','>,</MenuItem>
					<MenuItem value=';'>;</MenuItem>
					<MenuItem value=' '>espace</MenuItem>
				</Select>
				<Button onClick={onClick}>Validate</Button>
			</Stack>
			<Stack spacing={1}>
				<Typography>Elements de la liste {newList.name}: </Typography>
				{newList.elements.map(el => {
					return (<Typography>{el}</Typography>)
				})}
				<Button onClick={saveList}>Save</Button>

			</Stack>
			<Stack>
				<Typography>Mes listes</Typography>
			</Stack>
		</Stack>
	)
}