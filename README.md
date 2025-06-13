# CancApp Admin Control Center

A modern React-based admin dashboard for managing the CancApp platform. Built with TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

## Features

### 🔐 Authentication
- Secure admin login with JWT token authentication
- Automatic session management with refresh tokens
- Protected routes and automatic logout on session expiry

### 📊 Dashboard Overview
- Real-time user statistics with visual charts
- Breakdown by user types (Doctors, Patients, Pharmacists, Volunteers, Psychiatrists)
- Interactive pie charts and bar graphs using Recharts

### 👥 User Management
- Enable/disable user accounts
- Add warnings to user accounts
- Simple form-based interface for user actions

### ✅ Profile Verification
- Review pending professional profile verifications
- View profile images and professional licenses
- Approve or reject profile submissions
- Support for Doctors, Pharmacists, and Psychiatrists

### 🛡️ Content Moderation
- View and manage reported posts
- Review reported comments
- Monitor top posts by engagement metrics
- Tabbed interface for organization

### 🎨 Modern UI/UX
- Responsive design for all screen sizes
- Loading states and error handling
- Beautiful charts with Recharts
- shadcn/ui components with Tailwind CSS

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **bun**

## Installation

1. **Navigate to the project directory**
   ```bash
   cd cancapp-admin-control-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or if you prefer bun:
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   or with bun:
   ```bash
   bun run dev
   ```

4. **Open your browser**
   The application will automatically open at `http://localhost:5173`

## Configuration

### API Base URL
The application is configured to connect to the CancApp backend at:
```
http://cancapp.runasp.net/api
```

If you need to change the API endpoint, modify the `BASE_URL` in `src/services/api.ts`.

## Usage

### Login
1. Navigate to the login page
2. Enter your admin credentials (email and password)
3. The system will authenticate and redirect to the dashboard

### Dashboard Navigation
- **Dashboard**: Overview with user statistics and charts
- **User Management**: Enable/disable users and add warnings
- **Profile Verification**: Review and approve professional profiles
- **Content Moderation**: Manage reported content and view top posts

### User Management
1. Go to "User Management" section
2. Enter the User ID of the user you want to manage
3. Choose the appropriate action (Disable, Enable, or Add Warning)
4. Confirm the action

### Profile Verification
1. Navigate to "Profile Verification"
2. Review pending profile submissions
3. View profile images and licenses
4. Approve or reject the profile

### Content Moderation
1. Go to "Content Moderation"
2. Switch between tabs to view:
   - Reported Comments
   - Reported Posts
   - Top Posts
3. Review content and take appropriate actions

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/      # Dashboard-specific components
│   └── auth/           # Authentication components
├── hooks/              # Custom React hooks
├── services/           # API services
├── lib/                # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Dependencies

### Core Dependencies
- **React** (18.3.1) - UI library
- **TypeScript** (5.5.3) - Type safety
- **Vite** (5.4.1) - Build tool and dev server
- **Tailwind CSS** (3.4.11) - Styling
- **shadcn/ui** - UI component library
- **React Router** (6.26.2) - Client-side routing
- **TanStack Query** (5.56.2) - Data fetching
- **Recharts** (2.12.7) - Chart library

### Development Dependencies
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## API Endpoints

The dashboard integrates with the following backend endpoints:

### Authentication
- `POST /api/Dashboard/login` - Admin login

### Dashboard
- `GET /api/Dashboard/UserCharts` - Get user statistics
- `GET /api/Dashboard/UnCompletedProfile` - Get uncompleted profiles
- `POST /api/Dashboard/ConfirmCompleteProfile` - Approve profile
- `POST /api/Dashboard/FailCompleteProfile` - Reject profile

### User Management
- `POST /api/Dashboard/disable` - Disable user
- `POST /api/Dashboard/enable` - Enable user
- `POST /api/Dashboard/warning` - Add warning

### Content Moderation
- `GET /api/Dashboard/reported-comments` - Get reported comments
- `GET /api/Dashboard/reported-posts` - Get reported posts
- `GET /api/Dashboard/top-posts` - Get top posts

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the backend allows requests from `http://localhost:5173`
   - Check if the API base URL is correct

2. **Authentication Issues**
   - Verify admin credentials
   - Check if the JWT token is being sent correctly
   - Clear browser storage if needed

3. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Clear npm cache: `npm cache clean --force`

4. **Port Already in Use**
   - The app will automatically suggest using a different port
   - Or manually kill the process using the port

### Performance Tips

- The app uses React Query for efficient data caching
- Images are lazy-loaded for better performance
- Charts are responsive and optimized
- Components are optimized with React.memo where appropriate

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Features

- JWT token authentication
- Automatic token refresh
- Protected routes
- Input validation
- XSS protection
- CSRF protection (handled by backend)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the CancApp platform and is proprietary software.

## Support

For technical support or questions, please contact the development team.

---

**Note**: This dashboard requires access to the CancApp backend API. Make sure you have the correct API credentials and permissions before using the dashboard.
