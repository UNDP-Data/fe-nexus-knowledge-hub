import { create } from 'zustand';

type Actions = {
  increment: (d?: number) => void;
  decrement: (d?: number) => void;
};

type Store = {
  count: number;
  actions: Actions;
};

export const useCounterStore = create<Store>(set => ({
  count: 0,
  actions: {
    increment: (d = 1) => set(state => ({ count: state.count + d })),
    decrement: (d = 1) => set(state => ({ count: state.count - d })),
  },
}));

export const useCounter = () => useCounterStore(s => s.count);

export const useCounterActions = () => useCounterStore(s => s.actions);
