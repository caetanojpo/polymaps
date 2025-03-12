"use client"
import React from 'react';
import { DashboardTemplate } from '@/components/templates/DashboardTemplate';
import { Coordinates, Region } from '@/types';
import { useAuthStore } from "@/store/authStore";
import { useRegionStore } from '@/store/regionStore';

export default function Dashboard() {
    const { user, token } = useAuthStore();
    const { listOfRegions, setRegions, addRegion } = useRegionStore();

    const handleSearch = async (type: 'contains' | 'near', coordinates: { latitude: number; longitude: number }) => {
        try {
            const points: Coordinates = coordinates;
            // Replace this with your actual searchRegions API call
            // const data = await searchRegions(points);
            const data: Region[] = []; // For example purposes only
            setRegions(data);
        } catch (error) {
            console.error(`Error searching regions ${type}:`, error);
        }
    };

    const handleAddRegion = async (name: string, coords: { latitude: number; longitude: number }[]) => {
        try {
            const coordinates = [
                [...coords.map(coord => [coord.longitude, coord.latitude])]
            ];
            const ownerId = user?._id;
            const response = await fetch('/api/regions/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, coordinates, ownerId, token })
            });
            const data = await response.json();
            addRegion(data.data.mappedRegion);
        } catch (error) {
            console.error('Error creating region:', error);
        }
    };

    return (
        <DashboardTemplate
            regions={listOfRegions}
            onSearch={handleSearch}
            onAddRegion={handleAddRegion}
        />
    );
}
