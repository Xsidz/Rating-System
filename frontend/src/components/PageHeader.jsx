const PageHeader = ({
  title,
  subtitle = null,
  action = null,
  className = '',
  gradient = false
}) => {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${gradient
            ? 'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
            : 'text-gray-900'
            } leading-tight`}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base sm:text-lg text-gray-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 flex flex-col xs:flex-row sm:flex-col lg:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;