import Link from 'next/link';

export default function Footer() {
  return (
<footer className="py-6 px-8 mt-auto bg-card-bg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-text-secondary mb-4 sm:mb-0">
          © {new Date().getFullYear()} Tales of Deutsch
        </p>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Built with ❤️ by</span>
          <Link 
            href="https://github.com/StDensity" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            StDensity
          </Link>
          
          <Link 
            href="https://github.com/StDensity/Tales-of-Deutsch" 
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-accent hover:text-accent/80 transition-colors"
            aria-label="GitHub repository"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="feather feather-github"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}