document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Audio visualizer variables
    let audioContext;
    let analyser;
    let dataArray;
    let isVisualizerOn = true;
    let animationId;
    
    // Color variables
    let colors = [];
    generateColors();
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
    
    themeToggle.addEventListener('click', toggleTheme);
    
    // Visualizer toggle
    const visualizerToggle = document.getElementById('visualizer-toggle');
    visualizerToggle.addEventListener('click', toggleVisualizer);
    
    // Generate random colors for visualizer
    function generateColors() {
        colors = [];
        const hue1 = Math.floor(Math.random() * 360);
        const hue2 = (hue1 + 120) % 360;
        const hue3 = (hue1 + 240) % 360;
        
        colors.push(`hsla(${hue1}, 100%, 50%, 0.7)`);
        colors.push(`hsla(${hue2}, 100%, 50%, 0.7)`);
        colors.push(`hsla(${hue3}, 100%, 50%, 0.7)`);
    }
    
    // Theme functions
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton();
    }
    
    function updateThemeButton() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        themeToggle.textContent = currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
    
    // Visualizer functions
    function toggleVisualizer() {
        isVisualizerOn = !isVisualizerOn;
        visualizerToggle.textContent = `Visualizer: ${isVisualizerOn ? 'On' : 'Off'}`;
        
        if (isVisualizerOn) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // Setup audio analyzer (this would normally connect to an audio element)
    // For demo purposes, we'll simulate audio data
    function setupAudioAnalyser() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // Simulate audio data for the demo
        setInterval(() => {
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i] = Math.random() * 255;
            }
        }, 100);
    }
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (!isVisualizerOn) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (analyser) {
            // analyser.getByteFrequencyData(dataArray); // Use this with real audio
            
            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let x = 0;
            
            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.6;
                const colorIndex = Math.floor(i / (dataArray.length / colors.length)) % colors.length;
                
                ctx.fillStyle = colors[colorIndex];
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                // Mirror effect
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x, 0, barWidth, barHeight / 3);
                ctx.globalAlpha = 1.0;
                
                x += barWidth + 1;
            }
            
            // Add floating particles
            for (let i = 0; i < 5; i++) {
                const size = Math.random() * 5 + 2;
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    size,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
    
    // Initialize
    setupAudioAnalyser();
    animate();
    
    // Add refresh to change colors
    document.querySelector('footer .small').addEventListener('click', function() {
        generateColors();
    });
});