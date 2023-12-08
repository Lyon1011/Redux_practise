import {Link} from "react-router-dom";
import {PostAuthor} from "./PostAuthor";
import {ReactionButtons} from "./ReactionButtons";
import {useGetPostQuery} from "../api/apiSlice";
import {Spinner} from "../../components/Spinner";
import {TimeAgo} from "./TimeAgo";

export const SinglePostPage = ({match}) => {
    const { postId } = match.params
	const {
		data: post,
		isFetching,
		isSuccess
	} = useGetPostQuery(postId)
	let content
	
	// isFetching & isSuccess 属于互斥关系
	if (isFetching) {
		content = <Spinner text="Loading..." />
	} else if (isSuccess) {
		content = (
			<article className="post">
				<h2>{post.title}</h2>
				<div>
					<PostAuthor userId={post.user} />
					<TimeAgo timestamp={post.date} />
				</div>
				<p className="post-content">{post.content}</p>
				<ReactionButtons post={post} />
				<Link to={`/editPost/${post.id}`} className="button">
					Edit Post
				</Link>
			</article>
		)
	}
	
	return <section>{content}</section>
}