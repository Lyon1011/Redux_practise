import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import {postUpdated} from "./postSlice";

export const EditPostForm = ({match}) => {
	const { postId } = match.params
	const post = useSelector(state => state.posts.find(post => post.id === postId))
	
	const [title, setTitle] = useState(post.title)
	const [content, setContent] = useState(post.content)
	
	const dispatch = useDispatch()
	const history = useHistory()
	
	const onTitleChanged = e => setTitle(e.target.value)
	const onContentChanged = e => setContent(e.target.value)
	
	const onSavePostClicked = () => {
		if(title && content){
			dispatch(postUpdated({
				id: postId,
				title,
				content
			}))
			history.push(`/posts/${postId}`)
		}
	}
	
	return (
		<section>
			<h2>编辑文章</h2>
			<form>
				<label htmlFor="postTitle">文章标题</label>
				<input  type="text"
						name="postTitle"
						id="postTitle"
						placeholder="What's on your mind?"
						value={title}
						onChange={onTitleChanged}/>
				<label htmlFor="postContent">内容:</label>
				<textarea name="postContent"
				          id="postContent"
				          value={content}
				          onChange={onContentChanged}
				/>
			</form>
			<button type="button" onClick={onSavePostClicked}>
				保存文章
			</button>
		</section>
	)
}