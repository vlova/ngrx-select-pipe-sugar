type AppState = { count: number };

export const getCount = (state: AppState) => state.count;
export const makeGetCountAdjusted = (adjustment: number) => (state: AppState) => state.count + adjustment;
