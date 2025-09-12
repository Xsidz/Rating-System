import Navigation from './Navigation';

const Layout = ({ children, maxWidth = '7xl', className = '', fluid = false }) => {
  const containerClasses = fluid
    ? 'w-full px-4 sm:px-6 lg:px-8'
    : `max-w-${maxWidth} mx-auto px-4 sm:px-6 lg:px-8`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <main className={`${containerClasses} py-4 sm:py-6 lg:py-8 ${className}`}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;