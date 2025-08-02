import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  PlusCircle,
  MessageCircleMore,
  User,
  Image as ImageIcon,
  FileText,
  Smile,
  Info,
  ChevronDown,
} from "lucide-react";

// Using placeholder images as a reliable way to show assets in this environment.
// For a real app, you would use actual image files.
const hania = "https://placehold.co/100x100/A7F3D0/047857?text=HK";
const zainab = "https://placehold.co/100x100/C7D2FE/3730A3?text=ZR";


// A single conversation component for better modularity
const ConversationItem = ({ chat, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: 0.05 }}
    onClick={onClick}
    className={`relative flex items-center gap-4 p-3 mx-2 my-1 cursor-pointer rounded-xl transition-all duration-200 ease-in-out
      ${isSelected ? "bg-emerald-100 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300 font-semibold shadow-inner" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"}
    `}
  >
    <div className="relative">
      <img src={chat.image} alt={chat.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-300 dark:border-emerald-700 shadow-sm" />
      {chat.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse-slow" />}
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-0.5">
        <p className="font-semibold text-base truncate">{chat.name}</p>
        <span className={`text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{chat.time}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
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
);

const ChatMessage = ({ message, isMine }) => {
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] lg:max-w-[50%] px-4 py-2.5 rounded-2xl text-base shadow-sm relative break-words
          ${isMine ? "bg-emerald-600 text-white rounded-br-md" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-100 dark:border-gray-700"}
        `}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <span className="text-[10px] opacity-80 block text-right mt-1 font-mono">{message.time}</span>
      </div>
    </motion.div>
  );
};

