// DOM Elements
const codeEditor = document.getElementById('code-editor');
const executeBtn = document.getElementById('execute-btn');
const clearBtn = document.getElementById('clear-btn');
const validateBtn = document.getElementById('validate-btn');
const copyBtn = document.getElementById('copy-btn');
const output = document.getElementById('output');
const executionTime = document.getElementById('execution-time');

// Examples Database
const examples = {
  hello: {
    name: 'Hello World',
    code: `console.log('🎉 Hello, Sandbox!');
console.log('Welcome to the awesome-sandbox');
const message = 'JavaScript is fun!';
console.log(message);`
  },
  array: {
    name: 'Array Methods',
    code: `const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

// Filter
const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens);

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);`
  },
  async: {
    name: 'Async/Await',
    code: `async function fetchData() {
  console.log('Fetching data...');
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const data = { id: 1, name: 'John', role: 'Developer' };
  console.log('Data received:', data);
  return data;
}

fetchData().then(data => {
  console.log('Processing complete');
}).catch(err => console.error(err));`
  },
  class: {
    name: 'Classes',
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks!\`);
  }
}

const dog = new Dog('Rex');
dog.speak();`
  },
  recursion: {
    name: 'Recursion',
    code: `// Factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log('5! =', factorial(5));

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci(8) =', fibonacci(8));`
  },
  regex: {
    name: 'RegEx',
    code: `// Email validation
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
console.log('Valid email:', emailRegex.test('user@example.com'));
console.log('Invalid email:', emailRegex.test('invalid.email'));

// Extract numbers
const text = 'I have 5 apples and 3 oranges';
const numbers = text.match(/\\d+/g);
console.log('Numbers found:', numbers);

// Replace pattern
const formatted = 'hello-world'.replace(/-/g, ' ');
console.log('Formatted:', formatted);`
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadExample('hello');
  setupEventListeners();
});

function setupEventListeners() {
  executeBtn.addEventListener('click', executeCode);
  clearBtn.addEventListener('click', clearOutput);
  validateBtn.addEventListener('click', validateCode);
  copyBtn.addEventListener('click', copyCode);
  
  // Execute on Ctrl+Enter
  codeEditor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      executeCode();
    }
  });
}

async function executeCode() {
  const code = codeEditor.value.trim();
  
  if (!code) {
    addOutput('Please write some code first!', 'warning');
    return;
  }

  // Clear previous output
  output.innerHTML = '';
  executeBtn.disabled = true;
  executeBtn.textContent = '⏳ Executing...';

  const startTime = performance.now();

  try {
    // Override console for output capture
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      logs.push({ message: args.join(' '), type: 'log' });
      originalLog(...args);
    };

    console.error = (...args) => {
      logs.push({ message: args.join(' '), type: 'error' });
      originalError(...args);
    };

    console.warn = (...args) => {
      logs.push({ message: args.join(' '), type: 'warning' });
      originalWarn(...args);
    };

    // Execute code
    const result = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    }).then(r => r.json());

    // Restore console
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;

    // Display logs
    if (logs.length > 0) {
      logs.forEach(log => {
        addOutput(log.message, log.type);
      });
    }

    // Display result
    if (result.success && result.result !== undefined) {
      addOutput(`Result: ${JSON.stringify(result.result)}`, 'success');
    } else if (!result.success) {
      addOutput(result.error, 'error');
    }

    const endTime = performance.now();
    executionTime.textContent = `⏱️ ${(endTime - startTime).toFixed(2)}ms`;

  } catch (error) {
    addOutput(`Error: ${error.message}`, 'error');
  } finally {
    executeBtn.disabled = false;
    executeBtn.textContent = '▶ Execute';
  }
}

async function validateCode() {
  const code = codeEditor.value.trim();

  if (!code) {
    addOutput('Please write some code first!', 'warning');
    return;
  }

  try {
    const result = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    }).then(r => r.json());

    if (result.valid) {
      addOutput('✓ Code syntax is valid!', 'success');
    } else {
      addOutput(`✗ Syntax error: ${result.error}`, 'error');
    }
  } catch (error) {
    addOutput(`Validation error: ${error.message}`, 'error');
  }
}

function clearOutput() {
  output.innerHTML = '<p class="placeholder">Output will appear here...</p>';
  executionTime.textContent = '';
}

function copyCode() {
  codeEditor.select();
  document.execCommand('copy');
  copyBtn.textContent = '✓ Copied!';
  setTimeout(() => {
    copyBtn.textContent = '📋 Copy';
  }, 2000);
}

function addOutput(message, type = 'log') {
  if (output.querySelector('.placeholder')) {
    output.innerHTML = '';
  }

  const line = document.createElement('div');
  line.className = `output-line ${type}`;
  
  let prefix = '';
  switch(type) {
    case 'error': prefix = '❌ '; break;
    case 'success': prefix = '✅ '; break;
    case 'warning': prefix = '⚠️  '; break;
    default: prefix = '📝 ';
  }

  line.textContent = prefix + message;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function loadExample(key) {
  const example = examples[key];
  if (example) {
    codeEditor.value = example.code;
    clearOutput();
    codeEditor.focus();
  }
}