"use client"
import React, {useState} from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import {Card} from "@/components/atoms/Card/Card";
import {Field} from "@/components/atoms/Fields/Field";
import {Button} from "@/components/atoms/Buttons/Button";

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface AddRegionFormProps {
    onSubmit: (name: string, coordinates: Coordinate[]) => Promise<void>;
}

export function AddRegionForm({onSubmit}: AddRegionFormProps) {
    const [name, setName] = useState('');
    const [coordinates, setCoordinates] = useState<Coordinate[]>([
        {latitude: 37.773972, longitude: -122.431297},
        {latitude: 37.773975, longitude: -122.431300},
        {latitude: 37.773980, longitude: -122.431305}
    ]);
    const [error, setError] = useState<string | null>(null);

    const handleAddCoordinate = () => {
        if (coordinates.length >= 3) {
            setError('Maximum 3 unique points allowed for the polygon');
            return;
        }
        setCoordinates([...coordinates, {latitude: 0, longitude: 0}]);
    };

    const handleRemoveCoordinate = (index: number) => {
        if (coordinates.length <= 3) {
            setError('Minimum 3 points required for a polygon');
            return;
        }
        setCoordinates(coordinates.filter((_, i) => i !== index));
    };

    const handleCoordinateChange = (index: number, field: 'latitude' | 'longitude', value: number) => {
        const newCoordinates = [...coordinates];
        newCoordinates[index] = {...newCoordinates[index], [field]: value};
        setCoordinates(newCoordinates);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (!name.trim()) {
                throw new Error('Name is required');
            }

            if (coordinates.length !== 3) {
                throw new Error('Exactly 3 unique points are required to form a polygon');
            }

            const finalCoordinates = [...coordinates, coordinates[0]];
            await onSubmit(name, finalCoordinates);

            setName('');
            setCoordinates([
                {latitude: 37.773972, longitude: -122.431297},
                {latitude: 37.773975, longitude: -122.431300},
                {latitude: 37.773980, longitude: -122.431305}
            ]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <Card>
            <h2 className="text-[1.6rem] font-semibold mb-4">Add New Region</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Field
                    label="Region Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter region name"
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[1.2rem] font-medium text-gray-700">Coordinates (3 points required)</h3>
                        {coordinates.length < 3 && (
                            <Button
                                type="button"
                                variant="secondary"
                                icon={Plus}
                                onClick={handleAddCoordinate}
                            >
                                Add Point
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {coordinates.map((coord, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-grow grid grid-cols-2 gap-3">
                                    <Field
                                        label="Latitude"
                                        type="number"
                                        step="any"
                                        value={coord.latitude}
                                        onChange={(e) => handleCoordinateChange(index, 'latitude', parseFloat(e.target.value))}
                                    />
                                    <Field
                                        label="Longitude"
                                        type="number"
                                        step="any"
                                        value={coord.longitude}
                                        onChange={(e) => handleCoordinateChange(index, 'longitude', parseFloat(e.target.value))}
                                    />
                                </div>
                                {coordinates.length > 3 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCoordinate(index)}
                                        className="mt-8 p-1 text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-[1.2rem] text-blue-700">
                            <strong>Note:</strong> The polygon will be automatically closed by connecting the last point to the first point.
                            You only need to specify 3 unique points.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-[1.2rem]">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setName('');
                            setCoordinates([
                                { latitude: 37.773972, longitude: -122.431297 },
                                { latitude: 37.773975, longitude: -122.431300 },
                                { latitude: 37.773980, longitude: -122.431305 }
                            ]);
                            setError(null);
                        }}
                    >
                        Reset
                    </Button>
                    <Button type="submit" variant="primary">
                        Create Region
                    </Button>
                </div>
            </form>
        </Card>
    );
}