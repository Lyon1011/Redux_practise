import {apiSlice} from "../api/apiSlice";
import {createAction, createEntityAdapter, createSelector, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {forceGenerateNotifications} from "../../api/server";

const notificationsReceived = createAction(
	'notifications/notificationsReceived'
)
export const extendedApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getNotifications: builder.query({
			query: () => '/notifications',
			// 立即 await cacheDataLoaded
			// 创建像 Websocket 一样的服务器端数据订阅
			// 收到更新时，使用 updateCachedData 根据更新 “mutate” 缓存值
			// await cacheEntryRemoved 在最后
			// 之后清理订阅
			async onCacheEntryAdded (arg, {updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch}){
				const ws = new WebSocket('ws://localhost')
				try {
					await cacheDataLoaded
					
					// 从socket连接服务器收到数据时，用收到的数据更新我们的查询数据
					const listener = event => {
						const message = JSON.parse(event.data)
						switch (message.type) {
							case 'notifications': {
								updateCachedData(draft => {
									draft.push(...message.payload)
									draft.sort((a, b) => b.date.localeCompare(a.date))
								})
								dispatch(notificationsReceived(message.payload))
								break
							}
							default:
								break
						}
					}
					ws.addEventListener('message', listener)
				}catch (e){}
				await cacheEntryRemoved
				ws.close()
			}
		})
	})
})

export const {useGetNotificationsQuery} = extendedApi

const emptyNotifications = []

export const selectNotificationsResult = extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
	selectNotificationsResult,
	notificationsResult => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
	const allNotifications = selectNotificationsResult(getState)
	const [latestNotification] = allNotifications
	const lastestTimestamp = latestNotification?.date ?? ''
	forceGenerateNotifications(latestNotification)
}

const notificationsAdapter = createEntityAdapter()

// 创建一个匹配器匹配两者的action
const matchNotificationsReceived = isAnyOf(notificationsReceived, extendedApi.endpoints.getNotifications.matchFulfilled)

const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: notificationsAdapter.getInitialState(),
	reducers: {
		// 将所有通知设置为已读
		allNotificationsRead(state, action){
			Object.values(state.entities).forEach(notification => {
				notification.read = true
			})
		}
	},
	extraReducers(builder){
		builder.addMatcher(matchNotificationsReceived, (state, action) => {
			// 添加数据跟踪通知
			const notificationsMetadata = action.payload.map(notification => ({
				id: notification.id,
				read: false,
				isNew: true
			}))
			
			// 看过的数据标记为旧通知
			Object.values(state.entities).forEach(notification => {
				notification.isNew = !notification.read
			})
			
			// 更新通知
			notificationsAdapter.upsertMany(state, notificationsMetadata)
		})
	}
})

export const {allNotificationsRead} = notificationsSlice.actions
export default notificationsSlice.reducer
export const {
	selectAll: selectNotificationsMetadata,
	selectEntities: selectMetadataEntities
} = notificationsAdapter.getSelectors(state => state.notifications)