/*
 * Helpers for Upsilon.js
*/

import NumWorks from "upsilon.js";

let initialized = false;
let queue : any = {};

/*
 * Initialize a new calculator with queueing
*/
function newCalculator() {
    // If the calculator is already initialized, raise an error
    if (initialized) {
        throw new Error('Calculator already initialized');
    }

    // Set the initialized flag to true
    initialized = true;

    // Create a new calculator
    const calculator = new NumWorks();

    // Event bus to emit events
    const eventBus = new EventTarget();

    // Dictionary to pass to the proxy (stored in the store)
    const asyncQueue = {
        // The calculator instance
        calculator,
        // The event bus
        eventBus,
        // The id of the running function (if no function is running, it is the last function that ran + 1)
        runningFunctionId: 0,
        // The next function id
        nextFunctionId: 0,
    };

    queue = asyncQueue;

    // Create a new proxy to make lazy loading transparent
    return new Proxy(calculator, {
        // Get the value of a property
        get: (target, prop) => {
            // const { asyncQueue } = useCalculatorStore();
            const asyncQueue = queue;
            // If the property is not a function, return it
            if (typeof target[prop] !== 'function') {
                return target[prop];
            }

            // If the property is a function, return a function that queues the function call
            return async (...args : any[]) => {
                // Get the next function id
                const functionId = asyncQueue.nextFunctionId;

                // Increment the next function id
                asyncQueue.nextFunctionId += 1;

                // Wait for the function to be able to run
                while (asyncQueue.runningFunctionId !== functionId) {
                    // Wait for the event bus to emit a "functionFinished" event
                    await new Promise<void>((resolve) => {
                        // Add an event listener for the "functionFinished" event
                        asyncQueue.eventBus.addEventListener('functionFinished', () => {
                            // Resolve the promise
                            resolve();
                        });
                    });
                }

                // Call the function
                let error, result;
                try {
                    result = await target[prop](...args);
                } catch (e) {
                    error = e;
                }

                // Increment the running function id
                asyncQueue.runningFunctionId += 1;

                // Emit a "functionFinished" event
                asyncQueue.eventBus.dispatchEvent(new Event('functionFinished'));

                if (error) {
                    throw error;
                }

                // Return the result
                return result;
            };
        },
        set(target, p, newValue, receiver) {
            return Reflect.set(target, p, newValue, receiver);
        },
    });
}

export { newCalculator }
