// Enhanced Portfolio JavaScript with Data Visualization and AI Demos - 2025

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + (target === 94 ? '%' : target === 8 ? '+' : '');
                    } else {
                        counter.textContent = Math.floor(current) + (target === 94 ? '%' : target === 8 ? '+' : '');
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Typing animation for hero title
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const words = typingElement.getAttribute('data-words').split(',');
    let currentWord = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function typeText() {
        const word = words[currentWord];
        
        if (isDeleting) {
            typingElement.textContent = word.substring(0, currentChar - 1);
            currentChar--;
        } else {
            typingElement.textContent = word.substring(0, currentChar + 1);
            currentChar++;
        }
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentChar === word.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentWord = (currentWord + 1) % words.length;
            speed = 500; // Pause before next word
        }
        
        setTimeout(typeText, speed);
    }
    
    typeText();
}

// Enhanced Neural Network Implementation
class EnhancedNeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
        
        this.setupCanvas();
        this.createNetwork();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createNetwork() {
        const layers = [5, 8, 12, 8, 4];
        const layerSpacing = this.width / (layers.length + 1);
        let nodeId = 0;
        
        layers.forEach((nodeCount, layerIndex) => {
            const nodeSpacing = this.height / (nodeCount + 1);
            const x = layerSpacing * (layerIndex + 1);
            
            for (let i = 0; i < nodeCount; i++) {
                const y = nodeSpacing * (i + 1);
                this.nodes.push({
                    id: nodeId++,
                    x: x,
                    y: y,
                    layer: layerIndex,
                    radius: Math.random() * 3 + 2,
                    activity: Math.random() * 0.5,
                    pulsePhase: Math.random() * Math.PI * 2,
                    connections: []
                });
            }
        });
        
        // Create connections with weights
        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayer = this.nodes.filter(n => n.layer === i);
            const nextLayer = this.nodes.filter(n => n.layer === i + 1);
            
            currentLayer.forEach(node1 => {
                nextLayer.forEach(node2 => {
                    if (Math.random() > 0.3) { // 70% connection probability
                        const connection = {
                            from: node1,
                            to: node2,
                            weight: Math.random() * 2 - 1,
                            activity: 0
                        };
                        this.connections.push(connection);
                        node1.connections.push(connection);
                    }
                });
            });
        }
    }
    
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
        });
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }
    
    animate() {
        this.time += 0.016; // ~60fps
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update node activities
        this.nodes.forEach(node => {
            // Mouse interaction
            const dx = this.mousePos.x - node.x;
            const dy = this.mousePos.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - distance / 100);
            
            node.activity = Math.sin(this.time + node.pulsePhase) * 0.3 + 0.5 + influence * 0.5;
            node.activity = Math.min(1, Math.max(0, node.activity));
        });
        
        // Update connection activities
        this.connections.forEach(connection => {
            connection.activity = (connection.from.activity + Math.random() * 0.2) * Math.abs(connection.weight);
        });
        
        // Draw connections
        this.connections.forEach(connection => {
            const opacity = connection.activity * 0.6;
            const hue = 220 + connection.weight * 60; // Blue to purple range
            
            this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${opacity})`;
            this.ctx.lineWidth = Math.max(0.5, connection.activity * 2);
            this.ctx.beginPath();
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.stroke();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const pulseSize = node.radius + Math.sin(this.time * 2 + node.pulsePhase) * 1;
            const opacity = 0.3 + node.activity * 0.7;
            
            // Glow effect
            this.ctx.shadowColor = `hsl(220, 70%, 60%)`;
            this.ctx.shadowBlur = node.activity * 10;
            
            // Node body
            this.ctx.fillStyle = `hsla(220, 70%, 60%, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner core
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = `hsla(220, 70%, 80%, ${Math.min(1, opacity + 0.3)})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, pulseSize * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Real-time chart simulation
function initRealtimeChart() {
    const chartContainer = document.getElementById('realtime-chart');
    if (!chartContainer || !window.Chart) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '200px';
    chartContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Generate sample data
    const labels = [];
    const learningData = [];
    const completionData = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        learningData.push(800 + Math.random() * 400);
        completionData.push(88 + Math.random() * 8);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Learners',
                data: learningData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Completion Rate %',
                data: completionData,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: { size: 11 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
                }
            }
        }
    });
}

// Particles.js configuration
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#6366f1' },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: true },
                size: { value: 2, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
}

// Enhanced mini charts for expertise cards
function initMiniCharts() {
    const miniCharts = document.querySelectorAll('.mini-chart');
    
    miniCharts.forEach((chart, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 60;
        chart.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const data = Array.from({ length: 12 }, () => Math.random() * 80 + 20);
        
        // Animate the chart
        let frame = 0;
        function animateChart() {
            ctx.clearRect(0, 0, 150, 60);
            
            // Draw animated bars
            data.forEach((value, i) => {
                const x = i * 12;
                const height = (value / 100) * 50 * Math.min(1, frame / 60);
                const hue = 220 + i * 10;
                
                ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                ctx.fillRect(x, 50 - height, 8, height);
            });
            
            frame++;
            if (frame < 120) {
                requestAnimationFrame(animateChart);
            }
        }
        
        // Start animation when chart comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateChart();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(chart);
    });
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    animateCounters();
    initTypingAnimation();
    initParticles();
    initMiniCharts();
    
    // Initialize neural network
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
        new EnhancedNeuralNetwork(neuralCanvas);
    }
    
    // Initialize chart after Chart.js loads
    setTimeout(initRealtimeChart, 1000);
    
    // Enhanced mobile menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu-open');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Neural Network Implementation (Enhanced)
class SimpleNeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mousePos = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.createNetwork();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createNetwork() {
        const layers = [6, 10, 12, 8, 4];
        const layerSpacing = this.width / (layers.length + 1);
        let nodeId = 0;
        
        layers.forEach((nodeCount, layerIndex) => {
            const nodeSpacing = this.height / (nodeCount + 1);
            const x = layerSpacing * (layerIndex + 1);
            
            for (let i = 0; i < nodeCount; i++) {
                const y = nodeSpacing * (i + 1);
                this.nodes.push({
                    id: nodeId++,
                    x: x,
                    y: y,
                    layer: layerIndex,
                    radius: Math.random() * 2 + 2,
                    activity: Math.random() * 0.5,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        });
        
        // Create connections
        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayer = this.nodes.filter(n => n.layer === i);
            const nextLayer = this.nodes.filter(n => n.layer === i + 1);
            
            currentLayer.forEach(node1 => {
                nextLayer.forEach(node2 => {
                    if (Math.random() > 0.4) {
                        this.connections.push({
                            from: node1,
                            to: node2,
                            activity: Math.random() * 0.3,
                            pulsePosition: Math.random()
                        });
                    }
                });
            });
        }
    }
    
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', () => {
            this.triggerPulse();
        });
    }
    
    triggerPulse() {
        const randomNodes = this.nodes.filter(() => Math.random() > 0.7);
        randomNodes.forEach(node => {
            node.activity = 1;
        });
    }
    
    update() {
        this.nodes.forEach(node => {
            node.pulsePhase += 0.02;
            const dist = Math.sqrt(
                Math.pow(node.x - this.mousePos.x, 2) + 
                Math.pow(node.y - this.mousePos.y, 2)
            );
            if (dist < 60) {
                node.activity = Math.min(1, node.activity + 0.05);
            } else {
                node.activity *= 0.98;
            }
        });
        
        this.connections.forEach(conn => {
            conn.pulsePosition += 0.01;
            if (conn.pulsePosition > 1) conn.pulsePosition = 0;
            conn.activity = Math.max(0.1, conn.from.activity * 0.7);
        });
        
        if (Math.random() < 0.01) {
            this.triggerPulse();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            const opacity = conn.activity;
            this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            this.ctx.lineWidth = opacity * 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();
            
            const pulseX = conn.from.x + (conn.to.x - conn.from.x) * conn.pulsePosition;
            const pulseY = conn.from.y + (conn.to.y - conn.from.y) * conn.pulsePosition;
            
            this.ctx.fillStyle = `rgba(96, 165, 250, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const activity = Math.max(0.3, node.activity);
            const radius = node.radius + Math.sin(node.pulsePhase) * 0.5;
            
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0, node.x, node.y, radius * 2
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${activity})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = `rgba(59, 130, 246, ${activity})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Data Visualization Components
class DataVisualization {
    static createMiniChart(containerId, type, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 80;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        switch(type) {
            case 'line':
                this.drawLineChart(ctx, data, canvas.width, canvas.height);
                break;
            case 'bar':
                this.drawBarChart(ctx, data, canvas.width, canvas.height);
                break;
            case 'circle':
                this.drawCircleChart(ctx, data, canvas.width, canvas.height);
                break;
        }
    }
    
    static drawLineChart(ctx, data, width, height) {
        const padding = 10;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + (1 - point / 100) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 10;
        ctx.stroke();
    }
    
    static drawBarChart(ctx, data, width, height) {
        const padding = 10;
        const barWidth = (width - padding * 2) / data.length;
        
        data.forEach((value, index) => {
            const x = padding + index * barWidth;
            const barHeight = (value / 100) * (height - padding * 2);
            const y = height - padding - barHeight;
            
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#8b5cf6');
            gradient.addColorStop(1, '#6366f1');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        });
    }
    
    static drawCircleChart(ctx, percentage, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;
        
        // Background circle
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Progress circle
        const angle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle);
        ctx.stroke();
        
        // Center text
        ctx.fillStyle = '#1f2937';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${percentage}%`, centerX, centerY + 5);
    }
}

