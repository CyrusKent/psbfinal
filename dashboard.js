// dashboard.js - Enhanced with redeem code functionality

document.addEventListener('DOMContentLoaded', function() {
    // ========== DASHBOARD INITIALIZATION ==========
    
    // User's current points - will be initialized from localStorage or HTML
    let userPoints = 0;
    
    // Available codes with point values
    const availableCodes = [
        { code: "PLASTIC20", points: 20, type: "plastic" },
        { code: "RECYCLE15", points: 15, type: "general" }, 
        { code: "GREEN25", points: 25, type: "bonus" },
        { code: "ECO10", points: 10, type: "general" },
        { code: "BOTTLE30", points: 30, type: "bottle" },
        { code: "SAVE5", points: 5, type: "general" },
        { code: "897234", points: 1, type: "numeric" },
        { code: "263754", points: 1, type: "numeric" },
        { code: "384672", points: 1, type: "numeric" },
        { code: "542671", points: 1, type: "numeric" },
        { code: "890234", points: 1, type: "numeric" },
        { code: "test", points: 250, type: "numeric" },
        { code: "236418", points: 1, type: "numeric" },
        { code: "895382", points: 1, type: "numeric" },
        { code: "PLANET50", points: 50, type: "special" }
    ];
    
    // Codes already redeemed (stored in localStorage)
    let redeemedCodes = JSON.parse(localStorage.getItem('redeemedCodes')) || [];
    
    // Available rewards
    const availableRewards = [
        {
            id: 1,
            title: "EcoStore PH Discount",
            description: "20% off on all eco-friendly products",
            store: "EcoStore PH",
            points: 100,
            couponCode: "ECO20-OFF-2024",
            icon: "🛍️"
        },
        {
            id: 2,
            title: "GreenMart Voucher",
            description: "₱200 discount on reusable items",
            store: "GreenMart Supermarket",
            points: 150,
            couponCode: "GREEN200-2024",
            icon: "🛒"
        },
        {
            id: 3,
            title: "RecycleHub Coffee",
            description: "Free premium coffee at our partner cafe",
            store: "RecycleHub Cafe",
            points: 75,
            couponCode: "FREE-COFFEE-RH",
            icon: "☕"
        },
        {
            id: 4,
            title: "Reusable Water Bottle",
            description: "Insulated stainless steel bottle",
            store: "Eco Hydration PH",
            points: 200,
            couponCode: "HYDRATE-2024",
            icon: "💧"
        },
        {
            id: 5,
            title: "Eco Bag Bundle",
            description: "Set of 3 reusable shopping bags",
            store: "GreenLiving Store",
            points: 120,
            couponCode: "BAGS-3PACK",
            icon: "👜"
        },
        {
            id: 6,
            title: "Bamboo Utensil Set",
            description: "Eco-friendly bamboo cutlery set",
            store: "Sustainable Living",
            points: 180,
            couponCode: "BAMBOO-SET24",
            icon: "🍴"
        },
        {
            id: 7,
            title: "Plant a Tree",
            description: "We'll plant a tree in your name",
            store: "Forest Guardians PH",
            points: 250,
            couponCode: "TREE-PLANT-24",
            icon: "🌳"
        },
        {
            id: 8,
            title: "Solar Power Bank",
            description: "Solar-charged portable charger",
            store: "SunPower Store",
            points: 300,
            couponCode: "SOLAR-POWER-24",
            icon: "🔋"
        }
    ];
    
    // Redeemed rewards (stored in localStorage)
    let redeemedRewards = JSON.parse(localStorage.getItem('redeemedRewards')) || [];
    
    // Initialize the dashboard
    function initializeDashboard() {
        // Load current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('plastiCycleCurrentUser'));
        
        if (!currentUser) {
            // If no user is logged in, redirect to login page
            window.location.href = 'index.html';
            return;
        }
        
        // Load user points from localStorage or use user's points
        const savedPoints = localStorage.getItem('userPoints');
        if (savedPoints !== null) {
            userPoints = parseInt(savedPoints);
        } else {
            // Use points from user data
            userPoints = currentUser.points || 154;
            localStorage.setItem('userPoints', userPoints.toString());
        }
        
        // Update balance display
        document.querySelector('.bal-amount').textContent = userPoints;
        
        // Update member name using ID
        const memberNameElement = document.getElementById('memberName');
        if (memberNameElement) {
            if (currentUser.name) {
                memberNameElement.textContent = currentUser.name;
            } else if (currentUser.username) {
                // Fallback to username if name doesn't exist
                memberNameElement.textContent = currentUser.username;
            }
        }
        
        console.log(`Dashboard initialized for ${currentUser.name || currentUser.username}. User points: ${userPoints}`);
    }
    
    // ========== REDEEM CODE FUNCTIONALITY ==========
    
    // Display only promo codes (exclude numeric codes)
    function displayPromoCodes() {
        const promoCodesList = document.getElementById('promoCodesList');
        const promoNotification = document.getElementById('promoNotification');
        
        // Get only promo codes (not numeric ones)
        const promoCodeData = availableCodes.filter(code => code.type !== "numeric");
        
        // Filter out already redeemed promo codes
        const availablePromoCodes = promoCodeData.filter(code => !redeemedCodes.includes(code.code));
        
        // Clear existing codes
        promoCodesList.innerHTML = '';
        
        if (availablePromoCodes.length === 0) {
            // Hide notification if no promo codes available
            promoNotification.style.display = 'none';
            return;
        }
        
        // Show notification if there are promo codes
        promoNotification.style.display = 'block';
        
        // Display each promo code
        availablePromoCodes.forEach(codeData => {
            const codeElement = document.createElement('span');
            codeElement.className = 'promo-tag';
            codeElement.textContent = codeData.code;
            codeElement.title = `Click to use - ${codeData.points} points`;
            
            // Add click event to auto-fill
            codeElement.addEventListener('click', function() {
                document.getElementById('redeemCodeInput').value = codeData.code;
                document.getElementById('redeemCodeInput').focus();
            });
            
            promoCodesList.appendChild(codeElement);
        });
    }
    
    // Validate and redeem code
    function redeemCode(code) {
        const codeInput = code.toUpperCase().trim();
        const messageDiv = document.getElementById('redeemMessage');
        
        // Clear previous message
        messageDiv.textContent = '';
        messageDiv.style.color = '';
        
        // Check if code is empty
        if (!codeInput) {
            messageDiv.textContent = 'Please enter a code';
            messageDiv.style.color = 'var(--danger)';
            return false;
        }
        
        // Check if already redeemed
        if (redeemedCodes.includes(codeInput)) {
            messageDiv.textContent = 'Code already redeemed';
            messageDiv.style.color = 'var(--danger)';
            return false;
        }
        
        // Find the code in available codes
        const codeData = availableCodes.find(c => c.code === codeInput);
        
        if (!codeData) {
            messageDiv.textContent = 'Invalid code';
            messageDiv.style.color = 'var(--danger)';
            return false;
        }
        
        // Success - redeem the code
        redeemedCodes.push(codeInput);
        localStorage.setItem('redeemedCodes', JSON.stringify(redeemedCodes));
        
        // Add points
        userPoints += codeData.points;
        document.querySelector('.bal-amount').textContent = userPoints;
        localStorage.setItem('userPoints', userPoints.toString());
        
        // Show success message
        document.getElementById('successMessage').textContent = 
            `You redeemed ${codeData.points} points with code ${codeInput}!`;
        document.getElementById('successModal').style.display = 'flex';
        
        // Add to transaction history
        addTransactionToHistory(codeInput, codeData.points);
        
        // Update displayed promo codes
        displayPromoCodes();
        
        return true;
    }
    
    // ========== REDEEM REWARDS FUNCTIONALITY ==========
    
    // Display rewards in modal
    function displayRewards() {
        const rewardsList = document.getElementById('rewardsList');
        const pointsDisplay = document.getElementById('currentPointsDisplay');
        
        // Update current points display
        pointsDisplay.textContent = userPoints;
        
        // Clear existing rewards
        rewardsList.innerHTML = '';
        
        // Add each reward
        availableRewards.forEach(reward => {
            const isRedeemed = redeemedRewards.includes(reward.id);
            const canAfford = userPoints >= reward.points;
            
            const rewardItem = document.createElement('div');
            rewardItem.className = `reward-item ${isRedeemed ? 'redeemed' : ''}`;
            
            rewardItem.innerHTML = `
                <div class="reward-icon">${reward.icon}</div>
                <div class="reward-details">
                    <div class="reward-title">${reward.title}</div>
                    <div class="reward-desc">${reward.description}</div>
                    <div class="reward-price">${reward.points} points</div>
                </div>
                <div class="reward-action">
                    ${isRedeemed ? 
                        '<span style="color: var(--text-light); font-size: 0.85rem;">Redeemed</span>' : 
                        `<button class="cta" style="font-size: 0.85rem; padding: 0.5rem 1rem;" 
                                ${!canAfford ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                            ${canAfford ? 'Redeem' : 'Need Points'}
                        </button>`
                    }
                </div>
            `;
            
            // Add click event if not redeemed
            if (!isRedeemed && canAfford) {
                const redeemBtn = rewardItem.querySelector('button');
                redeemBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    redeemReward(reward);
                });
            } else if (!canAfford && !isRedeemed) {
                rewardItem.addEventListener('click', function() {
                    showPointsNeeded(reward);
                });
            }
            
            rewardsList.appendChild(rewardItem);
        });
    }
    
    // Redeem a reward
    function redeemReward(reward) {
        // Deduct points
        userPoints -= reward.points;
        document.querySelector('.bal-amount').textContent = userPoints;
        localStorage.setItem('userPoints', userPoints.toString());
        
        // Add to redeemed rewards
        redeemedRewards.push(reward.id);
        localStorage.setItem('redeemedRewards', JSON.stringify(redeemedRewards));
        
        // Show coupon modal
        document.getElementById('couponCodeValue').textContent = reward.couponCode;
        document.getElementById('couponStoreName').textContent = reward.store;
        document.getElementById('rewardsModal').style.display = 'none';
        document.getElementById('couponModal').style.display = 'flex';
        
        // Add to transaction history
        addRewardTransactionToHistory(reward);
        
        // Update rewards display
        displayRewards();
    }
    
    // Show points needed warning
    function showPointsNeeded(reward) {
        const pointsNeeded = reward.points - userPoints;
        alert(`You need ${pointsNeeded} more points to redeem this reward! Keep recycling to earn more points.`);
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    // Add transaction to history
    function addTransactionToHistory(code, points) {
        const transactionsSection = document.querySelector('.right-section .section:last-child');
        const transactionsContainer = transactionsSection.querySelector('.tx:first-child').parentNode;
        
        const newTransaction = document.createElement('div');
        newTransaction.className = 'tx';
        newTransaction.innerHTML = `
            <svg class="qr-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v8m0-8a2 2 0 110-4 2 2 0 010 4zm0 0v1m0 7v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" stroke-width="1.6"/>
                <path d="M12 16l-2-2 2-2 2 2-2 2z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="meta">
                <div class="name">Redeemed Code: ${code}</div>
                <div class="time">${getCurrentDateTime()}</div>
            </div>
            <div class="amount">+${points} Points</div>
        `;
        
        // Insert at the top of transactions
        transactionsContainer.insertBefore(newTransaction, transactionsContainer.firstChild);
    }
    
    // Add reward transaction to history
    function addRewardTransactionToHistory(reward) {
        const transactionsSection = document.querySelector('.right-section .section:last-child');
        const transactionsContainer = transactionsSection.querySelector('.tx:first-child').parentNode;
        
        const newTransaction = document.createElement('div');
        newTransaction.className = 'tx';
        newTransaction.innerHTML = `
            <svg class="qr-icon" viewBox="0 0 24 24" fill="none">
                <path d="M9 15l6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <path d="M15 15L9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/>
            </svg>
            <div class="meta">
                <div class="name">Redeemed: ${reward.title}</div>
                <div class="time">${getCurrentDateTime()}</div>
            </div>
            <div class="amount negative">-${reward.points} Points</div>
        `;
        
        // Insert at the top of transactions
        transactionsContainer.insertBefore(newTransaction, transactionsContainer.firstChild);
    }
    
    // Get current date and time
    function getCurrentDateTime() {
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'short' });
        const day = now.getDate();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${month} ${day} · ${hours}:${minutes}`;
    }
    
    // ========== EVENT LISTENERS ==========
    
    // Redeem Code button click
    const redeemCodeBtn = document.querySelector('.qr-quick');
    if (redeemCodeBtn) {
        redeemCodeBtn.addEventListener('click', function() {
            const modal = document.getElementById('redeemModal');
            if (modal) {
                modal.style.display = 'flex';
                document.getElementById('redeemCodeInput').value = '';
                document.getElementById('redeemMessage').textContent = '';
                displayPromoCodes();
                setTimeout(() => {
                    document.getElementById('redeemCodeInput').focus();
                }, 100);
            }
        });
    }
    
    // Redeem Rewards button click
    const redeemRewardsBtn = document.querySelectorAll('.quick')[1];
    if (redeemRewardsBtn) {
        redeemRewardsBtn.addEventListener('click', function() {
            const modal = document.getElementById('rewardsModal');
            if (modal) {
                modal.style.display = 'flex';
                displayRewards();
            }
        });
    }
    
    // Modal event listeners
    setupModalListeners();
    
    // Logout functionality
    setupLogoutListener();
    
    // Initialize the dashboard
    initializeDashboard();
    
    // ========== MODAL SETUP FUNCTIONS ==========
    
    function setupModalListeners() {
        // Redeem Modal
        const redeemModal = document.getElementById('redeemModal');
        if (redeemModal) {
            // Cancel button
            const cancelBtn = document.getElementById('cancelRedeem');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    redeemModal.style.display = 'none';
                });
            }
            
            // Confirm redeem button
            const confirmBtn = document.getElementById('confirmRedeem');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', function() {
                    const codeInput = document.getElementById('redeemCodeInput').value;
                    if (redeemCode(codeInput)) {
                        redeemModal.style.display = 'none';
                    }
                });
            }
            
            // Enter key in input field
            const codeInput = document.getElementById('redeemCodeInput');
            if (codeInput) {
                codeInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const codeInput = document.getElementById('redeemCodeInput').value;
                        if (redeemCode(codeInput)) {
                            redeemModal.style.display = 'none';
                        }
                    }
                });
            }
            
            // Close modal when clicking outside
            redeemModal.addEventListener('click', function(e) {
                if (e.target === redeemModal) {
                    redeemModal.style.display = 'none';
                }
            });
        }
        
        // Success Modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            const closeBtn = document.getElementById('closeSuccess');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    successModal.style.display = 'none';
                });
            }
            
            successModal.addEventListener('click', function(e) {
                if (e.target === successModal) {
                    successModal.style.display = 'none';
                }
            });
        }
        
        // Rewards Modal
        const rewardsModal = document.getElementById('rewardsModal');
        if (rewardsModal) {
            const cancelBtn = document.getElementById('cancelRewards');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    rewardsModal.style.display = 'none';
                });
            }
            
            rewardsModal.addEventListener('click', function(e) {
                if (e.target === rewardsModal) {
                    rewardsModal.style.display = 'none';
                }
            });
        }
        
        // Coupon Modal
        const couponModal = document.getElementById('couponModal');
        if (couponModal) {
            const closeBtn = document.getElementById('closeCoupon');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    couponModal.style.display = 'none';
                });
            }
            
            couponModal.addEventListener('click', function(e) {
                if (e.target === couponModal) {
                    couponModal.style.display = 'none';
                }
            });
        }
    }
    
    function setupLogoutListener() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const modal = document.getElementById('logoutModal');
                if (modal) {
                    modal.style.display = 'flex';
                    
                    const cancelBtn = modal.querySelector('.cancel-btn');
                    if (cancelBtn) {
                        cancelBtn.addEventListener('click', function() {
                            modal.style.display = 'none';
                        });
                    }
                    
                    const confirmBtn = modal.querySelector('.confirm-btn');
                    if (confirmBtn) {
                        confirmBtn.addEventListener('click', function() {
                            this.textContent = 'Logging out...';
                            this.disabled = true;
                            
                            // Clear current user data
                            localStorage.removeItem('plastiCycleCurrentUser');
                            
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 500);
                        });
                    }
                    
                    modal.addEventListener('click', function(e) {
                        if (e.target === modal) {
                            modal.style.display = 'none';
                        }
                    });
                }
            });
        }
    }
}); // <-- This was missing in your code