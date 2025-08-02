"use client"

import { useState } from "react"
import { Search, Send, Paperclip, Phone, Video, MoreVertical, MessageSquare } from "lucide-react"

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Ahmed Hassan",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Is the property still available for viewing?",
      time: "2 min ago",
      unread: 2,
      online: true,
      property: "Luxury Villa in DHA Phase 5",
    },
    {
      id: 2,
      name: "Sarah Khan",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thank you for the quick response!",
      time: "1 hour ago",
      unread: 0,
      online: false,
      property: "Modern Apartment in Gulberg",
    },
    {
      id: 3,
      name: "Ali Raza",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can we schedule a meeting tomorrow?",
      time: "3 hours ago",
      unread: 1,
      online: true,
      property: "Commercial Plot in Johar Town",
    },
    {
      id: 4,
      name: "Fatima Ahmed",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The documents look good to me.",
      time: "1 day ago",
      unread: 0,
      online: false,
      property: "Family House in Model Town",
    },
    {
      id: 5,
      name: "Hassan Ali",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "What about the price negotiation?",
      time: "2 days ago",
      unread: 0,
      online: false,
      property: "Luxury Villa in DHA Phase 5",
    },
  ]

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Ahmed Hassan",
      message: "Hi! I saw your listing for the luxury villa in DHA Phase 5. Is it still available?",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      senderId: "me",
      senderName: "You",
      message: "Hello Ahmed! Yes, the property is still available. Would you like to schedule a viewing?",
      time: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Ahmed Hassan",
      message: "That would be great! I'm available this weekend. What times work for you?",
      time: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      senderId: "me",
      senderName: "You",
      message:
        "Perfect! I have slots available on Saturday at 2 PM or Sunday at 11 AM. Which one works better for you?",
      time: "10:37 AM",
      isOwn: true,
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Ahmed Hassan",
      message: "Saturday at 2 PM sounds perfect. Should I bring any documents?",
      time: "10:40 AM",
      isOwn: false,
    },
    {
      id: 6,
      senderId: 1,
      senderName: "Ahmed Hassan",
      message: "Is the property still available for viewing?",
      time: "11:45 AM",
      isOwn: false,
    },
  ]

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat)
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.property.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle send message logic
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with potential buyers and sellers</p>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: "600px" }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === conversation.id ? "bg-emerald-50 border-emerald-200" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h4>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-emerald-600 mb-1 truncate">{conversation.property}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedConversation.avatar || "/placeholder.svg"}
                        alt={selectedConversation.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {selectedConversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                      <p className="text-sm text-emerald-600">{selectedConversation.property}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? "text-emerald-100" : "text-gray-500"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
