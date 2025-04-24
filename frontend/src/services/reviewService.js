async voteReview(reviewId, voteType) {
    try {
        const response = await api.post(`/reviews/${reviewId}/vote`, {
            voteType
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to vote on review');
    }
},

async reportReview(reviewId, reason = '') {
    try {
        const response = await api.post(`/reviews/${reviewId}/report`, {
            reason
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to report review');
    }
},

async getReviewAnalytics(timeRange = '30') {
    try {
        const response = await api.get('/reviews/analytics', {
            params: { timeRange }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch review analytics');
    }
} 