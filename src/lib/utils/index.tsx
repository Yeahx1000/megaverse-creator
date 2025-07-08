import { 
    AstralObject, 
    MegaverseMap,
    Direction, 
    SoloonColor, 
    MegaverseObject, 
    AstralObjectOperation 
} from '../types';

// better to keep these in .env, but for now this is fine
const candidateId = process.env.REACT_APP_CANDIDATE_ID || '7abc33b8-3155-4684-9645-90406ac44173';
const baseUrl = process.env.REACT_APP_BASE_URL || 'http://challenge.crossmint.com/api';

// Kept running into CORS issues, so I added some delay and retry logic
// Kept hitting CORS issues, so I added some delay and retry logic
const BATCH_SIZE = 5;
const MAX_RETRIES = 5; 
const RETRY_DELAY = 2000; // between retries
const BATCH_DELAY = 5000; // between batches
const INITIAL_DELAY = 1000; // Initial delay before starting

// creating empty map with given dimensions
export const createEmptyMap = (rows: number, cols: number): MegaverseMap => {
    return {
        map: Array(rows).fill(null).map(() => Array(cols).fill(null)),
        objects: []
    };
};

// Helper func to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry failed requests, trying to avoid CORS issues
const retryRequest = async (operation: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
    try {
        return await operation();
    } catch (error) {
        if (retries > 0) {
            const isCorsError = error instanceof TypeError && error.message.includes('CORS');
            const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
            
            if (isCorsError || isNetworkError) {
                console.log(`CORS/Network error detected, waiting longer before retry... (${retries} attempts left)`);
                await delay(RETRY_DELAY * 2); // Double delay for CORS errors
            } else {
                console.log(`Request failed, retrying... (${retries} attempts left)`);
                await delay(RETRY_DELAY);
            }
            return retryRequest(operation, retries - 1);
        }
        throw error;
    }
};

const createPolyanet = async (row: number, column: number): Promise<void> => {
    await retryRequest(async () => {
        const response = await fetch(`${baseUrl}/polyanets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateId,
                row,
                column,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create Polyanet: ${response.status} - ${errorText}`);
        }
    });
};

const createSoloon = async (row: number, column: number, color: SoloonColor): Promise<void> => {
    await retryRequest(async () => {
        const response = await fetch(`${baseUrl}/soloons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateId,
                row,
                column,
                color,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create Soloon: ${response.status} - ${errorText}`);
        }
    });
};

const createCometh = async (row: number, column: number, direction: Direction): Promise<void> => {
    await retryRequest(async () => {
        const response = await fetch(`${baseUrl}/comeths`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateId,
                row,
                column,
                direction,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create Cometh: ${response.status} - ${errorText}`);
        }
    });
};

const deletePolyanet = async (row: number, column: number): Promise<void> => {
    await retryRequest(async () => {
        const response = await fetch(`${baseUrl}/polyanets`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateId,
                row,
                column,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete Polyanet: ${response.status}`);
        }
    });
};

const deleteSoloon = async (row: number, column: number): Promise<void> => {
    await retryRequest(async () => {
        const response = await fetch(`${baseUrl}/soloons`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateId,
                row,
                column,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete Soloon: ${response.status}`);
        }
    });
};

const deleteCometh = async (row: number, column: number): Promise<void> => {
    await retryRequest(async () => {
        const response = await fetch(`${baseUrl}/comeths`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                candidateId,
                row,
                column,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete Cometh: ${response.status}`);
        }
    });
};

const processBatch = async (operations: AstralObjectOperation[]): Promise<void> => {
    // Process operations one after another in a batch to avoid overwhelming the server
    for (const { row, column, object } of operations) {
        switch (object.type) {
            case 'POLYANET':
                await createPolyanet(row, column);
                break;
            case 'SOLOON':
                await createSoloon(row, column, object.color);
                break;
            case 'COMETH':
                await createCometh(row, column, object.direction);
                break;
        }
        // Small delay between individual operations
        await delay(500);
    }
};

// more batching logic
const processOperationsInBatches = async (
    operations: AstralObjectOperation[],
    onProgress?: (completed: number, total: number) => void
): Promise<void> => {
    const total = operations.length;
    let completed = 0;

    // Initial delay before starting, trying to avoid rate limiting
    await delay(INITIAL_DELAY);

    for (let i = 0; i < operations.length; i += BATCH_SIZE) {
        const batch = operations.slice(i, i + BATCH_SIZE);
        await processBatch(batch);
        completed += batch.length;
        onProgress?.(completed, total);
        
        if (i + BATCH_SIZE < operations.length) {
            await delay(BATCH_DELAY);
        }
    }
};

const createAstralObject = async (row: number, column: number, object: MegaverseObject): Promise<void> => {
    if ('type' in object) {
        switch (object.type) {
            case 'POLYANET':
                return createPolyanet(row, column);
            case 'SOLOON':
                if (!object.color) throw new Error('Color is required for Soloons');
                return createSoloon(row, column, object.color);
            case 'COMETH':
                if (!object.direction) throw new Error('Direction is required for Comeths');
                return createCometh(row, column, object.direction);
        }
    }
    throw new Error('Invalid astral object');
};

const deleteAstralObject = async (row: number, column: number, type: AstralObject): Promise<void> => {
    switch (type) {
        case 'POLYANET':
            return deletePolyanet(row, column);
        case 'SOLOON':
            return deleteSoloon(row, column);
        case 'COMETH':
            return deleteCometh(row, column);
        case 'SPACE':
            return; 
    }
};

const fetchGoalMap = async (): Promise<any> => {
    return retryRequest(async () => {
        const url = `${baseUrl}/map/${candidateId}/goal`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch goal map: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    });
};

const fetchCurrentMap = async (): Promise<any> => {
    return retryRequest(async () => {
        const url = `${baseUrl}/map/${candidateId}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch current map: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    });
};

export { 
    createPolyanet,
    createSoloon,
    createCometh,
    deletePolyanet,
    deleteSoloon,
    deleteCometh,
    fetchGoalMap,
    fetchCurrentMap,
    createAstralObject,
    deleteAstralObject,
    processOperationsInBatches,
};

export * from './gridUtils';