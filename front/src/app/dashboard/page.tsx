"use client"
import React, {useState} from 'react';
import {DashboardTemplate} from '@/components/templates/DashboardTemplate';
import {Coordinates, Region} from '@/types';

export default function Dashboard() {
    const [regions, setRegions] = useState<Region[]>([]);

    const handleSearch = async (type: 'contains' | 'near', coordinates: { latitude: number; longitude: number }) => {
        try {
            const points: Coordinates = coordinates;
            // const data = await searchRegions(points);
            setRegions(data);
        } catch (error) {
            console.error(`Error searching regions ${type}:`, error);
        }
    };

    const handleAddRegion = async (name: string, coordinates: { latitude: number; longitude: number }[]) => {
        try {
            const geometry = {
                type: 'Polygon' as const,
                coordinates: [
                    [...coordinates.map(coord => [coord.longitude, coord.latitude]),
                        [coordinates[0].longitude, coordinates[0].latitude]]
                ]
            };

            //TODO add user ID here

            // const newRegion = await createRegion(name, geometry);
            setRegions(prevRegions => [...prevRegions, newRegion]);
        } catch (error) {
            console.error('Error creating region:', error);
        }
    };

    return (
        <DashboardTemplate
            regions={regions}
            onSearch={handleSearch}
            onAddRegion={handleAddRegion}
        />
    );
}