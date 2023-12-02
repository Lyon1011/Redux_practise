import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
// import {sub} from "date-fns";
import {client} from "../../api/client";

const postsAdapter = createEntityAdapter({
	sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
	status: 'idle',
	error: null
})

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		postUpdated(state, action){
			const { id, title, content} = action.payload
			const existingPost = state.entity[id]
			if(existingPost){
				existingPost.title = title
				existingPost.content = content
			}
		},
		reactionAdded(state, action) {
			const {postId, reaction} = action.payload
			const existingPost = state.entities[postId]
			if (existingPost)
				existingPost.reactions[reaction]++
		}
	},
	extraReducers (builder) {
		builder
			.addCase(fetchPosts.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = 'succeeded'
				postsAdapter.upsertMany(state, action.payload)
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(addNewPost.fulfilled, postsAdapter.addOne)
	}
})

export const {postAdded, postUpdated, reactionAdded} = postSlice.actions

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
	const response = await client.get('/fakeApi/posts')
	return response.data
})
export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
	const response = await client.post('/fakeApi/posts', initialPost)
	return response.data
})

export const {
	selectAll: selectAllPosts,
	selectById: selectPostById,
	selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
	[selectAllPosts, (state, userId) => userId],
	(posts, userId) => posts.filter(post => post.user === userId)
)
export default postSlice.reducer