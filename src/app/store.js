import { configureStore } from '@reduxjs/toolkit'
import postsReducer from '../features/posts/postSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import {apiSlice} from "../features/api/apiSlice";
export default configureStore({
	reducer:{
		posts: postsReducer,
		// users: usersReducer,
		notifications: notificationsReducer,
		[apiSlice.reducerPath]: apiSlice.reducer
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})
