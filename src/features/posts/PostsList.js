import {Link} from "react-router-dom";
import {PostAuthor} from "./PostAuthor";
import {TimeAgo} from "./TimeAgo";
import {ReactionButtons} from "./ReactionButtons";
import React, {useMemo} from "react";
import {Spinner} from "../../components/Spinner";
import {useGetPostsQuery} from "../api/apiSlice";
import classnames from 'classnames'

let PostExcerpt = ({post}) => {
	return (
		<article className="post-excerpt" key={post.id}>
			<h3>{post.title}</h3>
			<div>
				<PostAuthor userId={post.user} />
				<TimeAgo timestamp={post.date}/>
			</div>
			<p className="post-content">{post.content.substring(0,100)}</p>
			<ReactionButtons post={post} />
			<Link to={`/posts/${post.id}`} className="button muted-button">
				View Post
			</Link>
		</article>
	)
}

PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
	// data 实际响应内容
	// isLoading Boolean 指示此 hooks 当前是否正在向服务器发出 第一次 请求
	// isSuccess Boolean 指示 hooks 是否已成功请求并有可用的缓存数据
	// isError 是否返回报错信息
	// isFetching 会在数据请求返回true
	// refetch 强制重新获取
	const {
		data: posts = [],
		isLoading,
		isFetching,
		isSuccess,
		isError,
		error,
		refetch
	} = useGetPostsQuery()
	
	const sortedPosts = useMemo(() => {
		const sortedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
		return sortedPosts
	}, [posts])
	
	let content
	
	if (isLoading) {
		content = <Spinner text="Loading" />
	}else if (isSuccess) {
		const renderedPosts = sortedPosts.map(post => (
			<PostExcerpt key={post.id} post={post} />
		))
		
		const containerClassname = classnames('posts-container', {
			disabled: isFetching
		})
		
		content = <div className={containerClassname}>{renderedPosts}</div>
	}else if (isError){
		content = <div>{error.toString()}</div>
	}
	
	return (
		<section className="posts-list">
			<h2>Posts</h2>
			<button onClick={refetch}>Refetch Posts</button>
			{content}
		</section>
	)
}