import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useMessageRecipients } from "../hooks/useMessageRecipients";
import { formatDate, formatDateTime, getMessageDate } from "../utils/dateFormatter";
import "./MessagesPage.css";

function MessagesPage({ token, role }) {
    const {
        inboxMessages,
        sentMessages,
        unreadCount,
        error,
        markAsRead,
        sendMessage
    } = useMessages(token);

    const { recipients } = useMessageRecipients(token, role);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [activeTab, setActiveTab] = useState('inbox');
    const [newMessage, setNewMessage] = useState({
        receiverId: "",
        subject: "",
        content: "",
    });
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000); // Auto-hide after 3 seconds
    };

    const getMessageDisplayName = (message, isInbox) => {
        if (isInbox) {
            return message.senderName || message.senderUsername || 'Unknown sender';
        } else {
            return message.receiverName || message.receiverUsername || 'Unknown recipient';
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSending(true);

        const result = await sendMessage(newMessage);

        if (result.success) {
            setNewMessage({ receiverId: "", subject: "", content: "" });
            setShowCompose(false);
            showFeedback('success', 'Message sent successfully');
        } else {
            showFeedback('error', 'Failed to send message: ' + result.error);
        }

        setSending(false);
    };

    const handleMessageSelect = (message) => {
        setSelectedMessage(message);
        setShowCompose(false);

        if (activeTab === 'inbox' && !message.isRead) {
            markAsRead(message.id);
        }
    };

    const handleCompose = () => {
        setShowCompose(true);
        setSelectedMessage(null);
    };

    const handleCancelCompose = () => {
        setShowCompose(false);
        setNewMessage({ receiverId: "", subject: "", content: "" });
    };

    const currentMessages = activeTab === 'inbox' ? inboxMessages : sentMessages;

    return (
        <div className="messages-page">
            {error && (
                <div className="error-banner" role="alert">
                    {error}
                </div>
            )}

            {feedback && (
                <div className={`feedback-banner ${feedback.type}`} role="alert">
                    {feedback.message}
                </div>
            )}

            <div className="messages-header">
                <h1>Messages</h1>
                <button className="btn-primary" onClick={handleCompose}>
                    + Compose New
                </button>
            </div>

            <div className="messages-tabs">
                <button
                    className={activeTab === 'inbox' ? 'tab active' : 'tab'}
                    onClick={() => {
                        setActiveTab('inbox');
                        setSelectedMessage(null);
                        setShowCompose(false);
                    }}
                >
                    Inbox ({unreadCount} unread)
                </button>
                <button
                    className={activeTab === 'sent' ? 'tab active' : 'tab'}
                    onClick={() => {
                        setActiveTab('sent');
                        setSelectedMessage(null);
                        setShowCompose(false);
                    }}
                >
                    Sent ({sentMessages.length})
                </button>
            </div>

            <div className="messages-layout">
                <div className="messages-sidebar">
                    <h3>{activeTab === 'inbox' ? 'Inbox' : 'Sent Messages'}</h3>
                    <div className="messages-list">
                        {currentMessages.length === 0 ? (
                            <p className="no-messages">
                                {activeTab === 'sent' ?
                                    'No sent messages' :
                                    'No messages in inbox'}
                            </p>
                        ) : (
                            currentMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message-item ${!msg.isRead && activeTab === 'inbox' ? "unread" : ""} ${
                                        selectedMessage?.id === msg.id ? "selected" : ""
                                    }`}
                                    onClick={() => handleMessageSelect(msg)}
                                >
                                    <div className="message-sender">
                                        {getMessageDisplayName(msg, activeTab === 'inbox')}
                                        {!msg.isRead && activeTab === 'inbox' && <span className="unread-badge">New</span>}
                                    </div>
                                    <div className="message-subject">{msg.subject}</div>
                                    <div className="message-date">
                                        {formatDate(getMessageDate(msg))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="message-content">
                    {showCompose ? (
                        <div className="compose-form">
                            <h2>Compose New Message</h2>
                            <form onSubmit={handleSendMessage}>
                                <div className="form-group">
                                    <label htmlFor="recipient">To:</label>
                                    <select
                                        id="recipient"
                                        value={newMessage.receiverId}
                                        onChange={(e) =>
                                            setNewMessage({ ...newMessage, receiverId: e.target.value })
                                        }
                                        required
                                        disabled={sending}
                                    >
                                        <option value="">Select recipient</option>
                                        {recipients.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject:</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        value={newMessage.subject}
                                        onChange={(e) =>
                                            setNewMessage({ ...newMessage, subject: e.target.value })
                                        }
                                        required
                                        disabled={sending}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="content">Message:</label>
                                    <textarea
                                        id="content"
                                        value={newMessage.content}
                                        onChange={(e) =>
                                            setNewMessage({ ...newMessage, content: e.target.value })
                                        }
                                        rows="10"
                                        required
                                        disabled={sending}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={sending}
                                    >
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={handleCancelCompose}
                                        disabled={sending}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : selectedMessage ? (
                        <div className="message-detail">
                            <h2>{selectedMessage.subject}</h2>
                            <div className="message-meta">
                                <p>
                                    <strong>{activeTab === 'inbox' ? 'From' : 'To'}:</strong>{' '}
                                    {getMessageDisplayName(selectedMessage, activeTab === 'inbox')}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {formatDateTime(getMessageDate(selectedMessage))}
                                </p>
                            </div>
                            <div className="message-body">{selectedMessage.content}</div>
                        </div>
                    ) : (
                        <div className="no-selection">
                            <h3>No message selected</h3>
                            <p>Select a message from the {activeTab} or compose a new one</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
