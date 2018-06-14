var iterations = 50;
var multiplier = 1000000000;

function calculatePrimes(iterations, multiplier) {
    var primes = [];
    for (var i = 0; i < iterations; i++) {
        var candidate = i * (multiplier * Math.random());
        var isPrime = true;
        for (var c = 2; c <= Math.sqrt(candidate); ++c) {
            if (candidate % c === 0) {
                // not prime
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(candidate);
        }
    }
    return primes;
}

function MethodTimerTest() {
    var t = performance.now();
    try {

        var primes = calculatePrimes(iterations, multiplier);
        console.log(primes);
    }
    finally {
        AiFormLogger.writeMethodTime("TestMethod", t, performance.now());
    }
}