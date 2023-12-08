import {useSelector} from "react-redux";
import {selectUserById} from "./usersSlice";
import {Link} from "react-router-dom";
import {useMemo} from "react";
import {createSelector} from "@reduxjs/toolkit";
import {useGetPostsQuery} from "../api/apiSlice";

export const UserPage = ({match}) => {
	const {userId} = match.params
	
	const user = useSelector(state => selectUserById(state, userId))
	// 创建过滤器
	const selectPostsForUser = useMemo(() => {
		const emptyArray = []
		return createSelector(
			res => res.data,
			(res, userId) => userId,
			(data, userId) => data?.filter(post => post.user === userId) ?? emptyArray
		)
	}, [])
	
	// 获取数据并过滤
	const {postsForUser} = useGetPostsQuery(undefined, {
		// RTKQ hook中传入参数进行数据过滤
		selectFromResult: result => ({
			...result,
			postsForUser: selectPostsForUser(result, userId)
		})
	})
	
	const postTitles =  postsForUser.map(post => (
		<li key={post.id}>
			<Link to={`/posts/${post.id}`}>{post.title}</Link>
		</li>
	))
	
	return (
		<section>
			<h2>{user.name}</h2>
			<ul>{postTitles}</ul>
		</section>
	)
}