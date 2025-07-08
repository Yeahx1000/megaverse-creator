import React, { 
  useState, 
  useEffect 
} from 'react';
import './App.css';
import { 
  deletePolyanet,
  deleteSoloon,
  deleteCometh,
  fetchGoalMap,
  fetchCurrentMap,
  deleteAstralObject,
  createEmptyMap,
  processOperationsInBatches,
  getGoalObject,
  getCurrentValue,
  updateCurrentMap,
  getGridDimensions,
} from './lib/utils';
import { 
  MegaverseMap, 
  AstralObject, 
  MegaverseObject 
} from './lib/types';
import Modal from './lib/components/Modal';
import Grid from './lib/components/Grid';
import GridLegend from './lib/components/GridLegend';
import ProgressBar from './lib/components/ProgressBar';
import GridControls from './lib/components/GridControls';

/* 
- NOTE: this is a more frontend heavy solution, 
using a proxy server could help but this is what I ended up with for now
*/

// TODO: optimize for speed
// TODO: add tests
// TODO: add more error handling
// TODO: show current map in modal
function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [goalMap, setGoalMap] = useState<any>(null);
  const [currentMap, setCurrentMap] = useState<MegaverseMap | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  // dynamically generate grid size based on goal data
  useEffect(() => {
    const initializeGrid = async () => {
      try {
        const goalData = await fetchGoalMap();
        setGoalMap(goalData);
        
        if (goalData?.goal) {
          const { rows, cols } = getGridDimensions(goalData);
          
          setCurrentMap(createEmptyMap(rows, cols));
          
          setMessage(`Grid initialized: ${rows}x${cols}`);
        } else {
          console.error('No goal data found in response');
          setMessage('No goal data found in API response');
          setCurrentMap(null);
        }
      } catch (error) {
        console.error('Error initializing grid:', error);
        setMessage(`Error loading grid data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setCurrentMap(null);
      }
    };

    initializeGrid();
  }, []);

  // Wrapper functions for grid utilities
  const getGoalObjectWrapper = (row: number, col: number) => getGoalObject(goalMap, row, col);
  const getCurrentValueWrapper = (row: number, col: number) => getCurrentValue(currentMap, row, col);
  const updateCurrentMapWrapper = (row: number, col: number, value: AstralObject | null) => {
    const newMap = updateCurrentMap(currentMap, row, col, value);
    if (newMap) setCurrentMap(newMap);
  };

  const createGoalPattern = async () => {
    if (!goalMap?.goal) {
      setMessage('No goal map available.');
      return;
    }

    setLoading(true);
    setIsPaused(false);
    setProgress({ completed: 0, total: 0 });
    setMessage('Preparing goal pattern operations...');
    
    try {
      const operations: { row: number; column: number; object: MegaverseObject }[] = [];
      for (let row = 0; row < goalMap.goal.length; row++) {
        for (let col = 0; col < goalMap.goal[row].length; col++) {
          const goalObj = getGoalObjectWrapper(row, col);
          if (goalObj) {
            operations.push({ row, column: col, object: goalObj });
          }
        }
      }

      setProgress({ completed: 0, total: operations.length });
      setMessage(`Starting to create ${operations.length} objects...`);
      
      // Process operations in batches with progress updates
      await processOperationsInBatches(
        operations,
        (completed, total) => {
          if (!isPaused) {
            setProgress({ completed, total });
            setMessage(`Progress: ${completed}/${total} objects created`);
            // Update the map as we go
            const operation = operations[completed - 1];
            if (operation) {
              updateCurrentMapWrapper(operation.row, operation.column, operation.object.type);
            }
          }
        }
      );

      setMessage('Goal pattern created successfully!');
    } catch (error) {
      setMessage(`Error creating goal pattern: ${error}`);
    } finally {
      setLoading(false);
      setIsPaused(false);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    setMessage(isPaused ? 'Resuming...' : 'Paused');
  };

  const clearGrid = async () => {
    setLoading(true);
    setMessage('Fetching current map state...');
    
    try {
      const currentMapData = await fetchCurrentMap();
      const mapContent = currentMapData.map.content;
      const objectsToDelete = [];

      // check current map, collect positions where objects exist (usingtype: 0)
      for (let row = 0; row < mapContent.length; row++) {
        for (let col = 0; col < mapContent[row].length; col++) {
          if (mapContent[row][col]?.type === 0) {
            objectsToDelete.push({ row, col });
          }
        }
      }

      // delete in batches of 10, avoid rate limiting
      const batchSize = 10;
      const totalObjects = objectsToDelete.length;
      let deletedCount = 0;

      setMessage(`Found ${totalObjects} objects to delete`);

      for (let i = 0; i < objectsToDelete.length; i += batchSize) {
        const batch = objectsToDelete.slice(i, i + batchSize);
        
        // Try to delete as POLYanet first
        await Promise.all(batch.map(obj => 
          deletePolyanet(obj.row, obj.col)
            .catch(() => {
              // then SOLoon
              return deleteSoloon(obj.row, obj.col)
                .catch(() => {
                  // then comETH
                  return deleteCometh(obj.row, obj.col)
                    .catch(() => {/* Ignore if all attempts fail */});
                });
            })
        ));
        
        deletedCount += batch.length;
        setMessage(`Deleting objects... ${deletedCount}/${totalObjects}`);

        // trying to avoid rate limiting, delay between batches
        if (i + batchSize < objectsToDelete.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Reset local state
      const newMap: MegaverseMap = {
        map: Array(mapContent.length).fill(null).map(() => 
          Array(mapContent[0].length).fill('SPACE' as AstralObject)
        ),
        objects: []
      };
      setCurrentMap(newMap);
      
      setMessage(`Cleared ${deletedCount} objects from the grid.`);
    } catch (error) {
      setMessage(`Error clearing grid: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (row: number, col: number, currentValue: AstralObject) => {
    if (currentValue !== 'SPACE') {
      deleteAstralObject(row, col, currentValue)
        .then(() => {
          updateCurrentMapWrapper(row, col, 'SPACE');
          setMessage(`Deleted ${currentValue} at (${row}, ${col})`);
        })
        .catch(error => {
          setMessage(`Error deleting ${currentValue}: ${error}`);
        });
    }
  };

  const { rows, cols } = getGridDimensions(goalMap);

  return (
    <div className="App">
      <h1>🪐 Megaverse Creator</h1>
      
      <GridControls
        loading={loading}
        goalMap={goalMap}
        isPaused={isPaused}
        onCreateGoalPattern={createGoalPattern}
        onClearGrid={clearGrid}
        onTogglePause={togglePause}
        onShowGoalMap={() => setShowGoalModal(true)}
      />

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <ProgressBar completed={progress.completed} total={progress.total} />

      {rows > 0 && cols > 0 ? (
        <div className="grid-container">
          {/* <h3>Interactive Grid ({rows}x{cols})</h3> */}
          <GridLegend />
          <Grid
            rows={rows}
            cols={cols}
            goalMap={goalMap}
            currentMap={currentMap}
            getGoalObject={getGoalObjectWrapper}
            getCurrentValue={getCurrentValueWrapper}
            onCellClick={handleCellClick}
          />
        </div>
      ) : (
        <div className="loading-container">
          <p>Loading grid data...</p>
        </div>
      )}

      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)}>
        <h2>Goal Map</h2>
        {rows > 0 && cols > 0 && (
          <Grid
            rows={rows}
            cols={cols}
            goalMap={goalMap}
            currentMap={currentMap}
            getGoalObject={getGoalObjectWrapper}
            getCurrentValue={getCurrentValueWrapper}
            isGoal={true}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;

