import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({baseUrl: '/fakeApi'}),
	tagTypes: ['Post'],
	endpoints: (builder) => ({
		getPosts: builder.query({
			query: () => '/posts',
			// result: 返回对象/对象数组
			// arg:    传入参数
			providesTags: (result= []) => ['Post', ...result.map(({id}) => ({type: 'Post', id}))]
		}),
		getPost: builder.query({
			query: postId => `/posts/${postId}`,
			providesTags: (result, error, arg) => [{
				type: 'Post',
				// 传入参数为postId
				id: arg
			}]
		}),
		addNewPost: builder.mutation({
			query: initialPost => ({
				url: '/posts',
				method: 'POST',
				body: initialPost
			}),
			invalidatesTags: ['Post']
		}),
		editPost: builder.mutation({
			query: post => ({
				url: `/posts/${post.id}`,
				method: "PATCH",
				body: post
			}),
			invalidatesTags: (result, error, arg, meta) => [{
				type: 'Post',
				id: arg.id
			}]
		}),
		addReaction: builder.mutation({
			query: ({postId, reaction}) => ({
				url: `/posts/${postId}/reactions`,
				method: 'POST',
				body: {reaction}
			}),
			// invalidatesTags: (result, error, arg) => [{
			// 	type: 'Post',
			// 	id: arg.postId
			// }]
			async onQueryStarted({postId, reaction}, {dispatch,queryFulfilled}) {
				
				// updateQuerydData 包含了三个对象： 要请求的接口名称；表示特定缓存数据的键值；更新缓存数据的回调。调用updateQueryData会返回动作对象
				// dispatch该动作对象后会返回一个值为patchResult的对象
				const patchResult = dispatch(apiSlice.util.updateQueryData('getPosts', undefined, draft => {
					const post = draft.find(post => post.id === postId)
					if(post){
						post.reactions[reaction]++
					}
				}))
				try{
					await queryFulfilled
				}catch{
					patchResult.undo()
				}
			}
		})
	})
})

export const {
	useGetPostsQuery,
	useGetPostQuery,
	useAddNewPostMutation,
	useEditPostMutation,
	useAddReactionMutation
} = apiSlice