// Real-time Chart with Chart.js
class RealtimeChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 200;
        this.container.appendChild(this.canvas);
        
        this.setupChart();
        this.startDataStream();
    }
    
    setupChart() {
        const ctx = this.canvas.getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => i),
                datasets: [{
                    label: 'Data Processing Rate',
                    data: Array.from({length: 20}, () => Math.random() * 100),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: {
                    point: { radius: 0 }
                }
            }
        });
    }
    
    startDataStream() {
        setInterval(() => {
            const newValue = Math.random() * 100;
            this.chart.data.datasets[0].data.shift();
            this.chart.data.datasets[0].data.push(newValue);
            this.chart.update('none');
        }, 1000);
    }
}

// TensorFlow.js Demo
class AIDemo {
    static async initializeModel() {
        try {
            // Simple linear model for demonstration
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({inputShape: [1], units: 1})
                ]
            });
            
            model.compile({
                optimizer: 'sgd',
                loss: 'meanSquaredError'
            });
            
            return model;
        } catch (error) {
            console.log('TensorFlow.js not available for demo');
            return null;
        }
    }
    
    static createNeuralNetworkVisualization(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '80');
        svg.setAttribute('viewBox', '0 0 200 80');
        
        // Create simple neural network visualization
        const layers = [3, 4, 2];
        const layerSpacing = 200 / (layers.length + 1);
        
        layers.forEach((nodeCount, layerIndex) => {
            const x = layerSpacing * (layerIndex + 1);
            const nodeSpacing = 80 / (nodeCount + 1);
            
            for (let i = 0; i < nodeCount; i++) {
                const y = nodeSpacing * (i + 1);
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', '4');
                circle.setAttribute('fill', '#8b5cf6');
                circle.setAttribute('opacity', '0.8');
                
                svg.appendChild(circle);
                
                // Add connections to next layer
                if (layerIndex < layers.length - 1) {
                    const nextLayerNodeCount = layers[layerIndex + 1];
                    const nextLayerSpacing = 80 / (nextLayerNodeCount + 1);
                    const nextX = layerSpacing * (layerIndex + 2);
                    
                    for (let j = 0; j < nextLayerNodeCount; j++) {
                        const nextY = nextLayerSpacing * (j + 1);
                        
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', x);
                        line.setAttribute('y1', y);
                        line.setAttribute('x2', nextX);
                        line.setAttribute('y2', nextY);
                        line.setAttribute('stroke', '#6366f1');
                        line.setAttribute('stroke-width', '1');
                        line.setAttribute('opacity', '0.3');
                        
                        svg.appendChild(line);
                    }
                }
            }
        });
        
        container.appendChild(svg);
    }
}

