import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {client} from "../../api/client";

// const initialState = [
// 	{id: '0', name: 'Hinwah Leung'},
// 	{id: '1', name: 'Iving'},
// 	{id: '2', name: 'Elish'}
// ]

export const fetchUser = createAsyncThunk('users/fetchUsers', async () => {
	const response = await client.get('/fakeApi/users')
	return response.data
})

const initialState = []

const userSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers(builder){
		builder.addCase(fetchUser.fulfilled, (state, action) => {
			// 返回值将直接替换state中原有的状态值
			return action.payload
		})
	}
})

export default userSlice.reducer