document.addEventListener('DOMContentLoaded', () => {
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeIcon) updateThemeIcon(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    function updateThemeIcon(isDark) {
        if (!themeIcon) return;
        if (isDark) {
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons(); 
    }

    
    lucide.createIcons();

    
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });

    
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            
            filterBtns.forEach(b => b.classList.remove('active'));
            
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.textContent;

            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const successOverlay = document.getElementById('formSuccess');
                    if (successOverlay) {
                        successOverlay.classList.add('active');
                        setTimeout(() => {
                            successOverlay.classList.remove('active');
                            contactForm.reset();
                        }, 10000); 
                    }
                } else {
                    alert('Oops! There was a problem sending your message. Please try again.');
                }
            } catch (error) {
                alert('Oops! There was a problem sending your message. Please check your connection.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    
    const orderBtns = document.querySelectorAll('.order-btn');
    orderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = btn.closest('.product-card').querySelector('.product-name').textContent;
            const message = `Hello Chibest Beauty, I am interested in purchasing the ${productName}. Please provide more details.`;
            const whatsappUrl = `https://wa.me/254714961826?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank');
        });
    });

    
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const productImages = document.querySelectorAll('.product-img img');

    productImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; 
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    
    const chatToggle = document.getElementById('toggle-chat');
    const chatContainer = document.getElementById('ai-chatbot');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');

    if (chatToggle && chatContainer && closeChat) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.add('active');
            chatToggle.style.display = 'none';
        });

        closeChat.addEventListener('click', () => {
            chatContainer.classList.remove('active');
            chatToggle.style.display = 'flex';
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = userInput.value.trim();
            if (!message) return;

            
            addMessage(message, 'user');
            userInput.value = '';

            
            showThinking();
            setTimeout(() => {
                removeThinking();
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 1500);
        });
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showThinking() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.classList.add('message', 'bot', 'thinking-wrapper');
        thinkingDiv.id = 'thinking';
        thinkingDiv.innerHTML = `
            <div class="thinking">
                <span></span><span></span><span></span>
            </div>
        `;
        chatMessages.appendChild(thinkingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeThinking() {
        const thinking = document.getElementById('thinking');
        if (thinking) thinking.remove();
    }

    function getBotResponse(input) {
        const query = input.toLowerCase();

        if (query.includes('hello') || query.includes('hi')) {
            return "Hello! How can I assist you with Chibest Electronics today?";
        } else if (query.includes('who is') || query.includes('what is chibest') || query.includes('about you')) {
            return "<b>Chibest Equipment</b> is your premier destination for high-quality electronics and professional beauty equipment. We specialize in everything from advanced sound systems and TV accessories to premium salon furniture and spa tools. We pride ourselves on quality and affordable prices!";
        } else if (query.includes('sell') || query.includes('product') || query.includes('item') || query.includes('inventory')) {
            return "We sell a wide variety of premium electronics and beauty equipment, including:<br><br>" +
                "• <b>Sound Systems:</b> HOME STAR & Ampex 2.1 Hi-Fi Speakers.<br>" +
                "• <b>TV Accessories:</b> Skilltech Wall Mount Brackets.<br>" +
                "• <b>Beauty Tools:</b> WMARK clippers, trimmers, and massage guns.<br>" +
                "• <b>Salon Furniture:</b> Barber chairs, styling chairs, and shampoo stations.<br>" +
                "• <b>Spa Equipment:</b> Towel warmers, foot spas, and pedicure bowls.<br>" +
                "• <b>Cooling:</b> Homestar wall and stand fans.<br><br>" +
                "Is there a specific category you're interested in?";
        } else if (query.includes('sound') || query.includes('speaker') || query.includes('woofer')) {
            return "Our sound collection features high-performance <b>HOME STAR</b> and <b>Ampex</b> systems. The <b>HS004BT 2.1 Channel</b> is our top recommendation for clear, powerful bass. Would you like to know the shop location to come hear them?";
        } else if (query.includes('tv') || query.includes('bracket') || query.includes('mount')) {
            return "We stock heavy-duty <b>Skilltech</b> TV wall mounts that fit all sizes. They are durable, easy to install, and very secure for your flat-screen TVs.";
        } else if (query.includes('salon') || query.includes('furniture') || query.includes('chair') || query.includes('shampoo')) {
            return "We provide professional-grade salon furniture, including ergonomic <b>Barber Chairs</b>, stylish <b>Styling Chairs</b>, and comfortable <b>Shampoo Stations</b> to give your clients a premium experience.";
        } else if (query.includes('spa') || query.includes('towel') || query.includes('pedicure') || query.includes('warm')) {
            return "For your spa or salon, we have <b>Towel Warmers</b>, <b>Foot Spa Machines</b>, and <b>Pedicure Bowls</b>. We also have wax warmers and facial steamers in stock!";
        } else if (query.includes('fan') || query.includes('cooling') || query.includes('homestar fan')) {
            return "Stay cool with our <b>Homestar</b> Wall and Stand fans. They are powerful, durable, and perfect for both homes and offices.";
        } else if (query.includes('beauty') || query.includes('clipper') || query.includes('hair') || query.includes('wmark')) {
            return "We are authorized dealers of <b>WMARK</b> clippers and trimmers. We also have hair steamers, massage guns, and professional blow dryers for top-tier grooming.";
        } else if (query.includes('location') || query.includes('address') || query.includes('shop')) {
            return "We are located at <b>Ruby Mall, Shop No. UG 2 and UG 3</b>, Nairobi, Kenya. Come visit us!";
        } else if (query.includes('contact') || query.includes('phone') || query.includes('whatsapp')) {
            return "You can reach us on WhatsApp at 0714961826 or email us at Chibest315@gmail.com.";
        } else if (query.includes('beauty') || query.includes('hair') || query.includes('clipper')) {
            return "We offer premium beauty equipment including WMARK clippers, hair steamers, and professional salon chairs. Which specific tool are you looking for?";
        } else if (query.includes('price') || query.includes('cost') || query.includes('how much')) {
            return "For the best prices and specific quotes, please DM <b>Chibest Equipment</b> on WhatsApp at <b>0714961826</b>. We'll be happy to help you with our current deals!";
        } else {
            return "I'm not sure I understand. Could you please ask about our products, location, or how to contact us?";
        }
    }
});
