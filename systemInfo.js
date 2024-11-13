const os = require('os');

// Function to display system information
function displaySystemInfo() {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    console.log("Node.js Version:", process.version);
    console.log("CPU Information:");
    cpus.forEach((cpu, index) => {
        console.log(`  Core ${index + 1}:`, cpu.model, "- Speed:", cpu.speed, "MHz");
    });
    console.log("Total Memory (bytes):", totalMemory);
    console.log("Free Memory (bytes):", freeMemory);
}

// Function to find the 78,001st element in a sorted array (or a very large array)
function find78KthElement() {
    console.time("find78KthElement");

    const largeArray = Array.from({ length: 1000000 }, (_, i) => i * 2); // Large sorted array of even numbers
    const targetIndex = 78000;

    const element = largeArray[targetIndex];
    console.log(`The 78,001st element is: ${element}`);

    console.timeEnd("find78KthElement");
}

// Main execution
displaySystemInfo();
find78KthElement();
