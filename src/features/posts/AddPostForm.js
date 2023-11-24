import {useState} from "react";
import {useDispatch} from "react-redux";
import {postAdded} from "./postSlice";

export const AddPostForm = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	
	const dispatch = useDispatch()
	const onTitleChanged = e => setTitle(e.target.value)
	const onContentChanged = e => setContent(e.target.value)
	
	const onSavePostClicked = () => {
		if(title && content){
			dispatch(postAdded(title, content))
		}
	}
	
	return (
		<section>
			<h2>添加新文章</h2>
			<form>
				<label htmlFor="postTitle">文章标题:</label>
					<input type="text"
					       id="postTitle"
					       name="postTitle"
					       value={title}
						   onChange={onTitleChanged}
					/>
					<label htmlFor="postContent">内容：</label>
						<textarea   name="postContent"
						            id="postContent"
									value={content}
							        onChange={onContentChanged} />
						<button type="button" onClick={onSavePostClicked}>保存文章</button>
			</form>
		</section>
	)
}