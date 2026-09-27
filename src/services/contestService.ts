import { ContestEntry } from '../types/contestEntry';
import mockContestData from '../data/mockContestEntries.json';

let contestEntriesState: ContestEntry[] = [...(mockContestData as unknown as ContestEntry[])];

export const contestService = {
  /**
   * Retrieves contest entries.
   * Max 100 entries per week.
   */
  getContestEntries: async (): Promise<ContestEntry[]> => {
    await new Promise((res) => setTimeout(res, 200));
    return [...contestEntriesState];
  },

  /**
   * Fair distribution algorithm:
   * Rotates/shuffles order in the UI so every entry gets roughly equal exposure
   * rather than being buried by early engagement.
   */
  getShuffledEntries: async (): Promise<ContestEntry[]> => {
    await new Promise((res) => setTimeout(res, 200));
    const entries = [...contestEntriesState];
    // Fisher-Yates shuffle
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return entries;
  },

  submitContestEntry: async (entryData: Omit<ContestEntry, 'id' | 'likes' | 'commentsCount' | 'views' | 'weekNumber' | 'submissionDate'>): Promise<ContestEntry> => {
    if (contestEntriesState.length >= 100) {
      throw new Error('Weekly contest cap of 100 entries has been reached for this round.');
    }
    await new Promise((res) => setTimeout(res, 350));
    const newEntry: ContestEntry = {
      ...entryData,
      id: `contest-${Date.now()}`,
      likes: 0,
      commentsCount: 0,
      views: 1,
      weekNumber: 38,
      submissionDate: new Date().toISOString(),
      rank: contestEntriesState.length + 1,
    };
    contestEntriesState = [newEntry, ...contestEntriesState];
    return newEntry;
  },

  voteContestEntry: async (entryId: string): Promise<{ likes: number }> => {
    const entry = contestEntriesState.find((e) => e.id === entryId);
    if (entry) {
      entry.likes += 1;
      return { likes: entry.likes };
    }
    return { likes: 0 };
  },
};
