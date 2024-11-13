// const { Worker, isMainThread, parentPort } = require('worker_threads');
// const os = require('os');

// const TARGET_INDEX = 78000; // Target index for the 78,001st element (0-based)

// /**
//  * Finds the k-th smallest element in an array using Quickselect.
//  * @param {number[]} arr - The array to search within.
//  * @param {number} k - The index of the desired element.
//  * @returns {number} The k-th smallest element.
//  */
// function quickSelect(arr, k) {
//     if (arr.length <= 1) return arr[0];
    
//     const pivot = arr[Math.floor(arr.length / 2)];

//     const lows = arr.filter(x => x < pivot);
//     const highs = arr.filter(x => x > pivot);
//     const pivots = arr.filter(x => x === pivot);

//     if (k < lows.length) return quickSelect(lows, k);
//     else if (k < lows.length + pivots.length) return pivots[0];
//     else return quickSelect(highs, k - lows.length - pivots.length);
// }

// /**
//  * Selects a pivot element using a modified median-of-three logic.
//  * @param {number[]} left - The left half of the array.
//  * @param {number[]} right - The right half of the array.
//  * @returns {number} The pivot element.
//  */
// function selectPivot(left, right) {
//     // Base case for small arrays
//     if (left.length <= 1 && right.length <= 1) {
//         return Math.min(left[0] || Infinity, right[0] || Infinity);
//     }

//     const midLeft = Math.floor(left.length / 2);
//     const midRight = Math.floor(right.length / 2);
//     const leftMid = left[midLeft];
//     const rightMid = right[midRight];

//     if (leftMid < rightMid) return selectPivot(left.slice(0, midLeft), right);
//     else if (leftMid > rightMid) return selectPivot(left, right.slice(midRight));
//     else return leftMid;
// }

// // Worker logic for processing data chunk
// if (!isMainThread) {
//     parentPort.on('message', ({ dataChunk, k }) => {
//         const result = quickSelect(dataChunk, k);
//         parentPort.postMessage(result);
//     });
// }

// // Worker pool class to manage parallel processing
// class WorkerPool {
//     constructor(maxWorkers) {
//         this.workers = [];
//         this.maxWorkers = maxWorkers;
//     }

//     async addWorker() {
//         return new Promise((resolve) => {
//             const worker = new Worker(__filename);
//             this.workers.push(worker);
//             resolve(worker);
//         });
//     }

//     async removeWorker(worker) {
//         const index = this.workers.indexOf(worker);
//         if (index !== -1) {
//             this.workers.splice(index, 1);
//         }
//     }

//     async processChunk(dataChunk, k) {
//         return new Promise(async (resolve) => {
//             const worker = await this.addWorker();
//             worker.postMessage({ dataChunk, k });
//             worker.on('message', resolve);
//             worker.on('error', (err) => console.error('Worker error:', err));
//             worker.on('exit', (code) => {
//                 if (code !== 0) console.error(`Worker exited with code ${code}`);
//                 this.removeWorker(worker);
//             });
//         });
//     }
// }

// /**
//  * Finds the 78,001st element in a large dataset using parallel processing and Quickselect.
//  * @param {number[]} dataset - The dataset array.
//  * @returns {Promise<number>} The 78,001st element.
//  */
// async function find78KthElement(dataset) {
//     const cpuCount = os.cpus().length;
//     const chunkSize = Math.ceil(dataset.length / cpuCount);
//     const promises = [];

//     const workerPool = new WorkerPool(cpuCount);

//     for (let i = 0; i < dataset.length; i += chunkSize) {
//         const dataChunk = dataset.slice(i, Math.min(i + chunkSize, dataset.length));
//         promises.push(workerPool.processChunk(dataChunk, TARGET_INDEX));
//     }

//     const partialResults = await Promise.all(promises);
//     return quickSelect(partialResults, TARGET_INDEX % partialResults.length);
// }

// // Benchmarking and execution
// if (isMainThread) {
//     console.log('Node.js Version:', process.version);
//     console.log('CPU Information:', os.cpus());
//     console.log('Total Memory (bytes):', os.totalmem());
//     console.log('Free Memory (bytes):', os.freemem());
// }

// (async () => {
//     const dataset = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 1e6));
//     console.time('find78KthElement');
//     const result = await find78KthElement(dataset);
//     console.timeEnd('find78KthElement');
//     console.log('The 78,001st element is:', result);
// })();

// const { Worker, isMainThread, parentPort } = require('worker_threads');
// const os = require('os');

// const TARGET_INDEX = 78000; // Target index for the 78,001st element (0-based)

// function quickSelect(arr, k) {
//     if (arr.length <= 1) return arr[0];
    
//     const pivot = arr[Math.floor(arr.length / 2)];

//     const lows = arr.filter(x => x < pivot);
//     const highs = arr.filter(x => x > pivot);
//     const pivots = arr.filter(x => x === pivot);

//     if (k < lows.length) return quickSelect(lows, k);
//     else if (k < lows.length + pivots.length) return pivots[0];
//     else return quickSelect(highs, k - lows.length - pivots.length);
// }

// // Worker logic for processing data chunk
// if (!isMainThread) {
//     parentPort.on('message', ({ dataChunk, k }) => {
//         try {
//             const result = quickSelect(dataChunk, k);
//             parentPort.postMessage(result);
//         } catch (error) {
//             console.error('Error in worker:', error);
//         }
//     });
// }

// // Worker pool class to manage parallel processing
// class WorkerPool {
//     constructor(maxWorkers) {
//         this.workers = [];
//         this.maxWorkers = maxWorkers;
//     }

//     async addWorker() {
//         return new Promise((resolve) => {
//             const worker = new Worker(__filename);
//             this.workers.push(worker);
//             resolve(worker);
//         });
//     }

