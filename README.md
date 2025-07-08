# Megaverse Creator

## Description
Challenge solution built with React. It's to be used create dynamic grids of "Megaverse" objects, allowing the user to copy and paste the goal map provided by the API endpoint `[BASE-URL]/api/map/{candidateId}/goal`.

## Stack
- React
- Typescript

## Project structure
- `/`: root directory
- `/src`: React app source code
- `/src/lib`: React app source code
  - `/lib/components`: React components
  - `/lib/types`: Type definitions
  - `/lib/utils`: Utility functions


## App functionality
- Show the goal map provided by the API
- Clear current map if mistakes were previously made
- automatically create the goal pattern

Previously you could manually click a grid cell to create a Megaverse object, but now you can create the pattern by clicking the "Create Goal Pattern" button. Automated, simple, easy.

## How it works
The app uses the API endpoint `[BASE-URL]/api/map/{candidateId}/goal` to fetch the goal map. The goal map is a string representation of the grid, where each cell contains a Megaverse object type. For example, a cell with the value "POLYANET" represents a Polyanet, and a cell with the value "WHITE_SOLOON" represents a Soloon of color "white".

When sending a POST request ot the API to complete the goal pattern, the app will complete the requests in batches to avoid rate limiting and hitting CORS issues.

A loading state is shown while the app is processing the goal pattern, in the form of a progress bar.

## Setup

1. Create a `.env` file, add in candidate iD and the base URL for the API.

2. install dependencies

````bash 
npm install
````

3. run the app
````bash 
npm start
````

4. click one of the button to either pop up a modal with the goal map, populate the grid with the goal map state, or clear the grid.

