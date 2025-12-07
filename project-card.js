// 定义 ProjectCard 自定义元素
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'image', 'alt', 'description', 'link', 'date', 'technologies'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const title = this.getAttribute('title') || 'Project Title';
        const image = this.getAttribute('image') || '';
        const alt = this.getAttribute('alt') || 'Project image';
        const description = this.getAttribute('description') || 'No description available';
        const link = this.getAttribute('link') || '#';
        const date = this.getAttribute('date') || '';
        const technologies = this.getAttribute('technologies') || '';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --card-bg: var(--card-bg, #ffffff);
                    --primary-color: var(--primary-green, #2e8b57);
                    --text-color: var(--text-color, #333333);
                    --border-radius: var(--border-radius, 12px);
                    --box-shadow: var(--box-shadow, 0 4px 12px rgba(46, 139, 87, 0.1));
                    --transition: var(--transition, all 0.3s ease);
                    
                    display: block;
                    background: var(--card-bg);
                    border-radius: var(--border-radius);
                    box-shadow: var(--box-shadow);
                    overflow: hidden;
                    transition: var(--transition);
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    animation: fadeIn 0.6s ease-out;
                    box-sizing: border-box;
                    width: 100%;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(46, 139, 87, 0.15);
                }

                .card-content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                h2 {
                    font-family: var(--font-family-heading, 'Montserrat', sans-serif);
                    color: var(--primary-color);
                    margin: 0 0 1rem 0;
                    font-size: 1.25rem;
                    line-height: 1.3;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid var(--mint-green);
                }

                .project-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }

                .description {
                    flex: 1;
                    margin-bottom: 1rem;
                    line-height: 1.6;
                    color: var(--text-color);
                }

                .technologies {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .tech-tag {
                    background: var(--mint-green, #e8f5e8);
                    color: var(--primary-green, #2e8b57);
                    padding: 0.25rem 0.75rem;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .project-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--primary-color);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: var(--transition);
                    justify-content: center;
                    width: 100%;
                    box-sizing: border-box;
                }

                .project-link:hover {
                    background: var(--dark-green, #1a5c3a);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    :host {
                        padding: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    
                    .project-image {
                        height: 150px;
                    }
                }
            </style>

            <div class="card-content">
                <h2>${this.escapeHtml(title)}</h2>
                
                ${image ? `
                    <picture>
                        <img src="${image}" alt="${this.escapeHtml(alt)}" class="project-image" loading="lazy">
                    </picture>
                ` : ''}
                
                <p class="description">${this.escapeHtml(description)}</p>
                
                ${technologies ? `
                    <div class="technologies">
                        ${technologies.split(',').map(tech => 
                            `<span class="tech-tag">${this.escapeHtml(tech.trim())}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                
                <div class="metadata">
                    ${date ? `<span class="date">${this.escapeHtml(date)}</span>` : ''}
                </div>
                
                <a href="${link}" class="project-link" target="_blank" rel="noopener">
                    View Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </div>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// 注册自定义元素
customElements.define('project-card', ProjectCard);

// 数据加载功能
document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projectsContainer');
    const loadLocalBtn = document.getElementById('loadLocal');
    const loadRemoteBtn = document.getElementById('loadRemote');

    // 本地数据（存储在 localStorage）
    const localProjects = [
        {
            title: "Personal Portfolio Website",
            image: "project1.img",
            alt: "Code editor showing website development",
            description: "A responsive portfolio website built with HTML5, CSS3, and JavaScript, featuring custom web components and modern CSS features.",
            link: "index.html",
            date: "2024 - Present",
            technologies: "HTML5,CSS3,JavaScript,Web Components"
        },
        {
            title: "CSE 134B Course Projects",
            image: "project1.img",
            alt: "Team collaboration on software project",
            description: "Advanced web development projects including responsive design, accessibility features, and modern web APIs.",
            link: "#",
            date: "2025 Winter",
            technologies: "HTML5,CSS Grid,Flexbox,JavaScript"
        }
    ];

    // 远程数据（使用 My JSON Server）
    const REMOTE_URL = 'https://my-json-server.typicode.com/ruz059/ruz059-MyJsontry/projects';

    // 初始化：将本地数据保存到 localStorage
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(localProjects));
    }

    // 创建项目卡片
    function createProjectCard(project) {
        const card = document.createElement('project-card');
        card.setAttribute('title', project.title);
        card.setAttribute('image', project.image);
        card.setAttribute('alt', project.alt);
        card.setAttribute('description', project.description);
        card.setAttribute('link', project.link);
        card.setAttribute('date', project.date);
        card.setAttribute('technologies', project.technologies);
        return card;
    }

    // 显示项目卡片
    function displayProjects(projects) {
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            projectsContainer.appendChild(createProjectCard(project));
        });
    }

    // 从 localStorage 加载
    function loadFromLocal() {
        try {
            const projects = JSON.parse(localStorage.getItem('projects'));
            if (projects && projects.length > 0) {
                displayProjects(projects);
                alert(`Loaded ${projects.length} projects from localStorage!`);
            } else {
                alert('No projects found in localStorage!');
            }
        } catch (error) {
            alert('Error loading from localStorage: ' + error.message);
        }
    }

    // 从远程服务器加载
    function loadFromRemote() {
        fetch(REMOTE_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(projects => {
                displayProjects(projects);
                alert(`Loaded ${projects.length} projects from remote server!`);
            })
            .catch(error => {
                alert('Error loading from remote server: ' + error.message);
                // 备用数据（如果远程服务器不可用）
                const fallbackProjects = [
                    {
                       title: "Personal Portfolio Website",
            image: "project1.img",
            alt: "Code editor showing website development",
            description: "A responsive portfolio website built with HTML5, CSS3, and JavaScript, featuring custom web components and modern CSS features.",
            link: "#",
            date: "2024 - Present",
            technologies: "HTML5,CSS3,JavaScript,Web Components"
                    },
                    {
                        title: "CSE 134B Course Projects",
            image: "project1.img",
            alt: "Team collaboration on software project",
            description: "Advanced web development projects including responsive design, accessibility features, and modern web APIs.",
            link: "#",
            date: "2025 Winter",
            technologies: "HTML5,CSS Grid,Flexbox,JavaScript"
                    }
                ];
                displayProjects(fallbackProjects);
                alert('Using fallback data due to server error');
            });
    }

    // 添加事件监听器
    loadLocalBtn.addEventListener('click', loadFromLocal);
    loadRemoteBtn.addEventListener('click', loadFromRemote);

    // 初始状态：容器为空，等待用户点击按钮
});