import {makeAutoObservable} from "mobx";
import {
    getChatListRequest,
    getCurrentChatInfoRequest,
    getNotificationsRequest,
    getNotificationsUrl
} from "../api/api_messages";
import authStore from "./authStore";
import myClassesStore from "./myClassesStore";


class MessagesStore {
    constructor() {
        makeAutoObservable(this)
    }

    eventSource = {}

    newMessage = false;

    setNewMessage = (status) => {
        this.newMessage = status
    }

    async getChatList() {
        let r = await getChatListRequest()
        let jsonData = JSON.parse(r.data)
        let myId = authStore.user.id

        let result = jsonData.map(x => {

            let refactoredDate = x.LastMessage.CreatedAt === '0001-01-01T00:00:00Z'? '' : this.refactorDate(x.LastMessage.CreatedAt)

            if (x.ReceiverID != myId) {
                let delta = x.Receiver
                delta.lastMessageDate = refactoredDate
                return delta
            } else {
                let delta = x.Sender
                delta.lastMessageDate = refactoredDate
                return delta
            }
        })
        console.log('chat list', result)
        return result
    }

    async getCurrentChat(id) {
        let r = await getCurrentChatInfoRequest(id)
        let data = r.data
        let myId = authStore.user.id
        let chat = JSON.parse(data.chat)
        let roomId = chat.ID
        if (chat.ReceiverID != myId) {
            chat = chat.Receiver
        } else {
            chat = chat.Sender
        }

        chat.roomID = roomId
        chat.stringDateAndTime = ''

        let jsonMessages = JSON.parse(data.messages)


        jsonMessages = jsonMessages.map(x => {
            return {...x, stringDateAndTime: this.refactorDate(x.CreatedAt)}
        })

        console.log('current chat', chat)
        return {chat: chat, messages: jsonMessages}
    }

    refactorDate(strDate) {
        let today = new Date()
        let yesterday = new Date(today.valueOf() - 86400000);

        let messageDate = new Date(strDate)
        let stringDate = ''

        if (messageDate.getDate() === today.getDate() && messageDate.getMonth() === today.getMonth() && messageDate.getFullYear() === today.getFullYear()) {
            stringDate = 'Сегодня'
        } else if (messageDate.getDate() === (today.getDate() - 1) && messageDate.getMonth() === yesterday.getMonth() && messageDate.getFullYear() === yesterday.getFullYear()) {
            stringDate = 'Вчера'
        } else
            stringDate = `${messageDate.getDate()} ${myClassesStore.monthNames[messageDate.getMonth()]}`

        let hours = messageDate.getHours().toString().length > 1 ? messageDate.getHours().toString() : `0${messageDate.getHours().toString()}`
        let minutes = messageDate.getMinutes().toString().length > 1 ? messageDate.getMinutes().toString() : `0${messageDate.getMinutes().toString()}`

        let stringDateAndTime = `${stringDate}, ${hours}:${minutes}`

        return stringDateAndTime
    }

    changeDisplay() {

    }

    startEvents() {
        // создаем экземпляр для получения данных по запросу на указанный адрес
        this.eventSource = new EventSource(getNotificationsUrl(authStore.user.id))


        this.eventSource.addEventListener('message', e => {
            this.setNewMessage(true)
            console.log(JSON.parse(e.data))
        })
    }

    stopEvents() {
        this.eventSource.close()
    }


}

export default new MessagesStore()