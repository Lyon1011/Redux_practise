import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {client} from "../../api/client";


export const fetchUser = createAsyncThunk('users/fetchUsers', async () => {
	const response = await client.get('/fakeApi/users')
	return response.data
})

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

const userSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchUser.fulfilled]: usersAdapter.setAll
	}
})

export default userSlice.reducer
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById
} = usersAdapter.getSelectors(state => state.users)