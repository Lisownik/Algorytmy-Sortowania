let array = [];
let speed = 500;
let isSorting = false;

const arrayContainer = document.getElementById('arrayContainer');
const speedInput = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
speed = 1001 - speedInput.value;

speedInput.addEventListener('input', () => {
    speed = 1001 - speedInput.value;
});

algorithmSelect.addEventListener('change', () => { generateArray() })
resetButton.addEventListener('click', generateArray);
startButton.addEventListener('click', async () => {
    const algorithm = algorithmSelect.value;
    isSorting = true;

    switch (algorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'mergeSort':
            await mergeSort(0, array.length - 1);
            break;
        case 'heapSort':
            await heapSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'selectionSort':
            await selectionSort();
            break;
        case 'quickSort':
            await quickSort();
            break;
        case 'radixSort':
            await radixLSDSort();
            break;
    }

    await highlightSorted();
    isSorting = false;
});

function generateArray() {
    if (isSorting) {
        alert("Sorting in progress, please wait before resetting.");
        return;
    }

    array = [];
    arrayContainer.innerHTML = '';
    all = []
    for (i = 5; i < 56; i++)
        all.push(i)
    for (let i = 0; i < 50; i++) {
        const value = all[Math.floor(Math.random() * all.length)];
        all.splice(all.indexOf(value), 1);
        array.push(value);

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;

        const barValue = document.createElement('span');
        barValue.innerText = value;

        bar.appendChild(barValue);
        arrayContainer.appendChild(bar);
    }
}

async function swap(bar1, bar2) {
    const tempHeight = bar1.style.height;
    const tempValue = bar1.querySelector('span').innerText;

    bar1.style.height = bar2.style.height;
    bar1.querySelector('span').innerText = bar2.querySelector('span').innerText;

    bar2.style.height = tempHeight;
    bar2.querySelector('span').innerText = tempValue;

    await sleep(speed);
}

async function highlightComparison(bar1, bar2) {
    bar1.classList.add('compare');
    bar2.classList.add('compare');
    await sleep(speed);
    bar1.classList.remove('compare');
    bar2.classList.remove('compare');
}

async function highlightSwap(bar1, bar2) {
    bar1.classList.add('swap');
    bar2.classList.add('swap');
    await sleep(speed);
    bar1.classList.remove('swap');
    bar2.classList.remove('swap');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function highlightSorted() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = 'green';
        await sleep(25);
    }
}

async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await highlightComparison(bars[j], bars[j + 1]);
            if (parseInt(bars[j].innerText) > parseInt(bars[j + 1].innerText)) {
                await highlightSwap(bars[j], bars[j + 1]);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                await swap(bars[j], bars[j + 1]);
            }
        }
    }
}

async function mergeSort(left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    const bars = document.querySelectorAll('.bar');
    const n1 = mid - left + 1;
    const n2 = right - mid;

    let leftArray = [];
    let rightArray = [];

    for (let i = 0; i < n1; i++) {
        leftArray[i] = parseInt(bars[left + i].innerText);
    }
    for (let j = 0; j < n2; j++) {
        rightArray[j] = parseInt(bars[mid + 1 + j].innerText);
    }

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        await highlightComparison(bars[left + i], bars[mid + 1 + j]);
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            bars[k].style.height = `${leftArray[i] * 3}px`;
            bars[k].querySelector('span').innerText = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            bars[k].style.height = `${rightArray[j] * 3}px`;
            bars[k].querySelector('span').innerText = rightArray[j];
            j++;
        }
        await highlightSwap(bars[k], bars[k]);
        await sleep(speed);
        k++;
    }

    while (i < n1) {
        array[k] = leftArray[i];
        bars[k].style.height = `${leftArray[i] * 3}px`;
        bars[k].querySelector('span').innerText = leftArray[i];
        await highlightSwap(bars[k], bars[k]);
        i++;
        k++;
    }

    while (j < n2) {
        array[k] = rightArray[j];
        bars[k].style.height = `${rightArray[j] * 3}px`;
        bars[k].querySelector('span').innerText = rightArray[j];
        await highlightSwap(bars[k], bars[k]);
        j++;
        k++;
    }
}