const MessagesTab = () => {
  const [conversationsData, setConversationsData] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  // `showChatWindow` is the key state for mobile responsiveness
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // --- Utility Functions ---
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString();
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      // Show button if not at the bottom
      setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100);
    }
  };

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  // --- Data Fetching ---
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = [
        {
          id: 1, name: "Zainab Rauf", image: zainab, lastMessage: "Yes, 10 AM on Saturday works perfectly. I'll confirm the address shortly.", time: new Date().toISOString(), unread: 2, isOnline: true,
          messages: [
            { from: "them", text: "Hello! Are you still interested in the property?", time: "2:10 PM" },
            { from: "me", text: "Yes, I am!", time: "2:12 PM" },
            { from: "them", text: "Certainly! It's available for viewing this weekend.", time: "2:15 PM" },
            { from: "me", text: "Saturday morning would be great.", time: "2:18 PM" },
            { from: "them", text: "Yes, 10 AM on Saturday works perfectly. I'll confirm the address shortly.", time: "2:20 PM" },
          ],
        },
        {
          id: 2, name: "Hania Khan", image: hania, lastMessage: "Thanks, I will think about it.", time: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), unread: 0, isOnline: false, lastSeen: "Yesterday at 5:45 PM",
          messages: [
            { from: "me", text: "The price is negotiable.", time: "5:42 PM" },
            { from: "them", text: "Thanks, I will think about it.", time: "5:45 PM" },
          ],
        },
        {
          id: 3, name: "Ali Sameer", image: "https://randomuser.me/api/portraits/men/32.jpg", lastMessage: "Sure, let me check my calendar.", time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), unread: 0, isOnline: false, lastSeen: "2 days ago",
          messages: [
            { from: "them", text: "Are you free to chat about the new listing?", time: "Mar 10, 10:00 AM" },
            { from: "me", text: "Sure, let me check my calendar.", time: "Mar 10, 10:05 AM" },
          ],
        },
        {
          id: 4, name: "Sara Qureshi", image: "https://randomuser.me/api/portraits/women/44.jpg", lastMessage: "Sounds good, looking forward!", time: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), unread: 0, isOnline: true,
          messages: [
            { from: "them", text: "The documents are ready for review.", time: "April 2, 11:30 AM" },
            { from: "me", text: "Sounds good, looking forward!", time: "April 2, 11:35 AM" },
          ],
        },
      ];
      setConversationsData(data.map(chat => ({ ...chat, time: formatTime(chat.time) })));
      if (data.length > 0) {
        setSelectedChatId(data[0].id);
      }
    } catch (err) {
      setError("Failed to load conversations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedChatId) {
      // Scroll to bottom without animation on initial chat load/selection
      scrollToBottom("auto");
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (selectedChatId && messagesContainerRef.current) {
      // Smooth scroll for new messages after state update
      scrollToBottom();
    }
  }, [conversationsData]);

  const selectedChat = conversationsData.find(chat => chat.id === selectedChatId);

  // --- Message Sending Logic ---
  const handleSend = () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = { from: "me", text: messageInput, time: currentTime };

    setConversationsData(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedChatId ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageInput, time: formatTime(new Date().toISOString()), unread: 0 } : conv
      )
    );
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredConversations = conversationsData.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- Loading/Error Components ---
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-t-4 border-t-emerald-500 dark:border-t-emerald-400 border-gray-200 dark:border-gray-700 rounded-full" />
      <p className="mt-4 text-lg font-medium">Loading your messages...</p>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950 rounded-lg">
      <Info size={48} className="mb-4" />
      <h2 className="text-2xl font-bold mb-2">Error Loading Messages</h2>
      <p className="text-lg text-center">Failed to fetch conversations. Please try again.</p>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchConversations} className="mt-6 bg-red-600 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-red-700 transition-all duration-300">
        Retry
      </motion.button>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-160px)] min-h-[600px] max-w-full md:max-w-7xl mx-auto rounded-2xl md:overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Conversations List (Sidebar) */}
      {/* The core responsive logic: on mobile, show this div OR the chat window, but not both. */}
      {/* On larger screens (md:), always show both divs side-by-side. */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full md:w-[380px] md:min-w-[320px] border-r border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col ${showChatWindow ? 'hidden' : 'flex'} md:flex`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <MessageCircleMore size={28} className="text-emerald-500" /> Chats
          </h2>
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-400 border border-gray-200 dark:border-gray-700 transition-all duration-200"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-emerald-600 text-white py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200">
            <PlusCircle size={20} /> Start New Chat
          </motion.button>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar-light dark:custom-scrollbar-dark pt-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(chat => (
              <ConversationItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChatId === chat.id}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  setConversationsData(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
                  // Show the chat window on mobile
                  setShowChatWindow(true);
                }}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
              <MessageCircleMore size={40} className="mb-3 text-gray-300 dark:text-gray-600" />
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
        // This is the core responsive logic: on mobile, show only this div if `showChatWindow` is true
        className={`flex-1 flex flex-col bg-white dark:bg-gray-900 ${showChatWindow ? 'flex' : 'hidden'} md:flex`}
      >
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6 text-center">
            <MessageCircleMore size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
            <h3 className="text-xl font-semibold mb-2">Welcome to your Inbox!</h3>
            <p className="text-base">Select a conversation from the left to start chatting, or click "Start New Chat" to find someone new.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowChatWindow(false)} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Back to conversations">
                  <ArrowLeft size={22} />
                </motion.button>
                <div className="relative cursor-pointer">
                  <img src={selectedChat.image} alt={selectedChat.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 dark:border-emerald-600" />
                  {selectedChat.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{selectedChat.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedChat.isOnline ? "Online" : selectedChat.lastSeen || "Offline"}</p>
                </div>
              </div>
              <div className="flex gap-3 text-gray-600 dark:text-gray-400">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Call"><Phone size={20} /></motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Video Call"><Video size={20} /></motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="More options"><MoreVertical size={20} /></motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950 custom-scrollbar-light dark:custom-scrollbar-dark relative">
              {selectedChat.messages.map((msg, i) => <ChatMessage key={i} message={msg} isMine={msg.from === "me"} />)}
              <div ref={messagesEndRef} />
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => scrollToBottom()}
                    className="absolute bottom-4 right-4 md:right-8 p-3 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors z-10"
                  >
                    <ChevronDown size={24} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Message Input with Attachments & Emojis */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-3 items-end shadow-inner">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" aria-label="Attach file">
                <PlusCircle size={20} />
              </motion.button>
              <textarea
                rows="1"
                placeholder="Type a message..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2.5 text-sm resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 custom-scrollbar-minimal"
                style={{ maxHeight: '100px' }}
              />
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" aria-label="Add emoji">
                <Smile size={20} />
              </motion.button>
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
