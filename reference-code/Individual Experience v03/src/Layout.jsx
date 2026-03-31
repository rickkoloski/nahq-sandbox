import React from 'react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <style>{`
        :root {
          /* Primary Colors */
          --cyan-primary: #00A3E0;
          --yellow-accent: #FFED00;
          --charcoal: #3D3D3D;
          --black: #000000;
          
          /* Secondary/Domain Colors */
          --domain-professional: #6B4C9A;
          --domain-quality: #003DA5;
          --domain-process: #00B5E2;
          --domain-population: #8BC53F;
          --domain-analytics: #F68B1F;
          --domain-regulatory: #ED1C24;
          --domain-accountability: #99154B;
          
          /* Neutral Colors */
          --white: #FFFFFF;
          --light-gray: #F5F5F5;
          --medium-gray: #707070;
          --cool-gray: #C5D7DD;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--charcoal);
          -webkit-font-smoothing: antialiased;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--light-gray);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #C5D7DD;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9eb8c2;
        }
        
        /* Progress bar styling */
        [data-slot="progress-fill"] {
          background: linear-gradient(90deg, var(--cyan-primary), #00B5E2) !important;
        }
        
        /* Animated background pattern */
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes float-alt {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 25px) rotate(-120deg); }
          66% { transform: translate(20px, -20px) rotate(-240deg); }
        }
        
        .bg-pattern-shape {
          animation-timing-function: ease-in-out;
        }
      `}</style>
      
      {/* Subtle animated background patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-pattern-shape"
          style={{
            background: 'radial-gradient(circle, rgba(0,163,224,0.15) 0%, rgba(0,163,224,0) 70%)',
            animation: 'float 25s infinite'
          }}
        />
        <div 
          className="absolute bottom-32 left-24 w-80 h-80 rounded-full bg-pattern-shape"
          style={{
            background: 'radial-gradient(circle, rgba(255,237,0,0.12) 0%, rgba(255,237,0,0) 70%)',
            animation: 'float-alt 30s infinite'
          }}
        />
        <div 
          className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-pattern-shape"
          style={{
            background: 'radial-gradient(circle, rgba(0,181,226,0.1) 0%, rgba(0,181,226,0) 70%)',
            animation: 'float 35s infinite'
          }}
        />
        <div 
          className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-pattern-shape"
          style={{
            background: 'radial-gradient(circle, rgba(139,197,63,0.1) 0%, rgba(139,197,63,0) 70%)',
            animation: 'float-alt 28s infinite'
          }}
        />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}