async function heapSort() {
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    const bars = document.querySelectorAll('.bar');

    for (let i = n - 1; i > 0; i--) {
        await highlightSwap(bars[0], bars[i]);
        swapBars(0, i);
        array[i] = parseInt(bars[i].querySelector('span').innerText);

        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    const bars = document.querySelectorAll('.bar');
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && parseInt(bars[left].querySelector('span').innerText) > parseInt(bars[largest].querySelector('span').innerText)) {
        largest = left;
    }

    if (right < n && parseInt(bars[right].querySelector('span').innerText) > parseInt(bars[largest].querySelector('span').innerText)) {
        largest = right;
    }

    if (largest !== i) {
        await highlightComparison(bars[i], bars[largest]);
        swapBars(i, largest);
        array[i] = parseInt(bars[i].querySelector('span').innerText);

        await heapify(n, largest);
    }
}

function swapBars(index1, index2) {
    const bars = document.querySelectorAll('.bar');

    const height1 = bars[index1].style.height;
    const value1 = bars[index1].querySelector('span').innerText;

    const height2 = bars[index2].style.height;
    const value2 = bars[index2].querySelector('span').innerText;

    bars[index1].style.height = height2;
    bars[index1].querySelector('span').innerText = value2;

    bars[index2].style.height = height1;
    bars[index2].querySelector('span').innerText = value1;
}

async function insertionSort() {
    const bars = document.querySelectorAll('.bar');
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = parseInt(bars[i].innerText);
        let j = i - 1;

        while (j >= 0 && parseInt(bars[j].innerText) > key) {
            await highlightComparison(bars[j], bars[j + 1]);
            bars[j + 1].style.height = `${parseInt(bars[j].innerText) * 3}px`;
            bars[j + 1].querySelector('span').innerText = bars[j].innerText;
            j--;
            await sleep(speed);
        }
        bars[j + 1].style.height = `${key * 3}px`;
        bars[j + 1].querySelector('span').innerText = key;
    }
}

async function selectionSort() {
    const bars = document.querySelectorAll('.bar');
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            await highlightComparison(bars[minIndex], bars[j]);
            if (parseInt(bars[j].innerText) < parseInt(bars[minIndex].innerText)) {
                minIndex = j;
            }
        }

        await highlightSwap(bars[i], bars[minIndex]);
        swapBars(i, minIndex);
    }
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
    }
}

async function partition(low, high) {
    const bars = document.querySelectorAll('.bar');
    const pivot = parseInt(bars[high].innerText);
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        await highlightComparison(bars[j], bars[high]);
        if (parseInt(bars[j].innerText) < pivot) {
            i++;
            await highlightSwap(bars[i], bars[j]);
            swapBars(i, j);
        }
    }

    await highlightSwap(bars[i + 1], bars[high]);
    swapBars(i + 1, high);
    return i + 1;
}
async function radixLSDSort() {
    const max = Math.max(...array);
    const bars = document.querySelectorAll('.bar');

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSortByDigit(exp, bars);
    }
}

async function countingSortByDigit(exp, bars) {
    const n = array.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
        await highlightCount(bars[i]);
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
        await highlightMove(bars[i], output[count[digit]]);
    }

    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        await swapBars(i, i);
    }

    for (let i = 0; i < n; i++) {
        bars[i].style.height = `${array[i] * 3}px`;
        bars[i].querySelector('span').innerText = array[i];
        await sleep(speed);
    }
}

async function highlightCount(bar) {
    bar.classList.add('count-highlight');
    await sleep(speed);
    bar.classList.remove('count-highlight');
}

async function highlightMove(bar, value) {
    bar.classList.add('move-highlight');
    await sleep(speed);
    bar.classList.remove('move-highlight');
}


generateArray();
