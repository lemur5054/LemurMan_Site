(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        // --- 1. HEADER & INTERACTIVE BUTTONS ---
        // Look for the container (check if you use 'header-container' or 'header-placeholder')
        const headerContainer = document.getElementById('header-container') || document.getElementById('header-placeholder');

        if (headerContainer) {
            fetch('header.html')
                .then(response => {
                    if (!response.ok) throw new Error('Could not find header.html');
                    return response.text();
                })
                .then(data => {
                    headerContainer.innerHTML = data;

                    // 1. Select all the elements
                    const loginBtn = document.getElementById('loginBtn');
                    const logoutBtn = document.getElementById('logoutBtn');

                    // 2. LOGOUT LOGIC: What happens when you click Logout?
                    if (logoutBtn && loginBtn) {
                        logoutBtn.addEventListener('click', function() {
                            // Clear the memory
                            localStorage.removeItem('loginBtnState');
                            
                            // Reset the Login Button to original look
                            loginBtn.textContent = 'Login'; // Change this to your original text
                            loginBtn.style.backgroundColor = ''; // Resets to CSS default
                            loginBtn.style.color = '';           // Resets to CSS default
                            
                        });
                    }

                    // 3. LOGIN LOGIC: (Your existing code with the memory check)
                    if (loginBtn) {
                        const isUpdated = localStorage.getItem('loginBtnState') === 'updated';

                        if (isUpdated) {
                            applyLoginStyle(loginBtn);
                        }

                        loginBtn.addEventListener('click', function() {
                            // 1. Save the state so they stay logged in on the next page
                            localStorage.setItem('loginBtnState', 'updated');
                            
                            // 2. IMMEDIATE REDIRECT (Put the filename you want here)
                            window.location.href = 'account.html'; 
                            
                        });
                    }

                    // Helper to keep code clean
                    function applyLoginStyle(btn) {
                        btn.textContent = 'Logged In';
                        btn.style.backgroundColor = '#4CAF50';
                        btn.style.color = 'white';
                    }



                    // B. Setup the Color Slider (with LocalStorage Memory)
                    const hueSlider = document.getElementById('hueSlider');
                    if (hueSlider) {
                        const savedHue = localStorage.getItem('headerHue');
                        
                        // Apply saved hue on load
                        if (savedHue !== null) {
                            hueSlider.value = savedHue;
                            document.documentElement.style.setProperty('--main-hue', savedHue);
                            document.documentElement.style.setProperty('--accent-color', `hsl(${savedHue}, 70%, 50%)`);
                        }

                        // Listen for changes
                        hueSlider.addEventListener('input', (e) => {
                            const val = e.target.value;
                            document.documentElement.style.setProperty('--main-hue', val);
                            document.documentElement.style.setProperty('--accent-color', `hsl(${val}, 70%, 50%)`);
                            localStorage.setItem('headerHue', val);
                        });
                    }
                })
                .catch(error => console.error('Error loading header:', error));
        }

        // --- 2. SMOOTH SCROLL ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // --- 3. ACTIVE LINK HIGHLIGHTING (Observer) ---
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');
        if (sections.length > 0 && navLinks.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, { root: document.querySelector('.content'), rootMargin: '-10% 0px -80% 0px' });
            sections.forEach(section => observer.observe(section));
        }

        // --- 4. LOGIN FORM ---
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                if (username === "admin" && password === "1234") {
                    alert("Login successful!");
                } else {
                    alert("Invalid credentials. Try admin / 1234");
                }
            });
        }

        // --- 5. LOAD OTHER CONTENT ---
        loadHTML('optifine-forge.html', 'content-optifine-forge');
        loadHTML('optifine-McLauncher.html', 'content-optifine-McLauncher');
        loadHTML('setup_server.html', 'content-setup_server');

    });

    // Helper function for general HTML injection
    function loadHTML(fileName, elementId) {
        const targetEl = document.getElementById(elementId);
        if (!targetEl) return;
        fetch(fileName)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(data => { targetEl.innerHTML = data; })
            .catch(error => console.error(`Error loading ${fileName}:`, error));
    }
})();
