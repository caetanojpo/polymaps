import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card/Card';
import { Button } from '@/components/atoms/Buttons/Button';
import { AlertCircle } from 'lucide-react';
import Editor from "@monaco-editor/react";

interface AddRegionJsonFormProps {
    onSubmit: (name: string, coordinates: { latitude: number; longitude: number }[]) => Promise<void>;
}

const defaultJson = JSON.stringify({
    "name": "Sugarloaf Mountain",
    "coordinates": [
        [
            [-43.163300, -22.950000],
            [-43.162500, -22.948900],
            [-43.159800, -22.949200],
            [-43.163300, -22.950000],
        ]
    ]
}, null, 2);

export function AddRegionJsonForm({ onSubmit }: AddRegionJsonFormProps) {
    const [jsonValue, setJsonValue] = useState(defaultJson);
    const [error, setError] = useState<string | null>(null);

    const validateCoordinates = (coords: number[][]) => {
        if (!Array.isArray(coords) || coords.length !== 4) {
            throw new Error('Exactly 4 points required (3 unique + closing point)');
        }

        if (!coords.every(point => Array.isArray(point) && point.length === 2)) {
            throw new Error('Each point must be an array of [longitude, latitude]');
        }

        const uniquePoints = new Set(coords.slice(0, 3).map(p => p.join(',')));
        if (uniquePoints.size < 3) {
            throw new Error('First 3 points must be unique');
        }

        const [firstPoint, lastPoint] = [coords[0], coords[coords.length - 1]];
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
            throw new Error('Last point must match the first point to close the polygon');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = JSON.parse(jsonValue);
            console.log(data);

            if (!data.name?.trim?.()) {
                throw new Error('Name is required');
            }

            if (!Array.isArray(data.coordinates) || data.coordinates.length !== 1) {
                throw new Error('Coordinates must contain exactly one polygon array');
            }

            validateCoordinates(data.coordinates[0]);

            const formattedCoordinates = data.coordinates[0]
                .slice(0, 3)
                .map(([longitude, latitude]: number[]) => ({
                    latitude,
                    longitude
                }));

            const finalCoordinates = [...formattedCoordinates, formattedCoordinates[0]];

            await onSubmit(data.name, finalCoordinates);
            setJsonValue(defaultJson);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid JSON format');
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[1.6rem] font-semibold">Add Region (JSON Format)</h2>
                <Button
                    type="button"
                    variant="secondary"
                    className="!text-[1.2rem] !w-md"
                    onClick={() => setJsonValue(defaultJson)}
                >
                    Reset to Example
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                    <Editor
                        height="300px"
                        defaultLanguage="json"
                        value={jsonValue}
                        onChange={(value) => setJsonValue(value || '')}
                        options={{
                            minimap: { enabled: false },
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            formatOnPaste: true,
                            formatOnType: true,
                        }}
                    />
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                    <div className="text-[1.2rem] text-blue-700">
                        <strong>Format Requirements:</strong>
                        <ul className="list-disc ml-4 mt-2">
                            <li><code>name</code> must be a string</li>
                            <li><code>coordinates</code> must contain exactly one polygon array</li>
                            <li>Each polygon must have exactly 4 points (3 unique + closing point)</li>
                            <li>Points format: <code>[longitude, latitude]</code></li>
                            <li>Last point must match the first point</li>
                        </ul>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-[1.2rem]">{error}</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" variant="primary">
                        Create Region
                    </Button>
                </div>
            </form>
        </Card>
    );
}