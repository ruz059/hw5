// CRUD 操作功能 - 仅本地数据
document.addEventListener('DOMContentLoaded', function() {
    const createForm = document.getElementById('createForm');
    const projectsList = document.getElementById('projectsList');
    const loadLocalBtn = document.getElementById('loadLocal');
    const loadRemoteBtn = document.getElementById('loadRemote');

    // 初始化示例数据 - 修复：使用字符串ID
    function initializeSampleData() {
        if (!localStorage.getItem('projects')) {
            const sampleProjects = [
                {
                    id: "1", // 改为字符串
                    title: "Personal Portfolio Website",
                    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
                    alt: "Code editor showing website development",
                    description: "A responsive portfolio website built with HTML5, CSS3, and JavaScript.",
                    link: "index.html",
                    date: "2024 - Present",
                    technologies: "HTML5,CSS3,JavaScript,Web Components"
                },
                {
                    id: "2", // 改为字符串
                    title: "CSE 134B Course Projects",
                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
                    alt: "Team collaboration on software project",
                    description: "Advanced web development projects including responsive design and modern web APIs.",
                    link: "#",
                    date: "2025 Winter",
                    technologies: "HTML5,CSS Grid,Flexbox,JavaScript"
                }
            ];
            localStorage.setItem('projects', JSON.stringify(sampleProjects));
        }
    }

    // 生成唯一ID - 保持原样
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 显示项目列表 - 修改：存储ID到dataset
    function displayProjectsList(projects) {
        projectsList.innerHTML = '';
        
        if (!projects || projects.length === 0) {
            projectsList.innerHTML = '<p class="no-projects">No projects found. Create your first project!</p>';
            return;
        }

        projects.forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.innerHTML = `
                <div class="project-preview">
                    <h4>${project.title}</h4>
                    <p class="project-description">${project.description.substring(0, 100)}...</p>
                    <div class="project-meta">
                        <span class="date">${project.date}</span>
                        <span class="tech">${project.technologies}</span>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn-edit" data-index="${index}" data-id="${project.id}">Edit</button>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </div>
            `;
            projectsList.appendChild(projectElement);
        });
    }

    // 填充编辑表单 - 保持原样
    function populateEditForm(project) {
        document.getElementById('title').value = project.title || '';
        document.getElementById('image').value = project.image || '';
        document.getElementById('alt').value = project.alt || '';
        document.getElementById('description').value = project.description || '';
        document.getElementById('link').value = project.link || '';
        document.getElementById('date').value = project.date || '';
        document.getElementById('technologies').value = project.technologies || '';
        
        // 更改表单为更新模式
        createForm.dataset.editId = project.id;
        const submitButton = createForm.querySelector('button');
        submitButton.textContent = 'Update Project';
        submitButton.style.background = 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)';
        
        // 滚动到表单位置
        document.querySelector('.form-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        alert('📝 Now editing: ' + project.title + '\nModify the fields and click "Update Project"');
    }

    // 更新项目 (UPDATE) - 修复：确保比较的是相同类型
    function updateProject(projectId, projectData) {
        const projects = JSON.parse(localStorage.getItem('projects'));
        // 确保projectId是字符串，与存储的ID类型匹配
        const projectIndex = projects.findIndex(p => String(p.id) === String(projectId));
        
        if (projectIndex !== -1) {
            projectData.id = projects[projectIndex].id; // 保留原始ID
            projects[projectIndex] = projectData;
            localStorage.setItem('projects', JSON.stringify(projects));
            
            alert('✅ Project updated successfully!');
            displayProjectsList(projects);
            resetForm();
        } else {
            alert('❌ Project not found for updating. ID: ' + projectId);
        }
    }

    // 删除项目 (DELETE) - 保持原样
    function deleteProject(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            const projects = JSON.parse(localStorage.getItem('projects'));
            if (projects && projects[index]) {
                const deletedProject = projects[index];
                projects.splice(index, 1);
                localStorage.setItem('projects', JSON.stringify(projects));
                
                alert('✅ Project "' + deletedProject.title + '" deleted successfully!');
                displayProjectsList(projects);
            } else {
                alert('❌ Project not found for deletion');
            }
        }
    }

    // 重置表单 - 保持原样
    function resetForm() {
        createForm.reset();
        delete createForm.dataset.editId;
        const submitButton = createForm.querySelector('button');
        submitButton.textContent = 'Create Project';
        submitButton.style.background = 'linear-gradient(135deg, var(--primary-green) 0%, var(--light-green) 100%)';
    }

    // 从本地存储加载 - 保持原样
    function loadFromLocal() {
        const projects = JSON.parse(localStorage.getItem('projects'));
        if (projects && projects.length > 0) {
            displayProjectsList(projects);
            alert(`✅ Loaded ${projects.length} projects from localStorage`);
        } else {
            alert('❌ No projects found in localStorage');
        }
    }

    // 从远程服务器加载 - 保持原样
    function loadFromRemote() {
        alert('⚠️ Remote loading is disabled in this version.\nAll changes are saved locally only.');
        loadFromLocal();
    }

    // 事件委托处理所有按钮点击 - 修复：获取ID
    projectsList.addEventListener('click', function(e) {
        const index = e.target.getAttribute('data-index');
        const projectId = e.target.getAttribute('data-id'); // 新增：获取ID
        
        if (!index) return;
        
        const projects = JSON.parse(localStorage.getItem('projects'));
        if (!projects || !projects[index]) return;

        // 处理编辑按钮点击
        if (e.target.classList.contains('btn-edit')) {
            populateEditForm(projects[index]);
        }
        
        // 处理删除按钮点击
        if (e.target.classList.contains('btn-delete')) {
            deleteProject(index);
        }
    });

    // 表单提交处理 - 保持原样
    createForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const projectData = {
            title: formData.get('title'),
            image: formData.get('image'),
            alt: formData.get('alt'),
            description: formData.get('description'),
            link: formData.get('link'),
            date: formData.get('date'),
            technologies: formData.get('technologies')
        };

        // 验证必填字段
        if (!projectData.title || !projectData.description) {
            alert('❌ Please fill in all required fields (Title and Description)');
            return;
        }

        if (this.dataset.editId) {
            // 更新现有项目
            updateProject(this.dataset.editId, projectData);
        } else {
            // 创建新项目
            createProject(projectData);
        }
    });

    // 创建项目 - 修复：确保ID是字符串
    function createProject(projectData) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projectData.id = String(generateId()); // 确保是字符串
        projects.push(projectData);
        localStorage.setItem('projects', JSON.stringify(projects));
        
        alert('✅ Project created successfully!');
        displayProjectsList(projects);
        resetForm();
    }

    // 按钮事件监听器 - 保持原样
    loadLocalBtn.addEventListener('click', loadFromLocal);
    loadRemoteBtn.addEventListener('click', loadFromRemote);

    // 初始化
    initializeSampleData();
    loadFromLocal();
});