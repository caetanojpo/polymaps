"use client"
import React from 'react';
import {DashboardTemplate} from '@/components/templates/DashboardTemplate';
import {useAuthStore} from "@/store/authStore";
import {useRegionStore} from '@/store/regionStore';
import {useRouter} from "next/navigation";

export default function Dashboard() {
    const {user, token, setUser, setToken} = useAuthStore();
    const {listOfRegions, listSearch, setSearch, addRegion} = useRegionStore();
    const router = useRouter();

    const handleSearch = async (type: 'contains' | 'near', coordinates: { latitude: number; longitude: number }) => {
        try {
            const latitude = coordinates.latitude;
            const longitude = coordinates.longitude;
            const url = type === 'contains' ? '/api/regions/listContaining' : '/api/regions/listNear';
            const ownerId = user?._id;

            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({latitude, longitude, token})
            });
            const data = await response.json();

            if (data.message === "Invalid token") {
                setUser(null);
                setToken(null);
                router.push('/');
            }
            console.log(data)
            setSearch(data.data.regions);
        } catch (error) {
            console.error('Error creating region:', error);
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, coordinates, ownerId, token})
            });
            const data = await response.json();

            if (data.message === "Invalid token") {
                setUser(null);
                setToken(null);
                router.push('/');
            }
            addRegion(data.data.mappedRegion);
        } catch (error) {
            console.error('Error creating region:', error);
        }
    };

    return (
        <DashboardTemplate
            regions={listOfRegions}
            search={listSearch}
            onSearch={handleSearch}
            onAddRegion={handleAddRegion}
        />
    );
}
