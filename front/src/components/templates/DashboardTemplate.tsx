"use client"
import React, {useState} from 'react';
import {Navigation} from '@/components/molecules/Navigation/Navigation';
import {SearchForm} from '@/components/molecules/Forms/SearchForm';
import {AddRegionForm} from '@/components/molecules/Forms/AddForm';
import {Region} from '@/types';
import {AddRegionJsonForm} from "@/components/molecules/Forms/AddFormJson";
import {RegionList} from "@/components/molecules/List/RegionList";

interface DashboardTemplateProps {
    regions: Region[];
    search: Region[];
    onSearch: (type: 'contains' | 'near', coordinates: { latitude: number; longitude: number }) => Promise<void>;
    onAddRegion: (name: string, coordinates: { latitude: number; longitude: number }[]) => Promise<void>;
}

export function DashboardTemplate({
                                      regions,
                                      search,
                                      onSearch,
                                      onAddRegion,
                                  }: DashboardTemplateProps) {
    const [formType, setFormType] = useState<'standard' | 'json'>('standard');
    return (
        <div className="min-h-screen bg-gray-200">
            <Navigation/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex space-x-4">
                                <button
                                    className={`text-[1.2rem] px-4 py-2 rounded-md ${
                                        formType === 'standard'
                                            ? 'bg-subprimary-700 text-white'
                                            : 'bg-gray-100 text-gray-700 cursor-pointer'
                                    }`}
                                    onClick={() => setFormType('standard')}
                                >
                                    Standard Form
                                </button>
                                <button
                                    className={`text-[1.2rem] px-4 py-2 rounded-md ${
                                        formType === 'json'
                                            ? 'bg-subprimary-700 text-white'
                                            : 'bg-gray-100 text-gray-700 cursor-pointer'
                                    }`}
                                    onClick={() => setFormType('json')}
                                >
                                    JSON Format
                                </button>
                            </div>
                        </div>

                        {formType === 'standard' ? (
                            <AddRegionForm onSubmit={onAddRegion}/>
                        ) : (
                            <AddRegionJsonForm onSubmit={onAddRegion}/>
                        )}
                    </div>
                    <div>
                        <SearchForm
                            onSearch={onSearch}
                            search={search}
                        />
                    </div>
                </div>
                <RegionList regions={regions}/>
            </div>
        </div>
    );
}