// Security Visualization
class SecurityVisualization {
    static createSecurityMatrix(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 80;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const gridSize = 8;
        const cellSize = canvas.width / gridSize;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < Math.floor(canvas.height / cellSize); j++) {
                const security = Math.random();
                const alpha = security * 0.8 + 0.2;
                
                ctx.fillStyle = security > 0.7 ? `rgba(34, 197, 94, ${alpha})` : 
                               security > 0.4 ? `rgba(251, 191, 36, ${alpha})` : 
                               `rgba(239, 68, 68, ${alpha})`;
                
                ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
            }
        }
    }
}

// Pipeline Demo
class PipelineDemo {
    static createPipelineVisualization(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '200');
        svg.setAttribute('height', '60');
        svg.setAttribute('viewBox', '0 0 200 60');
        
        const stages = ['Ingest', 'Process', 'Store', 'Serve'];
        const stageWidth = 200 / stages.length;
        
        stages.forEach((stage, index) => {
            const x = index * stageWidth + 10;
            const y = 30;
            
            // Stage box
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y - 10);
            rect.setAttribute('width', stageWidth - 20);
            rect.setAttribute('height', '20');
            rect.setAttribute('fill', '#6366f1');
            rect.setAttribute('rx', '4');
            rect.setAttribute('opacity', '0.8');
            
            svg.appendChild(rect);
            
            // Stage label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + (stageWidth - 20) / 2);
            text.setAttribute('y', y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '8');
            text.setAttribute('fill', 'white');
            text.textContent = stage;
            
            svg.appendChild(text);
            
            // Arrow to next stage
            if (index < stages.length - 1) {
                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const arrowX = x + stageWidth - 10;
                arrow.setAttribute('d', `M ${arrowX} ${y} L ${arrowX + 8} ${y}`);
                arrow.setAttribute('stroke', '#6366f1');
                arrow.setAttribute('stroke-width', '2');
                arrow.setAttribute('marker-end', 'url(#arrowhead)');
                
                svg.appendChild(arrow);
            }
        });
        
        // Add arrowhead marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '0');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#6366f1');
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);
        
        container.appendChild(svg);
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Neural Network
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
        new SimpleNeuralNetwork(neuralCanvas);
    }
    
    // Initialize Particles.js background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50 },
                color: { value: '#6366f1' },
                shape: { type: 'circle' },
                opacity: { value: 0.3 },
                size: { value: 2 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1
                }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: 'repulse' }
                }
            }
        });
    }
    
    // Initialize Data Visualizations
    setTimeout(() => {
        DataVisualization.createMiniChart('access-chart', 'line', [20, 40, 60, 80, 90, 95]);
        DataVisualization.createMiniChart('completion-chart', 'bar', [85, 90, 92, 94, 94]);
        DataVisualization.createMiniChart('uptime-chart', 'circle', 99.9);
        SecurityVisualization.createSecurityMatrix('security-matrix');
        PipelineDemo.createPipelineVisualization('pipeline-demo');
        AIDemo.createNeuralNetworkVisualization('neural-network-viz');
        
        // Initialize real-time chart
        new RealtimeChart('realtime-chart');
    }, 1000);
    
    // Enhanced Counter Animation
    function animateCounter(element, target, duration = 2000) {
        const startValue = 0;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (target - startValue) * easeOut;
            
            if (target < 10) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target < 10 ? target.toFixed(1) : target.toLocaleString();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start counter animations
    const metricValues = document.querySelectorAll('.metric-value[data-target]');
    const startCounters = () => {
        metricValues.forEach((element, index) => {
            const target = parseFloat(element.dataset.target);
            setTimeout(() => {
                animateCounter(element, target, 2000 + index * 200);
            }, 500 + index * 100);
        });
    };
    
    // Start counters when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const impactSection = document.getElementById('impact');
    if (impactSection) {
        observer.observe(impactSection);
    }

    // Mobile menu toggle with enhanced behavior
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownParents = document.querySelectorAll('.has-dropdown');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isActive = this.classList.toggle('active');
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                dropdownParents.forEach(p => p.classList.remove('open'));
            }
        });

        // Dropdown toggle for mobile
        dropdownParents.forEach(parent => {
            const trigger = parent.querySelector('a.nav-link');
            if (!trigger) return;
            trigger.addEventListener('click', function(e) {
                if (window.matchMedia('(max-width: 768px)').matches) {
                    e.preventDefault();
                    const willOpen = !parent.classList.contains('open');
                    parent.classList.toggle('open');
                    this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                }
            });
        });

        // Close menus on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                dropdownParents.forEach(p => {
                    p.classList.remove('open');
                    const trigger = p.querySelector('a.nav-link');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.main-navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced navigation scroll effect
    const navigation = document.querySelector('.main-navigation');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navigation.style.background = 'rgba(255, 255, 255, 0.98)';
            navigation.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            navigation.style.backdropFilter = 'blur(10px)';
        } else {
            navigation.style.background = 'rgba(255, 255, 255, 0.95)';
            navigation.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            navigation.style.backdropFilter = 'blur(5px)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // Enhanced project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animations to cards and sections
    const animatedElements = document.querySelectorAll('.expertise-card, .project-card, .timeline-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // Form submission handler
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });
    }

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.1; // Reduced for better performance
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
});