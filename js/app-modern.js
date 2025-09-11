// Modern Portfolio JavaScript - 2025 Enhanced

// Neural Network Implementation
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
        // Activate random nodes for visual effect
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
        
        // Random activation
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
            
            // Pulse effect
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
            
            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0, node.x, node.y, radius * 2
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${activity})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Node core
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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Neural Network
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
        new SimpleNeuralNetwork(neuralCanvas);
    }
    
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
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        observer.observe(heroSection);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
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

    // Navigation scroll effect
    const navigation = document.querySelector('.main-navigation');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navigation.style.background = 'rgba(255, 255, 255, 0.98)';
            navigation.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navigation.style.background = 'rgba(255, 255, 255, 0.95)';
            navigation.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

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
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show success message (in a real app, you'd send this to a server)
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });
    }

    // Parallax effect for hero section
    const heroSection2 = document.querySelector('.hero-section');
    if (heroSection2) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            heroSection2.style.transform = `translateY(${parallax}px)`;
        });
    }
});
