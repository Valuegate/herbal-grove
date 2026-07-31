export const GoogleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
  </svg>
);

export const EyeIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const EyeSlashIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export const DashboardIcon = ({ className = "" }: { className?: string }) => (
  <svg className= {`w-5 h-5 ${className}`} fill="currentColor" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

export const ChatBubbleIcon = ({ className = "" } : { className?: string }) => (
  <svg className = {`w-5 h-5 ${className}`} fill="currentColor" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const BookIcon = ({ className = "" } : { className?: string }) => (
  <svg className = {`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

export const LeafLogo = ({ className = "" } : { className?: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C21 6 25 10 25 15C25 20 21 24 16 24L16 4Z" fill="#1a7a1e" />
      <path
        d="M16 6C11 6 7 10 7 15C7 20 11 24 16 24L16 6Z"
        fill="#1a7a1e"
        opacity="0.4"
      />
      <path
        d="M16 8L16 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 14C16 14 13 11 10 12"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M16 18C16 18 19 15 22 16"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
)

export const LogoutIcon = ({ className = "" } : { className?: string }) => (
  <svg className = {`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H9a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

export const NotificationIcon = ({ className = "" } : { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="green" stroke="none" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
) 

export const ProfileIcon = ({ className = "" } : { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="green" stroke="none" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export const ModeChangeIcon = ({ className = ""} : { className?: string }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
)

export const BookmarkIcon = ({ className = ""} : { className?: string }) => (
  <svg className={`w-4 h-4 mr-2 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
)

export const FlowerIcon = ({ className = ""} : { className?: string }) => (
  <svg
    className={`w-6 h-6 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    {/* Petals */}
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <circle cx="9" cy="8" r="2" fill="currentColor" />
    <circle cx="15" cy="8" r="2" fill="currentColor" />
    <circle cx="10" cy="4" r="2" fill="currentColor" />
    <circle cx="14" cy="4" r="2" fill="currentColor" />

    {/* Flower center */}
    <circle cx="12" cy="6" r="1" fill="white" />

    {/* Stem */}
    <path
      d="M12 10V20"
      strokeLinecap="round"
    />

    {/* Left upward leaf */}
    <path
      d="M12 16C10 15 9 13.5 9 12C11 12.5 12 14 12 16Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Right upward leaf */}
    <path
      d="M12 16C14 15 15 13.5 15 12C13 12.5 12 14 12 16Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
)

export const MenuIcon =({ className = ""} : { className?: string }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)