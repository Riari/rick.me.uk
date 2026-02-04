import { defineToolbarApp } from 'astro/toolbar';

export default defineToolbarApp({
    init(canvas, app, server) {
        const window = document.createElement('astro-dev-toolbar-window');
        
        const header = document.createElement('div');
        header.style.cssText = 'padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;';
        
        const title = document.createElement('h2');
        title.textContent = 'Project Weights';
        title.style.cssText = 'margin: 0; font-size: 1.2rem; font-weight: bold;';
        
        const redistBtn = document.createElement('astro-dev-toolbar-button');
        redistBtn.textContent = 'Redistribute weights';
        redistBtn.buttonStyle = 'purple';
        redistBtn.size = 'small';
        redistBtn.addEventListener('click', () => {
            if (confirm('Redistribute weights evenly? This will preserve the current order.')) {
                server.send('redistribute-weights', {});
            }
        });
        
        header.appendChild(title);
        header.appendChild(redistBtn);
        window.appendChild(header);

        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = 'padding: 1rem; max-height: 500px; overflow-y: auto;';
        window.appendChild(contentContainer);

        const loadingText = document.createElement('p');
        loadingText.textContent = 'Loading projects...';
        loadingText.style.cssText = 'color: rgba(255,255,255,0.6); text-align: center; padding: 2rem;';
        contentContainer.appendChild(loadingText);

        let draggedItem = null;
        let projects = [];
        
        server.send('get-projects', {});

        server.on('projects-data', (data) => {
            projects = data.projects;
            renderProjects(contentContainer, projects, server);
        });

        server.on('weight-updated', (data) => showNotification(window, `Updated ${data.projectSlug} to weight ${data.newWeight}`, 'success'));
        
        server.on('redistribute-weights-complete', () => showNotification(window, 'Project weights redistributed', 'success'));

        server.on('error', (data) => showNotification(window, `Error: ${data.message}`, 'error'));
        
        canvas.appendChild(window);
        
        function renderProjects(container, projectList, server) {
            container.innerHTML = '';
            
            if (projectList.length === 0) {
                const emptyText = document.createElement('p');
                emptyText.textContent = 'No projects found.';
                emptyText.style.cssText = 'color: rgba(255,255,255,0.6); text-align: center; padding: 2rem;';
                container.appendChild(emptyText);
                return;
            }
            
            projectList.forEach((project, index) => {
                const card = document.createElement('div');
                card.draggable = true;
                card.dataset.slug = project.slug;
                card.dataset.index = index;
                card.style.cssText = `
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: move;
                    transition: all 0.2s;
                `;

                const dragHandle = document.createElement('span');
                dragHandle.textContent = '⋮⋮';
                dragHandle.style.cssText = 'color: rgba(255,255,255,0.4); font-size: 1.2rem; cursor: grab;';

                const infoContainer = document.createElement('div');
                infoContainer.style.cssText = 'flex: 1; min-width: 0;';
                
                const projectTitle = document.createElement('div');
                projectTitle.textContent = project.title;
                projectTitle.style.cssText = 'font-weight: 600; margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
                
                const projectMeta = document.createElement('div');
                projectMeta.textContent = `${project.type} • ${project.slug}`;
                projectMeta.style.cssText = 'font-size: 0.85rem; color: rgba(255,255,255,0.6);';
                
                infoContainer.appendChild(projectTitle);
                infoContainer.appendChild(projectMeta);

                const weightInput = document.createElement('input');
                weightInput.type = 'number';
                weightInput.value = project.weight;
                weightInput.style.cssText = `
                    width: 70px;
                    padding: 0.5rem;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 4px;
                    color: white;
                    font-size: 0.9rem;
                `;

                const updateBtn = document.createElement('astro-dev-toolbar-button');
                updateBtn.textContent = 'Update';
                updateBtn.buttonStyle = 'purple';
                updateBtn.size = 'small';
                updateBtn.addEventListener('click', () => {
                    const newWeight = parseInt(weightInput.value);
                    if (!isNaN(newWeight)) {
                        server.send('update-weight', {
                            projectSlug: project.slug,
                            newWeight: newWeight,
                        });
                    }
                });
                
                card.addEventListener('dragstart', (e) => {
                    draggedItem = card;
                    card.style.opacity = '0.5';
                });
                
                card.addEventListener('dragend', (e) => {
                    card.style.opacity = '1';
                    draggedItem = null;
                });
                
                card.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const afterElement = getDragAfterElement(container, e.clientY);
                    if (afterElement == null) {
                        container.appendChild(draggedItem);
                    } else {
                        container.insertBefore(draggedItem, afterElement);
                    }
                });
                
                card.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const cards = [...container.querySelectorAll('[data-slug]')];
                    const newIndex = cards.indexOf(draggedItem);
                    
                    let newWeight;
                    if (newIndex === 0) {
                        const nextWeight = projectList[1]?.weight || 10;
                        newWeight = Math.max(1, nextWeight - 5);
                    } else if (newIndex === projectList.length - 1) {
                        const prevWeight = projectList[projectList.length - 2]?.weight || 0;
                        newWeight = prevWeight + 10;
                    } else {
                        const prevCard = cards[newIndex - 1];
                        const nextCard = cards[newIndex + 1];
                        const prevProject = projectList.find(p => p.slug === prevCard.dataset.slug);
                        const nextProject = projectList.find(p => p.slug === nextCard.dataset.slug);
                        newWeight = Math.floor((prevProject.weight + nextProject.weight) / 2);
                    }
                    
                    server.send('update-weight', {
                        projectSlug: draggedItem.dataset.slug,
                        newWeight: newWeight,
                    });
                });
                
                card.appendChild(dragHandle);
                card.appendChild(infoContainer);
                card.appendChild(weightInput);
                card.appendChild(updateBtn);
                container.appendChild(card);
            });
        }
        
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('[draggable="true"]:not([style*="opacity: 0.5"])')];
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
        
        function showNotification(container, message, type = 'info') {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                padding: 0.75rem 1rem;
                background: ${type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)'};
                border-radius: 6px;
                color: white;
                font-size: 0.9rem;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            
            container.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    },
});
