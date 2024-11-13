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
