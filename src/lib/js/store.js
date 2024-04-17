import { writable } from 'svelte/store';

// Create a writable store to hold the selected passage value
export const selectedPassage = writable('');
