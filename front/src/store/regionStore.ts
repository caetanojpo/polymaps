import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {Region} from '@/types';

export interface RegionState {
    listOfRegions: Region[];
    loading: boolean;
    setRegions: (regions: Region[]) => void;
    fetchRegions: () => Promise<void>;
    addRegion: (region: Region) => void;
    removeRegion: (id: string) => void;
    updateRegion: (region: Region) => void;
}

export const useRegionStore = create<RegionState>()(
    persist(
        (set, get) => ({
            listOfRegions: [],
            loading: false,
            setRegions: (regions: Region[]) => set({listOfRegions: regions}),
            fetchRegions: async () => {
                set({loading: true});
                try {
                    const response = await fetch('/api/regions');
                    const data = await response.json();
                    set({listOfRegions: data, loading: false});
                } catch (error) {
                    console.error('Error fetching regions:', error);
                    set({loading: false});
                }
            },
            addRegion: (region: Region) =>
                set({listOfRegions: [...get().listOfRegions, region]}),
            removeRegion: (id: string) =>
                set({
                    listOfRegions: get().listOfRegions.filter((region) => region._id !== id),
                }),
            updateRegion: (updatedRegion: Region) =>
                set({
                    listOfRegions: get().listOfRegions.map((region) =>
                        region._id === updatedRegion._id ? updatedRegion : region
                    ),
                }),
        }),
        {
            name: 'region-storage',
        }
    )
);
