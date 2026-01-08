# Real-time Collaboration - Phase 1 Implementation

## What We Built

We've implemented Google Docs-style presence indicators for your ResumeTitan workshop feature. Users can now see who else is actively collaborating on a resume in real-time with colored avatars and online/idle status indicators.

## Features Implemented

### 1. **WebSocket Infrastructure**
- Socket.IO server integrated with Express backend
- Real-time bidirectional communication between server and clients
- Automatic reconnection handling

### 2. **Presence Tracking**
- **Online Status**: Green dot indicates user is actively connected
- **Idle Detection**: Gray dot after 30 seconds of no activity
- **Automatic Cleanup**: Users are marked offline when they disconnect

### 3. **Visual Components**
- **Collaborator Avatars**: Shows up to 5 collaborators with overflow counter
- **Color-coded Users**: Each user gets a random color for their avatar border
- **Initials Display**: Shows user initials if no avatar image available
- **Hover Tooltips**: Display user name and status on hover

### 4. **Activity Tracking**
- Mouse movements, keyboard input, and scrolling trigger activity signals
- Idle timeout after 30 seconds of inactivity
- Automatic status updates broadcast to all workshop participants

## Files Created/Modified

### Server Files
- **`server/src/sockets/workshop.ts`** - WebSocket event handlers for workshop collaboration
- **`server/src/index.ts`** - Socket.IO server setup and integration

### Client Files
- **`client/src/lib/services/websocket.ts`** - WebSocket client service with connection management
- **`client/src/lib/stores/presence.ts`** - Svelte store for managing participant state
- **`client/src/lib/components/workshop/CollaboratorAvatars.svelte`** - UI component for displaying collaborators
- **`client/src/routes/workshop/[id]/+page.svelte`** - Integration with workshop page

## How It Works

### Connection Flow
1. User opens a workshop page
2. Client connects to WebSocket server
3. Client emits `join-workshop` event with user info
4. Server adds user to workshop participants and broadcasts to room
5. All clients receive updated participant list
6. Avatars render with online indicators

### Activity Detection
1. Client listens for user interactions (mouse, keyboard, scroll)
2. Activity signals sent to server
3. Server updates participant status in database
4. Status changes broadcast to all room participants
5. After 30 seconds of inactivity, user marked as idle

### Disconnect Handling
1. User closes tab or loses connection
2. Socket.IO detects disconnect event
3. Server marks user as offline in database
4. Offline status broadcast to remaining participants
5. Avatar removed from collaborators display

## Testing the Feature

### Local Testing with Multiple Users

1. **Start the servers:**
   ```bash
   # Terminal 1 - Server
   cd server
   npm start

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

2. **Test with multiple browser sessions:**
   - Open the workshop page in Chrome: `http://localhost:5173/workshop/{id}`
   - Open the same URL in Firefox or an Incognito window
   - Sign in with different user accounts
   - You should see each user's avatar appear in the collaborators bar

3. **Test presence states:**
   - **Active**: Move mouse, type, or scroll → green dot
   - **Idle**: Stop all activity for 30 seconds → gray dot
   - **Offline**: Close one browser tab → avatar disappears from other sessions

### Environment Variables

Make sure you have the WebSocket URL configured:

**`client/.env` (or `.env.local`):**
```env
VITE_API_URL=http://localhost:3001
```

For production:
```env
VITE_API_URL=https://your-production-api-url.com
```

## UI Location

The collaborator avatars appear in a horizontal bar directly below the workshop header, showing:
- User avatar images or initials in colored circles
- Green dot for active users
- Gray dot for idle users
- "+X" indicator if more than 5 collaborators are online

## Database Schema

The existing `Workshop` model already supports this feature:

```typescript
participants: [
  {
    clerkId: String,      // User ID
    name: String,         // Display name
    email: String,        // Email
    avatar: String,       // Avatar URL
    initials: String,     // Initials (auto-generated)
    color: String,        // Random color (auto-assigned)
    isOnline: Boolean,    // Currently connected
    isActive: Boolean,    // Active vs idle
    joinedAt: Date        // When first joined
  }
]
```

## WebSocket Events

### Client → Server
- `join-workshop` - User joins a workshop room
- `leave-workshop` - User explicitly leaves
- `user-activity` - User performs an action
- `user-idle` - User has been inactive

### Server → Client
- `participants-list` - Full list of participants (on join)
- `user-joined` - Another user joined the room
- `user-left` - Another user left/disconnected
- `user-active` - User became active again
- `user-idle` - User went idle
- `error` - Error message

## Next Steps (Future Phases)

### Phase 2: Enhanced Activity Indicators
- Show which section of the resume each user is editing
- Display typing indicators
- Show cursor positions (optional)

### Phase 3: Real-time Content Sync
- Broadcast resume edits in real-time using Yjs or Automerge
- Conflict-free collaborative editing
- Optimistic updates with server reconciliation

### Phase 4: Advanced Features
- User permissions (view-only, edit, admin)
- User-specific colors persisted across sessions
- Activity feed showing who changed what
- @mentions in comments with notifications

## Troubleshooting

### Avatars not showing?
- Check browser console for WebSocket connection errors
- Verify `VITE_API_URL` is set correctly
- Ensure server is running and accessible

### Users not seeing each other?
- Both users must be in the same workshop (same workshop ID)
- Check that Socket.IO server is running (look for "WebSocket server is ready" in logs)
- Verify CORS settings in `server/src/index.ts` include your client URL

### Status not updating?
- Check browser console for activity event logs
- Verify idle timeout (30 seconds) is functioning
- Ensure participant updates are saving to MongoDB

## Performance Considerations

- WebSocket connections are persistent (low overhead)
- Activity signals are debounced to prevent flooding
- Participant list capped at 5 visible avatars (scales to any number)
- Automatic cleanup prevents memory leaks on disconnect

---

**Congratulations!** You now have real-time collaboration presence in your workshop feature. Users can see who's working together on resumes with Google Docs-style indicators.
