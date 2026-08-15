# SocialApp 🚀

A modern Facebook-inspired social media application built with **React and Vite**, featuring authentication, posts, profiles, friendships, private messaging, and AI-powered communication.

The project started as a frontend social media application and evolved into a more feature-rich platform with an integrated **friend system, private chat, and AI-assisted messaging**.

---

## ✨ Features

### 🔐 Authentication

* Sign up and log in with form validation
* Persistent user sessions
* Protected routes for authenticated users
* User information stored and managed through application state

### 📰 Social Feed

* Browse public posts
* Create new posts
* Edit and delete your own posts
* Draft posts
* Public/private post visibility
* Image upload with preview
* Like and unlike posts
* Add comments
* Delete your own comments

### 👤 User Profiles

* Public user profiles
* Editable profile information
* Profile bio and location
* Avatar and cover image
* Profile updates reflected throughout the application

### 🤝 Friend System

* Discover other users
* Send friend requests
* Receive incoming friend requests
* Accept or reject requests
* Manage connected friends
* Friend relationships are integrated with the messaging system

### 💬 Private Messaging

* Chat privately with connected friends
* Create conversations between users
* Send and receive messages
* Conversation-based messaging interface
* Persistent chat data

### 🤖 AI-Powered Chat

* Integrated AI assistant
* Chat with AI directly inside the application
* AI-generated responses
* AI-assisted communication inside the messaging experience

### ✨ AI Auto-Chat

One of the key features of SocialApp is **AI Auto-Chat**.

Users can choose to let the AI generate a message and send it on their behalf during a conversation.

This demonstrates how AI can be integrated directly into an existing social application's communication system rather than functioning only as a standalone chatbot.

### 🌙 Dark Mode

* Toggle between light and dark themes
* User preference is remembered between sessions

### ⚡ Performance

* React lazy loading for individual pages
* Component-based architecture
* Reusable UI components
* Centralized application state using Context API

---

## 🛠️ Built With

* **React**
* **Vite**
* **React Router v6**
* **Tailwind CSS**
* **React Hook Form**
* **Context API**
* **localStorage**
* **clsx**
* **AI API Integration**

---

## 🧠 Application Architecture

The application is organized around reusable React components, Context API state management, and a centralized storage layer.

The main data entities include:

```text
Users
Posts
Comments
Likes
Friend Requests
Friendships
Conversations
Messages
Current User
```

Example data structures:

```js
// users
{
  id,
  name,
  email,
  password,
  bio,
  location,
  avatar,
  coverImage,
  joinedAt
}

// posts
{
  id,
  authorId,
  description,
  image,
  isPublic,
  isDraft,
  createdAt,
  updatedAt
}

// friendRequests
{
  id,
  senderId,
  receiverId,
  status,
  createdAt
}

// conversations
{
  id,
  participantIds,
  createdAt,
  updatedAt
}

// messages
{
  id,
  conversationId,
  senderId,
  text,
  isAI,
  createdAt
}
```

---

## 🔄 How the Friend & Chat System Works

The social connection flow is:

```text
User Profile
     ↓
Send Friend Request
     ↓
Request Accepted
     ↓
Friendship Created
     ↓
Start Conversation
     ↓
Send Messages
     ↓
Optional AI Assistance
```

This creates a complete flow from **discovering a user → connecting with them → communicating with them**.

---

## 🤖 AI Auto-Chat Flow

```text
User opens conversation
        ↓
AI Auto-Chat enabled
        ↓
AI generates message
        ↓
User chooses to send
        ↓
Message appears in conversation
```

The AI feature is designed as part of the application's messaging workflow, allowing AI-generated communication to interact with the same messaging system used for normal conversations.

---

## 📚 What I Learned

Building SocialApp has helped me understand how to structure and manage a larger React application with multiple interconnected features.

Designing the storage layer before building individual components helped me think about **data structures and relationships first**, making it easier to build features such as posts, comments, friendships, conversations, and messages.

Working with **Context API** improved my understanding of global state management and how changes to one piece of application state can affect multiple parts of the UI.

The friend-request and messaging systems helped me understand how to model relationships between users and how those relationships can control access to application features.

I also learned an important React concept: **localStorage does not automatically trigger React re-renders**. After actions such as liking posts, accepting friend requests, or sending messages, application state must be updated so that the UI immediately reflects the changes.

Integrating AI into the messaging system was another major learning experience. Instead of treating AI as a separate chatbot, I learned how AI-generated content can become part of an existing application's workflow.

Overall, this project strengthened my understanding of **React architecture, state management, routing, reusable components, form handling, data modeling, authentication flows, social interactions, messaging systems, and AI integration**.

---

## 🚀 Run Locally

Clone the repository and install the dependencies:

```bash
git clone https://github.com/emanfatima4511-dot/Social-App-React.git
```

```bash
cd Social-App-React
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🌱 Future Development

The project will continue evolving toward a more complete full-stack social platform.

Planned improvements include:

* Node.js + Express backend
* MongoDB database
* Secure authentication
* Real-time messaging
* Notifications
* Online/offline status
* Media sharing
* Cloud storage
* More advanced AI-powered social features

---

## 👩‍💻 Author

**Eman Fatima**

*MERN Stack + AI Engineering Bootcamp*

---

⭐ If you find this project interesting, feel free to explore the repository and follow the development journey!
