
**Free Peer-to-Peer Application Hosting Platform**

![OmniVertex Digital](https://img.shields.io/badge/OmniVertex-Digital-58A6FF?style=for-the-badge)

## 🎯 Overview

OmniVertex Digital is a revolutionary platform that enables developers, hobbyists, and students to host and share their applications without any costs. No domain names, no cloud services, no paid integrations - just your code, running anywhere, for free.

## 🚀 Features

### Zero-Cost Hosting
- Host applications directly from your device
- No domain registration required
- No cloud service subscriptions
- Completely free, forever

### Peer-to-Peer Sharing
- Apps run directly from the host's device
- Real-time peer connections via WebSocket
- Share via unique URLs or local network

### Local Network Discovery
- Find apps on your local network
- Works without internet connection
- Perfect for offline collaboration

### Community Marketplace
- Discover apps shared by other users
- Browse by categories
- Search by name, tags, or description

### User Dashboard
- Manage your uploaded apps
- Track hosting statistics
- View app usage analytics

## 🛠️ Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Real-time**: Socket.io
- **File Handling**: Multer
- **Styling**: Custom CSS

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone or download the project**

2. **Install server dependencies**
   
```
bash
   cd omnivertex-digital/server
   npm install
   
```

3. **Install client dependencies**
   
```
bash
   cd ../client
   npm install
   
```

## ▶️ Running the Application

1. **Start the server** (Terminal 1)
   
```
bash
   cd omnivertex-digital/server
   npm start
   
```
   Server runs on: http://localhost:3001

2. **Start the client** (Terminal 2)
   
```
bash
   cd omnivertex-digital/client
   npm start
   
```
   Client runs on: http://localhost:3000

3. **Open your browser**
   Navigate to http://localhost:3000

## 📖 How to Use

### Uploading an App

1. Click the **Upload** button in the navigation
2. Drag and drop your app files (HTML, CSS, JS, images)
3. Fill in the app details:
   - App name
   - Description
   - Category
   - Tags (optional)
4. Click **Upload & Host App**

### Hosting Your App

After uploading:
1. Go to **Dashboard**
2. Find your app in the list
3. Click **Start Hosting** to make it live
4. Share the generated link with others

### Finding Apps

1. Go to **Explore** (home page)
2. Use the search bar to find specific apps
3. Filter by category using the tabs
4. Click on any app card to view details
5. Click **Launch** to use the app

## 🔧 Technical Details

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps` | Get all public apps |
| GET | `/api/apps/:id` | Get app by ID |
| POST | `/api/apps` | Upload new app |
| DELETE | `/api/apps/:id` | Delete an app |
| POST | `/api/apps/:id/host` | Start hosting an app |
| POST | `/api/apps/:id/stop-hosting` | Stop hosting |
| GET | `/api/stats` | Get platform statistics |

### File Structure

```
omnivertex-digital/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/
│   ├── src/
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🌟 Use Cases

### For Students
- Deploy class projects without costs
- Build a portfolio of hosted apps
- Learn web development without spending money

### For Hobbyists
- Share experiments with friends
- Test ideas quickly
- Build personal tools for yourself

### For Developers
- Prototype ideas instantly
- Share demos with clients
- Test applications across devices

### For Communities
- Share tools within teams
- Collaborate on local networks
- Build offline-capable applications

## ⚠️ Important Notes

- Apps are hosted as long as the server is running
- For persistent hosting, keep your device online
- Local network discovery works within the same network
- No authentication required - open platform for everyone

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📝 License

MIT License - Feel free to use this project for any purpose.

## 🙏 Acknowledgments

Built with the vision of making app hosting accessible to everyone, regardless of financial circumstances.

---

**OmniVertex Digital** - *Host Without Limits*
