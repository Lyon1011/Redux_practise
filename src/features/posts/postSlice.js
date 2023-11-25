import {createSlice, nanoid} from "@reduxjs/toolkit";
import {sub} from "date-fns";

const initialState = [
	{id:'1', title: 'first Post', content: 'hello!', user: '0',
		date: sub(new Date(), {minutes: 10}).toISOString(),
		reactions: {
			thumbsUp: 0,
			hooray: 0,
			heart: 0,
			rocket: 0,
			eyes: 0
		}},
	{id:'2', title: 'second Post', content: 'hello!', user: '1',
		date: sub(new Date(), {minutes: 15}).toISOString(),
		reactions: {
			thumbsUp: 0,
			hooray: 0,
			heart: 0,
			rocket: 0,
			eyes: 0
		}}
]

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		postAdded:{
			reducer(state, action) {
				state.push(action.payload)
			},
			prepare(title, content, userId){
				return {
					payload: {
						id: nanoid(),
						date: new Date().toISOString(),
						title,
						content,
						user: userId
					}
				}
			}
		},
		postUpdated(state, action){
			const { id, title, content} = action.payload
			const existingPost = state.find(post => post.id === id)
			if(existingPost){
				existingPost.title = title
				existingPost.content = content
			}
		},
		reactionAdded(state, action) {
			const {postId, reaction} = action.payload
			const existingPost = state.find(post => post.id === postId)
			if (existingPost)
				existingPost.reactions[reaction]++
		}
	}
})

export const {postAdded, postUpdated, reactionAdded} = postSlice.actions
export default postSlice.reducer