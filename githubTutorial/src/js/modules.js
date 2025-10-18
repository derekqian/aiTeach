// Module System
class ModuleSystem {
    constructor() {
        this.modules = [];
        this.currentModule = null;
        this.currentSection = null;
    }

    async initialize() {
        try {
            const response = await fetch('modules/modules.json');
            const data = await response.json();
            this.modules = data.modules;
            this.initializeModuleGrid();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading modules:', error);
        }
    }

    initializeModuleGrid() {
        const moduleGrid = document.querySelector('.module-grid');
        if (!moduleGrid) return;

        moduleGrid.innerHTML = '';
        this.modules.forEach(module => {
            const moduleCard = this.createModuleCard(module);
            moduleGrid.appendChild(moduleCard);
        });
    }

    createModuleCard(module) {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.innerHTML = `
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            <span class="level">${module.level}</span>
            <button data-module-id="${module.id}">Start Learning</button>
        `;
        return card;
    }

    async loadModuleContent(moduleId, sectionId = null) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        this.currentModule = module;
        this.currentSection = sectionId ? 
            module.sections.find(s => s.id === sectionId) :
            module.sections[0];

        const main = document.querySelector('main');
        main.innerHTML = `
            <div class="module-view">
                <div class="module-navigation">
                    <h2>${module.title}</h2>
                    <ul class="section-list">
                        ${module.sections.map(section => `
                            <li class="${section.id === this.currentSection.id ? 'active' : ''}">
                                <a href="#" data-section-id="${section.id}">${section.title}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="module-content-container">
                    <div id="moduleContent"></div>
                </div>
            </div>
        `;

        await this.loadSection(this.currentSection);
        this.setupModuleNavigation();
    }

    async loadSection(section) {
        try {
            const response = await fetch(`modules/${section.content}`);
            const content = await response.text();
            document.getElementById('moduleContent').innerHTML = content;
        } catch (error) {
            console.error('Error loading section:', error);
        }
    }

    setupModuleNavigation() {
        document.querySelectorAll('.section-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = e.target.dataset.sectionId;
                const section = this.currentModule.sections.find(s => s.id === sectionId);
                if (section) {
                    document.querySelectorAll('.section-list li').forEach(li => li.classList.remove('active'));
                    e.target.parentElement.classList.add('active');
                    this.loadSection(section);
                }
            });
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.module-card button')) {
                const moduleId = e.target.dataset.moduleId;
                this.loadModuleContent(moduleId);
            }
        });
    }
}

// Initialize the module system
document.addEventListener('DOMContentLoaded', () => {
    const moduleSystem = new ModuleSystem();
    moduleSystem.initialize();
});