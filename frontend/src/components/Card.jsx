const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  gradient = false,
  responsive = true,
  ...props
}) => {
  const baseClasses = gradient
    ? 'bg-gradient-to-br from-white to-gray-50/50 rounded-lg sm:rounded-xl border border-gray-200/60 backdrop-blur-sm'
    : 'bg-white rounded-lg sm:rounded-xl border border-gray-200/60';

  const paddingClasses = responsive ? {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  } : {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const hoverClasses = hover
    ? 'hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 hover:border-blue-200/80 transition-all duration-300 cursor-pointer active:scale-[0.98]'
    : 'transition-shadow duration-200';

  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;