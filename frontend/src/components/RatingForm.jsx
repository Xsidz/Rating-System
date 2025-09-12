import { useState, useEffect } from 'react';
import Button from './Button';
import useRatingStore from '../stores/ratingStore';
import useStoreStore from '../stores/storeStore';
import useAuthStore from '../stores/authStore';


const RatingForm = ({ store, existingRating, onClose, onSuccess }) => {
    const { user } = useAuthStore();
    const { submitOrUpdateRating, loading, error } = useRatingStore();

    const [rating, setRating] = useState(existingRating?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!store.id) {
            alert('Store ID is required');
            return;
        }

        try {
            // Use  submission that handles both new and existing ratings
            await submitOrUpdateRating(store.id, rating);

            
            const { fetchStores } = useStoreStore.getState();
            await fetchStores();

            onSuccess();
        } catch (error) {
            console.error('Failed to submit rating:', error);
        }
    };

    const renderStarInput = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            const isActive = i <= (hoveredRating || rating);

            stars.push(
                <button
                    key={i}
                    type="button"
                    className={`w-8 h-8 transition-colors duration-150 ${isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                        }`}
                    onMouseEnter={() => setHoveredRating(i)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i)}
                >
                    <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            );
        }

        return stars;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {existingRating ? 'Update Rating' : 'Rate Store'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                   
                    <div className="mb-6 p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium text-gray-900">{store.name}</h4>
                        <p className="text-sm text-gray-600">{store.address}</p>
                    </div>

                    
                    <form onSubmit={handleSubmit}>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-1 mb-2">
                                {renderStarInput()}
                            </div>
                            <p className="text-sm text-gray-500">
                                {rating > 0 ? `${rating} out of 5 stars` : 'Click to rate'}
                            </p>
                        </div>



                       
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                className="flex-1"
                                disabled={rating === 0}
                            >
                                {existingRating ? 'Update Rating' : 'Submit Rating'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RatingForm;