// src/components/MessagesTab.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, MoreVertical, Phone, Video, ArrowLeft, PlusCircle, MessageCircleMore, User } from "lucide-react"; // Added PlusCircle, MessageCircleMore, User
// Import actual images for production, or use dynamic paths from backend
import hania from '../assets/hania.jpg'; // Ensure these paths are correct or mocked for demo
import zainab from '../assets/zainab2.jpg'; // Ensure these paths are correct or mocked for demo

const MessagesTab = () => {
  const [conversationsData, setConversationsData] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [showChatWindow, setShowChatWindow] = useState(false); // Controls visibility on mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // --- Utility Functions for UI consistency ---
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1 && date.getDate() === now.getDate() - 1) {
      return "Yesterday";
    }
    if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString();
  };

  // --- Simulated Backend Interaction ---
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Slightly longer delay for effect
      const data = [
        {
          id: 1,
          name: "Zainab Rauf",
          image: zainab,
          lastMessage: "Great, looking forward to it!",
          time: new Date(new Date().setHours(14, 15, 0)).toISOString(), // Dynamic time
          unread: 0,
          isOnline: true,
          messages: [
            { from: "them", text: "Hello! Are you still interested in the property on Elm Street?", time: "2:10 PM" },
            { from: "me", text: "Yes, I am! Could you tell me more about its availability?", time: "2:12 PM" },
            { from: "them", text: "Certainly! It's available for viewing this weekend. When works best for you?", time: "2:15 PM" },
            { from: "me", text: "Saturday morning would be great. Is 10 AM an option?", time: "2:18 PM" },
            { from: "them", text: "Yes, 10 AM on Saturday works perfectly. I'll confirm the address shortly.", time: "2:20 PM" },
            { from: "me", text: "Great, looking forward to it!", time: "2:22 PM" },
          ],
        },
        {
          id: 2,
          name: "Hania Khan",
          image: hania,
          lastMessage: "Thanks, I will think about it.",
          time: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
          unread: 0,
          isOnline: false,
          lastSeen: "Yesterday at 5:45 PM",
          messages: [
            { from: "me", text: "The price is negotiable.", time: "5:42 PM" },
            { from: "them", text: "Thanks, I will think about it.", time: "5:45 PM" },
          ],
        },
        {
          id: 3,
          name: "Ali Sameer",
          image: "https://randomuser.me/api/portraits/men/32.jpg", // Placeholder
          lastMessage: "Sure, let me check my calendar.",
          time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Older
          unread: 0,
          isOnline: false,
          lastSeen: "2 days ago",
          messages: [
            { from: "them", text: "Are you free to chat about the new listing?", time: "Mar 10, 10:00 AM" },
            { from: "me", text: "Sure, let me check my calendar.", time: "Mar 10, 10:05 AM" },
          ],
        },
        {
          id: 4,
          name: "Sara Qureshi",
          image: "https://randomuser.me/api/portraits/women/44.jpg", // Placeholder
          lastMessage: "Sounds good, looking forward!",
          time: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
          unread: 0,
          isOnline: true,
          messages: [
            { from: "them", text: "The documents are ready for review.", time: "April 2, 11:30 AM" },
            { from: "me", text: "Sounds good, looking forward!", time: "April 2, 11:35 AM" },
          ],
        },
      ];
      setConversationsData(data);
      // Automatically select the first chat if available
      if (data.length > 0) {
        setSelectedChatId(data[0].id);
      }
    } catch (err) {
      setError("Failed to load conversations.");
      console.error("Error fetching conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]); // Re-run effect if fetchConversations changes (though it's memoized)

  // Scroll to the latest message whenever messages change for the selected chat
  useEffect(() => {
    if (selectedChatId) { // Only scroll if a chat is actually selected
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatId, conversationsData]);

  const selectedChat = conversationsData.find(chat => chat.id === selectedChatId);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = { from: "me", text: messageInput, time: currentTime };

    // Optimistic UI update
    setConversationsData(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        if (conv.id === selectedChatId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageInput,
            time: new Date().toISOString(), // Update time to current ISO string for proper formatting
            unread: 0, // Mark as read when you send a message
          };
        }
        return conv;
      });
      return updatedConversations;
    });

    setMessageInput("");

    // In a real application, you would send this message to the backend
    // try {
    //   await axios.post(`/api/conversations/${selectedChatId}/messages`, newMessage);
    //   // If successful, you might get a confirmation or the exact message object back
    //   // and update the message with a 'sent' status or actual server timestamp.
    // } catch (err) {
    //   console.error("Failed to send message:", err);
    //   // Implement rollback or error state for the message
    // }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Allow shift+enter for new line
      e.preventDefault(); // Prevent default new line
      handleSend();
    }
  };

  const filteredConversations = conversationsData.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Loading State Component ---
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-700">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-t-4 border-t-emerald-500 border-gray-200 rounded-full"
      ></motion.div>
      <p className="mt-4 text-lg font-medium">Loading your messages...</p>
      <p className="text-sm text-gray-500">Connecting to the chat server.</p>
    </div>
  );

  // --- Error State Component ---
  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full bg-red-50 text-red-700 p-8 rounded-lg"
    >
      <XCircle size={48} className="mb-4" />
      <h2 className="text-2xl font-bold mb-2">Error Loading Messages</h2>
      <p className="text-lg text-center">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchConversations}
        className="mt-6 bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-red-700 transition-all duration-300"
      >
        Retry
      </motion.button>
    </motion.div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[500px] max-h-[800px] rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white text-gray-900">
      {/* Conversations List (Sidebar) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full md:w-[350px] border-r border-gray-100 bg-gray-50 flex flex-col ${showChatWindow ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Header with Search and New Chat */}
        <div className="p-4 border-b border-gray-100 bg-white shadow-sm flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <MessageCircleMore size={28} className="text-emerald-500" /> Chats
          </h2>
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-emerald-400 border border-gray-200 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#065f46" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <PlusCircle size={20} /> Start New Chat
          </motion.button>
        </div>

        {/* Conversation Items */}
        <div className="overflow-y-auto flex-1 custom-scrollbar pt-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.05 * chat.id }}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  setConversationsData(prev => prev.map(c =>
                    c.id === chat.id ? { ...c, unread: 0 } : c
                  ));
                  setShowChatWindow(true); // Show chat window on selection for mobile
                }}
                className={`relative flex items-center gap-4 p-3 mx-2 my-1 cursor-pointer rounded-xl transition duration-200 ease-in-out
                  ${selectedChatId === chat.id
                    ? "bg-emerald-100 text-emerald-800 font-semibold shadow-inner"
                    : "hover:bg-gray-100 text-gray-800"
                  }`}
              >
                {/* Avatar with Online Status */}
                <div className="relative">
                  <img
                    src={chat.image}
                    alt={chat.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-300 shadow-sm"
                  />
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-semibold text-base truncate">{chat.name}</p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTime(chat.time)}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[24px] h-5 flex items-center justify-center font-bold absolute -top-1 right-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    {chat.unread}
                  </motion.span>
                )}
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
              <MessageCircleMore size={40} className="mb-3 text-gray-300" />
              <p className="text-center text-lg font-medium">No conversations found.</p>
              <p className="text-sm text-center px-4">Try searching or start a new chat.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 flex flex-col bg-white ${selectedChat ? 'block' : 'hidden'} md:flex`}
      >
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
            <MessageCircleMore size={64} className="mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">Welcome to your Inbox!</h3>
            <p className="text-base">Select a conversation from the left to start chatting, or click "Start New Chat" to find someone new.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChatWindow(false)}
                  className="md:hidden text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={22} />
                </motion.button>
                <div className="relative">
                  <img
                    src={selectedChat.image}
                    alt={selectedChat.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                  />
                  {selectedChat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">{selectedChat.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedChat.isOnline ? "Online" : selectedChat.lastSeen || "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-gray-600">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Call">
                  <Phone size={20} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Video Call">
                  <Video size={20} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="More options">
                  <MoreVertical size={20} />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
              {selectedChat.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, type: "spring", damping: 15, stiffness: 200 }}
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-base shadow-sm relative ${
                      msg.from === "me"
                        ? "bg-emerald-600 text-white rounded-br-md" // Pointed bubble corner
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-100" // Pointed bubble corner
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] opacity-80 block text-right mt-1 font-mono">
                      {msg.time}
                    </span>
                  </motion.div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center shadow-inner">
              <textarea
                rows="1"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 custom-scrollbar-minimal"
                style={{ maxHeight: '100px' }} // Limit textarea height
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="bg-emerald-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center hover:bg-emerald-700 transition-colors duration-200 shadow-lg"
                aria-label="Send message"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default MessagesTab;