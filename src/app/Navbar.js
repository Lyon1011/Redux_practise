import React from 'react'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchNotifications, selectAllNotifications} from "../features/notifications/notificationsSlice";

export const Navbar = () => {
	const dispatch = useDispatch()
	
	const fetchNewNotifications = () => {
		dispatch(fetchNotifications())
	}
	
	const notifications = useSelector(selectAllNotifications)
	const numUnreadNotificaitons = notifications.filter(notification => !notification.read).length
	
	let unreadNotificationsBadge
	
	if(numUnreadNotificaitons > 0){
		unreadNotificationsBadge = (
			<span className="badge">
				{numUnreadNotificaitons}
			</span>
		)
	}
	
	
	return (
		<nav>
			<section>
				<h1>Redux Essentials Example</h1>
				
				<div className="navContent">
					<div className="navLinks">
						<Link to="/">文章列表</Link>
						<Link to="/users">作者列表</Link>
						<Link to="/notifications">
							消息 {unreadNotificationsBadge}
						</Link>
					</div>
					<button className="button" onClick={fetchNewNotifications}>Refresh Notifications</button>
				</div>
			</section>
		</nav>
	)
}