//     async removeWorker(worker) {
//         const index = this.workers.indexOf(worker);
//         if (index !== -1) {
//             this.workers.splice(index, 1);
//         }
//     }

//     async processChunk(dataChunk, k) {
//         return new Promise(async (resolve) => {
//             const worker = await this.addWorker();
//             worker.postMessage({ dataChunk, k });
//             worker.on('message', resolve);
//             worker.on('error', (err) => console.error('Worker error:', err));
//             worker.on('exit', (code) => {
//                 if (code !== 0) console.error(`Worker exited with code ${code}`);
//                 this.removeWorker(worker);
//             });
//         });
//     }
// }

// // Finds the k-th element after processing all data chunks with parallelism
// async function find78KthElement(dataset) {
//     const cpuCount = os.cpus().length;
//     const chunkSize = Math.ceil(dataset.length / cpuCount);
//     const promises = [];

//     const workerPool = new WorkerPool(cpuCount);

//     // Process each chunk in parallel
//     for (let i = 0; i < dataset.length; i += chunkSize) {
//         const dataChunk = dataset.slice(i, Math.min(i + chunkSize, dataset.length));
//         promises.push(workerPool.processChunk(dataChunk, TARGET_INDEX));
//     }

//     // Wait for all workers to finish and gather partial results
//     const partialResults = await Promise.all(promises);
//     const allResults = [].concat(...partialResults); // Merge all results from workers

//     // Ensure merged results have been collected
//     if (allResults.length === 0) {
//         console.error('No results from workers');
//         return undefined;
//     }

//     // Use Quickselect on the merged data to find the final result
//     return quickSelect(allResults, TARGET_INDEX);
// }

// // Benchmarking and execution
// if (isMainThread) {
//     console.log('Node.js Version:', process.version);
//     console.log('CPU Information:', os.cpus());
//     console.log('Total Memory (bytes):', os.totalmem());
//     console.log('Free Memory (bytes):', os.freemem());
// }

// (async () => {
//     const dataset = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 1e6));
//     console.time('find78KthElement');
//     const result = await find78KthElement(dataset);
//     console.timeEnd('find78KthElement');
//     console.log('The 78,001st element is:', result);
// })();

const { Worker, isMainThread, parentPort } = require('worker_threads');
const os = require('os');

const TARGET_INDEX = 78000; // The 78,001st element (0-indexed)

// Quickselect algorithm to find the k-th element in an unsorted array
function quickSelect(arr, k) {
    if (arr.length <= 1) return arr[0];

    let pivot = arr[0];
    let left = [];
    let right = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) left.push(arr[i]);
        else right.push(arr[i]);
    }

    const pivotIndex = left.length;

    if (k === pivotIndex) return pivot;
    else if (k < pivotIndex) return quickSelect(left, k);
    else return quickSelect(right, k - pivotIndex - 1);
}

// Worker logic for processing a chunk
if (!isMainThread) {
    parentPort.on('message', ({ dataChunk, k, workerId }) => {
        console.log(`Worker ${workerId} processing chunk of size:`, dataChunk.length);
        try {
            const result = quickSelect(dataChunk, k);
            console.log(`Worker ${workerId} found the result:`, result);
            parentPort.postMessage({ result, workerId }); // Send result back to main thread
        } catch (error) {
            console.error(`Worker ${workerId} error:`, error);
            parentPort.postMessage({ result: null, workerId });
        }
    });
}

// Worker pool class to manage parallel processing
class WorkerPool {
    constructor(maxWorkers) {
        this.maxWorkers = maxWorkers;
        this.workers = [];
        this.finished = false; // Flag to prevent further processing after one worker finds the element
    }

    // Adds a new worker to the pool
    async addWorker() {
        return new Worker(__filename);
    }

    // Processes a chunk using a worker and waits for the result
    async processChunk(dataChunk, k, workerId) {
        const worker = await this.addWorker();
        return new Promise((resolve, reject) => {
            worker.postMessage({ dataChunk, k, workerId });
            worker.on('message', (result) => {
                if (this.finished) {
                    worker.terminate();
                    resolve(null);
                } else {
                    if (result.result !== null) {
                        this.finished = true;
                        worker.terminate();
                        resolve(result.result);
                    } else {
                        worker.terminate();
                        resolve(null);
                    }
                }
            });
            worker.on('error', (err) => {
                worker.terminate();
                console.error('Error with worker:', err);
                reject(err);
            });
        });
    }
}

// Finds the k-th element using parallel workers
async function find78KthElement(dataset) {
    const cpuCount = os.cpus().length; // Get the number of CPU cores available
    const chunkSize = Math.floor(dataset.length / cpuCount); // Divide dataset into chunks
    const workerPool = new WorkerPool(cpuCount);
    const promises = [];

    // Process each chunk in parallel using workers
    for (let i = 0; i < cpuCount; i++) {
        const startIdx = i * chunkSize;
        const endIdx = (i === cpuCount - 1) ? dataset.length : (i + 1) * chunkSize;
        const dataChunk = dataset.slice(startIdx, endIdx);
        console.log(`Sending chunk ${i} with range [${startIdx}, ${endIdx}]`);
        promises.push(workerPool.processChunk(dataChunk, TARGET_INDEX, i));
    }

    // Wait for the first worker to return the result
    const result = await Promise.race(promises);
    if (result !== null) {
        console.log(`The 78,001st element is: ${result}`);
    } else {
        console.log("Error: Could not find the 78,001st element.");
    }
}

// Main execution
(async () => {
    const dataset = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 1e6)); // Sample dataset

    console.time('find78KthElement');
    await find78KthElement(dataset);
    console.timeEnd('find78KthElement');
})();
