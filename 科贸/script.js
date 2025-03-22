// 粒子系统类
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 300;
        this.mouse = { x: -100, y: -100 };
        this.init();
    }

    init() {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createParticles() {
        this.particles = Array.from({ length: this.numParticles }, () => new Particle(this));
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', () => this.handleClick());
    }

    resize() {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.createParticles();
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    handleClick() {
        for (let i = 0; i < 30; i++) {
            const particle = new Particle(this);
            particle.speedX *= 2;
            particle.speedY *= 2;
            this.particles.push(particle);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        this.particles = this.particles.filter(particle => particle.life > 0);
        this.particles.forEach(particle => particle.update());
        this.drawBatch();
    }

    drawBatch() {
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.particles.forEach(particle => {
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        });
        this.ctx.fillStyle = this.getGradient();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    getGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, innerWidth, innerHeight);
        gradient.addColorStop(0, '#87CEFA');
        gradient.addColorStop(1, '#007BFF');
        return gradient;
    }
}

// 粒子类
class Particle {
    constructor(system) {
        this.system = system;
        this.x = Math.random() * innerWidth;
        this.y = Math.random() * innerHeight;
        this.size = Math.random() * 1 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.life = Math.random() * 3000;
    }

    update() {
        const dx = this.system.mouse.x - this.x;
        const dy = this.system.mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const force = 0.1;
            this.speedX += (dx / distance) * force;
            this.speedY += (dy / distance) * force;
        }

        if (this.x > innerWidth || this.x < 0) {
            this.speedX *= -0.95;
            this.x = Math.max(0, Math.min(this.x, innerWidth));
        }
        if (this.y > innerHeight || this.y < 0) {
            this.speedY *= -0.95;
            this.y = Math.max(0, Math.min(this.y, innerHeight));
        }

        this.life -= 10;
        if (this.life <= 0) {
            this.size *= 0.98;
            this.opacity *= 0.95;
        }
    }
}

// 初始化粒子系统
window.addEventListener('load', () => {
    const canvas = document.getElementById('particleCanvas');
    const particleSystem = new ParticleSystem(canvas);

    // 暗黑模式切换按钮
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.textContent = '切换暗黑模式';
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '10px';
    themeToggle.style.right = '10px';
    themeToggle.style.padding = '5px 10px';
    themeToggle.style.backgroundColor = '#4CAF50';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '5px';
    themeToggle.style.cursor = 'pointer';
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
    document.body.appendChild(themeToggle);

    // 表单验证
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            const isValid = [...formData.entries()].every(([key, value]) => {
                if (key === 'email' && !value.includes('@')) return false;
                return value.trim() !== '';
            });

            if (!isValid) {
                this.querySelectorAll('input, textarea').forEach(input => {
                    input.classList.toggle('error', 
                        !input.value.trim() || 
                        (input.name === 'email' && !input.value.includes('@'))
                    );
                });
                return;
            }

            alert('提交成功！我们将尽快与您联系');
            this.reset();
            this.querySelectorAll('input, textarea').forEach(input => {
                input.classList.remove('error');
            });
        });
    }

    // 返回顶部按钮
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.textContent = '↑';
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        const btn = document.querySelector('.back-to-top');
        btn.classList.toggle('active', window.scrollY > 500);
    });
});


// 滚动监听
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function updateActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;

            if (pageYOffset >= sectionTop - 100 && pageYOffset <= sectionBottom - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes('#' + current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // 初始化高亮状态
});

document.querySelectorAll('.navbar .nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
        // 移除所有导航项的 'active' 类
        document.querySelectorAll('.navbar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        // 为当前点击的导航项添加 'active' 类
        this.classList.add('active');
    });
});

// 初始化时添加 'active' 类到第一个导航项
document.querySelector('.navbar .nav-link').classList.add('active');

/*悬浮动画*/
window.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product-item');
    let index = 0;

    function showProduct() {
        if (index < products.length) {
            products[index].classList.add('active');
            index++;
            setTimeout(showProduct, 500); // 每500毫秒显示一个产品
        }
    }

    showProduct();

    products.forEach(product => {
        product.addEventListener('click', () => {
            products.forEach(p => p.classList.remove('selected'));
            product.classList.add('selected');
        });
    });
});


function activateProduct(element) {
    // 移除所有产品的激活状态
    var products = document.querySelectorAll('.product');
    products.forEach(function(product) {
        product.classList.remove('active');
    });
    // 为点击的产品添加激活状态
    element.classList.add('active');
}

