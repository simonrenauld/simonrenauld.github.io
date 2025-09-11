// Neural Network Visualization
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationFrame = null;
        this.mousePos = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.createNetwork();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createNetwork() {
        const layers = [8, 12, 16, 12, 8, 4]; // Neural network structure
        const layerSpacing = this.width / (layers.length + 1);
        let nodeId = 0;
        
        // Create nodes
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
                    baseRadius: Math.random() * 3 + 2,
                    activity: Math.random(),
                    pulsePhase: Math.random() * Math.PI * 2,
                    connected: []
                });
            }
        });
        
        // Create connections
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
                            activity: 0,
                            pulsePosition: 0,
                            active: false
                        };
                        this.connections.push(connection);
                        node1.connected.push(connection);
                        node2.connected.push(connection);
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
            this.triggerNetworkPulse();
        });
        
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }
    
    triggerNetworkPulse() {
        // Trigger a pulse from input layer
        const inputNodes = this.nodes.filter(n => n.layer === 0);
        inputNodes.forEach(node => {
            node.activity = 1;
            node.connected.forEach(conn => {
                if (conn.from === node) {
                    conn.active = true;
                    conn.pulsePosition = 0;
                }
            });
        });
    }
    
    update(time) {
        // Update node activities
        this.nodes.forEach(node => {
            node.activity *= 0.98; // Decay
            node.pulsePhase += 0.02;
            node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.5;
            
            // Mouse interaction
            const dist = Math.sqrt(
                Math.pow(node.x - this.mousePos.x, 2) + 
                Math.pow(node.y - this.mousePos.y, 2)
            );
            if (dist < 50) {
                node.activity = Math.min(1, node.activity + 0.1);
            }
        });
        
        // Update connections
        this.connections.forEach(conn => {
            if (conn.active) {
                conn.pulsePosition += 0.03;
                if (conn.pulsePosition >= 1) {
                    conn.active = false;
                    conn.pulsePosition = 0;
                    conn.to.activity = Math.min(1, conn.to.activity + 0.8);
                    
                    // Propagate to next connections
                    conn.to.connected.forEach(nextConn => {
                        if (nextConn.from === conn.to && Math.random() > 0.5) {
                            nextConn.active = true;
                            nextConn.pulsePosition = 0;
                        }
                    });
                }
            }
            conn.activity *= 0.95;
        });
        
        // Occasional random pulses
        if (Math.random() < 0.003) {
            this.triggerNetworkPulse();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            const opacity = Math.max(0.1, conn.activity);
            const gradient = this.ctx.createLinearGradient(
                conn.from.x, conn.from.y, conn.to.x, conn.to.y
            );
            
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(139, 92, 246, ${opacity * 0.3})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = Math.max(0.5, conn.activity * 2);
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();
            
            // Draw pulse
            if (conn.active) {
                const pulseX = conn.from.x + (conn.to.x - conn.from.x) * conn.pulsePosition;
                const pulseY = conn.from.y + (conn.to.y - conn.from.y) * conn.pulsePosition;
                
                this.ctx.fillStyle = '#60a5fa';
                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const activity = Math.max(0.2, node.activity);
            
            // Node glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0, node.x, node.y, node.radius * 3
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${activity * 0.8})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Node core
            this.ctx.fillStyle = `rgba(59, 130, 246, ${activity})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Node highlight
            this.ctx.fillStyle = `rgba(255, 255, 255, ${activity * 0.6})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x - node.radius * 0.3, node.y - node.radius * 0.3, node.radius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate(time = 0) {
        this.update(time);
        this.draw();
        this.animationFrame = requestAnimationFrame((t) => this.animate(t));
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Enhanced Counter Animation
class CounterAnimation {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseFloat(target);
        this.duration = duration;
        this.startValue = 0;
        this.startTime = null;
        
        this.animate = this.animate.bind(this);
    }
    
    start() {
        this.startTime = performance.now();
        this.animate();
    }
    
    animate(currentTime) {
        if (!this.startTime) this.startTime = currentTime;
        
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = this.startValue + (this.target - this.startValue) * easeOut;
        
        // Format number based on target
        let displayValue;
        if (this.target < 10) {
            displayValue = currentValue.toFixed(1);
        } else {
            displayValue = Math.floor(currentValue).toLocaleString();
        }
        
        this.element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(this.animate);
        } else {
            this.element.textContent = this.target < 10 ? this.target.toFixed(1) : this.target.toLocaleString();
        }
    }
}

// Particle System for Background
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.container.appendChild(this.canvas);
        this.setupCanvas();
        this.createParticles();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.width * this.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
            
            // Draw particle
            this.ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

export { NeuralNetwork, CounterAnimation, ParticleSystem };
