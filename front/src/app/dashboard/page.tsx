"use client"
import React from 'react';
import {DashboardTemplate} from '@/components/templates/DashboardTemplate';
import {useAuthStore} from "@/store/authStore";
import {useRegionStore} from '@/store/regionStore';
import {useRouter} from "next/navigation";
import {SearchParams} from "@/types/searchParams";

export default function Dashboard() {
    const {user, token, setUser, setToken} = useAuthStore();
    const {listOfRegions, listSearch, setSearch, addRegion} = useRegionStore();
    const router = useRouter();

    const handleSearch = async (params: SearchParams) => {
        try {
            const baseBody = {
                latitude: params.coordinates.latitude,
                longitude: params.coordinates.longitude,
                token,
            };

            let url: string;
            let body: unknown = baseBody;

            if (params.type === 'near') {
                url = '/api/regions/listNear';
                body = {
                    ...baseBody,
                    maxDistance: params.options.maxDistance,
                    ownerId: params.options.fromOwner ? user?._id : undefined
                };
            } else {
                url = '/api/regions/listContaining';
            }
            console.log(body);
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.message === "Invalid token") {
                setUser(null);
                setToken(null);
                router.push('/');
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Search failed');
            }

            setSearch(data.data.regions);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleAddRegion = async (name: string, coords: { latitude: number; longitude: number }[]) => {
        try {
            const coordinates = [
                [...coords.map(coord => [coord.latitude, coord.longitude])]
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
