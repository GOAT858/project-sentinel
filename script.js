// =========================================
// PROJECT SENTINEL - JAVASCRIPT LOGIC
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. TAB NAVIGATION ---
    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));
            
            // Add active class to clicked tab
            tab.classList.add("active");
            const target = tab.getAttribute("data-tab");
            document.getElementById(target).classList.add("active");
        });
    });

    // --- 2. CAMERA AND UPLOAD SETUP ---
    const video = document.getElementById("camera-preview");
    const canvas = document.getElementById("analysis-canvas");
    const captureBtn = document.getElementById("capture-btn");
    const startCamBtn = document.getElementById("start-camera-btn");
    const analyzeBtn = document.getElementById("analyze-btn");
    const retakeBtn = document.getElementById("retake-btn");
    const previewWrap = document.getElementById("preview-wrap");
    const capturedPreview = document.getElementById("captured-preview");
    const scanOverlay = document.getElementById("scan-overlay");
    const uploadInput = document.getElementById("upload-input");

    let stream = null;

    // Start Camera
    async function startCamera() {
        try {
            // Request back camera
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = stream;
            startCamBtn.classList.add("hidden");
            previewWrap.classList.add("hidden");
            video.classList.remove("hidden");
            document.getElementById("camera-note").innerText = "Camera Active. Align Cassette.";
        } catch (err) {
            console.error("Camera error:", err);
            document.getElementById("camera-note").innerText = "Camera access denied. Please use 'Upload Image'.";
        }
    }

    startCamBtn.addEventListener("click", startCamera);

    // Capture Image
    captureBtn.addEventListener("click", () => {
        if (!stream) return;
        
        // Draw video frame to hidden canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        
        // Show preview
        capturedPreview.src = canvas.toDataURL("image/png");
        video.classList.add("hidden");
        previewWrap.classList.remove("hidden");
        
        // UI Updates
        captureBtn.classList.add("hidden");
        analyzeBtn.classList.remove("hidden");
        retakeBtn.classList.remove("hidden");

        // Stop camera tracks to save battery
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    });

    // Handle File Upload (Fallback)
    uploadInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                capturedPreview.src = event.target.result;
                video.classList.add("hidden");
                previewWrap.classList.remove("hidden");
                startCamBtn.classList.add("hidden");
                captureBtn.classList.add("hidden");
                analyzeBtn.classList.remove("hidden");
                retakeBtn.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Retake Button
    retakeBtn.addEventListener("click", () => {
        analyzeBtn.classList.add("hidden");
        retakeBtn.classList.add("hidden");
        captureBtn.classList.remove("hidden");
        startCamera();
    });

    // --- 3. THE AI SIMULATION SEQUENCE ---
    analyzeBtn.addEventListener("click", () => {
        analyzeBtn.classList.add("hidden");
        retakeBtn.classList.add("hidden");
        scanOverlay.style.display = "block"; // Show laser scanner
        
        const standbyText = document.getElementById("system-standby");
        
        // Simulated Sequence
        standbyText.innerHTML = "▰▱▱▱▱▱▱▱ Extracting Spectrophotometric Data...";
        
        setTimeout(() => {
            standbyText.innerHTML = "▰▰▰▰▱▱▱▱ Quantifying RNA Saturation...";
        }, 1500);

        setTimeout(() => {
            standbyText.innerHTML = "▰▰▰▰▰▰▰▱ Mapping Latent Coordinates via VAE...";
        }, 3000);

        setTimeout(() => {
            scanOverlay.style.display = "none";
            generateResults();
        }, 4500);
    });

    // --- 4. POPULATE RESULTS ---
    function generateResults() {
        // Math: Generate a random high-risk score for demonstration
        const opticalDensity = (Math.random() * (0.99 - 0.75) + 0.75).toFixed(3);
        const probability = (opticalDensity * 100).toFixed(1);
        
        // Update DOM Metrics
        document.getElementById("system-standby").innerHTML = "<span style='color:#00ff88'>ANALYSIS COMPLETE. VAE MAPPED.</span>";
        document.getElementById("metric-od").innerText = opticalDensity;
        document.getElementById("metric-score").innerText = (opticalDensity * 120).toFixed(0); // Arbitrary score scale
        document.getElementById("metric-prob").innerText = probability + "%";
        document.getElementById("metric-source").innerText = "Edge/Local";

        document.getElementById("biomarker-saturation").innerHTML = "KRT19: <strong>HIGH</strong> | ANXA1: <strong>HIGH</strong> | MALL: <strong>HIGH</strong>";

        // Update Clinical Directive Panel
        const directiveCard = document.getElementById("directive-card");
        const directiveText = document.getElementById("clinical-directive");

        if (opticalDensity > 0.80) {
            directiveCard.className = "directive-card danger";
            directiveText.innerHTML = "<strong>🚨 CRITICAL: Stage-0 Profile Detected.</strong><br>Sentinel-5 RNA Threshold Exceeded. Immediate Endoscopic Ultrasound (EUS) Referral Recommended.";
        } else {
            directiveCard.className = "directive-card safe";
            directiveText.innerHTML = "<strong>✅ BASELINE: Healthy Expression.</strong><br>Routine monitoring recommended.";
        }
    }
});
