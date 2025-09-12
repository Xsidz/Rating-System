import { useState } from 'react';
import Card from './Card';
import Button from './Button';
import RatingForm from './RatingForm';
import useRatingStore from '../stores/ratingStore';
import useAuthStore from '../stores/authStore';


const StoreCard = ({ store }) => {
    const { user } = useAuthStore();
    const [showRatingForm, setShowRatingForm] = useState(false);

    
    const userRating = useRatingStore(state =>
        state.userRatings.find(rating => rating.store_id === store.id)
    );

    // Render star rating display with enhanced styling
    const renderStars = (rating, size = 'sm') => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        const starSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className={`${starSize} text-yellow-400 fill-current drop-shadow-sm`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className={`${starSize} relative`}>
                        <svg className={`${starSize} text-gray-300 fill-current absolute`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className={`${starSize} text-yellow-400 fill-current absolute overflow-hidden drop-shadow-sm`} style={{ clipPath: 'inset(0 50% 0 0)' }} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                );
            } else {
                stars.push(
                    <svg key={i} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }

        return <div className="flex items-center gap-0.5">{stars}</div>;
    };

    const handleRatingSuccess = () => {
        setShowRatingForm(false);
    };

    return (
        <Card hover gradient className="h-full group animate-scale-in">
            <div className="flex flex-col h-full">
               
                <div className="mb-4 sm:mb-6">
                 
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors duration-200 line-clamp-2 leading-tight">
                        {store.name}
                    </h3>

                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">{store.address}</p>
                    </div>

                    {/* Overall Rating */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                            {renderStars(store.averageRating || 0, 'sm')}
                            <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                                {store.averageRating ? store.averageRating.toFixed(1) : '0.0'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                            {store.totalRatings || 0} {store.totalRatings === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>
                </div>

                {/* User's Rating Section */}
                <div className="mt-auto space-y-2 sm:space-y-3">
                    {userRating ? (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-3 sm:p-4 rounded-lg border border-blue-200/50">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs sm:text-sm font-semibold text-blue-900">Your Rating</p>
                                <span className="text-xs text-blue-600 bg-blue-200/50 px-2 py-0.5 sm:py-1 rounded-full">
                                    Rated
                                </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {renderStars(userRating.rating)}
                                <span className="text-xs sm:text-sm font-bold text-blue-800">{userRating.rating}/5</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-3 sm:p-4 rounded-lg border border-gray-200/50">
                            <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Not rated yet</p>
                            </div>
                            <p className="text-xs text-gray-500">Share your experience</p>
                        </div>
                    )}

                    {/* Rating Action Button */}
                    <Button
                        variant={userRating ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => setShowRatingForm(true)}
                        fullWidth
                        className="group-hover:shadow-lg transition-all duration-300 text-xs sm:text-sm"
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {userRating ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            )}
                        </svg>
                        <span className="truncate">
                            {userRating ? 'Update' : 'Rate Store'}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Rating Form Modal */}
            {showRatingForm && (
                <RatingForm
                    store={store}
                    existingRating={userRating}
                    onClose={() => setShowRatingForm(false)}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </Card>
    );
};

export default StoreCard;