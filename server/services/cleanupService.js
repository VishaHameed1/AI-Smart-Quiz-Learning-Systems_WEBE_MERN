const Attempt = require('../models/Attempt');
const ReviewQueue = require('../models/ReviewQueue.model');
const Progress = require('../models/Progress.model');
const AIQuestionCache = require('../models/AIQuestionCache');

class CleanupService {
  // Delete old completed quiz attempts (older than specified days)
  async deleteOldAttempts(daysOld = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Attempt.deleteMany({
      status: 'completed',
      endTime: { $lt: cutoffDate }
    });

    return {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} old completed attempts older than ${daysOld} days`
    };
  }

  // Delete abandoned attempts (never completed and older than specified days)
  async deleteAbandonedAttempts(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Attempt.deleteMany({
      status: 'abandoned',
      startTime: { $lt: cutoffDate }
    });

    return {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} abandoned attempts older than ${daysOld} days`
    };
  }

  // Delete old review queue items that are past due and not reviewed
  async deleteOldReviewItems(daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await ReviewQueue.deleteMany({
      nextReviewDate: { $lt: cutoffDate },
      lastReviewed: { $exists: false }
    });

    return {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} old unreviewed queue items older than ${daysOld} days`
    };
  }

  // Clean up old progress history entries (keep only recent ones)
  async cleanProgressHistory(keepLast = 50) {
    const progresses = await Progress.find({});
    let totalDeleted = 0;

    for (const progress of progresses) {
      if (progress.history && progress.history.length > keepLast) {
        const toDelete = progress.history.length - keepLast;
        progress.history = progress.history.slice(-keepLast);
        await progress.save();
        totalDeleted += toDelete;
      }
    }

    return {
      deletedCount: totalDeleted,
      message: `Cleaned up progress history, keeping last ${keepLast} entries per topic`
    };
  }

  // Clean expired AI cache (though it should auto-expire, this is a manual cleanup)
  async cleanExpiredAICache() {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 24); // 24 hours ago

    const result = await AIQuestionCache.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} expired AI cache entries`
    };
  }

  // Run all cleanup operations
  async runFullCleanup(options = {}) {
    const {
      oldAttemptsDays = 365,
      abandonedAttemptsDays = 30,
      oldReviewDays = 90,
      keepProgressHistory = 50
    } = options;

    const results = {
      oldAttempts: await this.deleteOldAttempts(oldAttemptsDays),
      abandonedAttempts: await this.deleteAbandonedAttempts(abandonedAttemptsDays),
      oldReviewItems: await this.deleteOldReviewItems(oldReviewDays),
      progressHistory: await this.cleanProgressHistory(keepProgressHistory),
      aiCache: await this.cleanExpiredAICache()
    };

    const totalDeleted = Object.values(results).reduce((sum, r) => sum + r.deletedCount, 0);

    return {
      success: true,
      message: `Cleanup completed. Total items deleted: ${totalDeleted}`,
      details: results
    };
  }
}

module.exports = new CleanupService();