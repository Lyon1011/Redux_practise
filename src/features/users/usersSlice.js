import {createSlice} from "@reduxjs/toolkit";

const initialState = [
	{id: '0', name: 'Hinwah Leung'},
	{id: '1', name: 'Iving'},
	{id: '2', name: 'Elish'}
]

const userSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
	
	}
})

export default userSlice.reducer