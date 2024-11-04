document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resourceForm");
    const resourceNameInput = document.getElementById("resourceName");
    const resourceDescriptionInput = document.getElementById("resourceDescription");
    const resourceAddressInput = document.getElementById("resourceAddress"); 
    const message = document.getElementById("message");
    const resourceList = document.getElementById("resourceList");
    let editMode = false;
    let editId = null;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const resourceName = resourceNameInput.value.trim();
        const resourceDescription = resourceDescriptionInput.value.trim();
        const resourceAddress = resourceAddressInput.value.trim();

        if (!resourceName || !resourceDescription || !resourceAddress) {
            message.textContent = "Todos os campos são obrigatórios.";
            return;
        }

        const resource = {
            id: editMode ? editId : Date.now(),
            name: resourceName,
            description: resourceDescription,
            address: resourceAddress
        };

        if (editMode) {
            updateResource(resource);
            message.textContent = "Recurso atualizado com sucesso!";
        } else {
            saveResource(resource);
            message.textContent = "Recurso cadastrado com sucesso!";
        }

        form.reset();
        editMode = false;
        editId = null;

      
    });

    function saveResource(resource) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        resources.push(resource);
        localStorage.setItem("resources", JSON.stringify(resources));
    }

    function updateResource(updatedResource) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        const index = resources.findIndex(resource => resource.id === updatedResource.id);
        if (index !== -1) {
            resources[index] = updatedResource;
            localStorage.setItem("resources", JSON.stringify(resources));
        }
    }

    function deleteResource(id) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        const updatedResources = resources.filter(resource => resource.id !== id);
        localStorage.setItem("resources", JSON.stringify(updatedResources));
        mostrarRecursos();
    }

    window.mostrarRecursos = function () {
        document.getElementById("cadastroContainer").style.display = "none";
        document.getElementById("visualizacaoContainer").style.display = "block";

        resourceList.innerHTML = "";
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        if (resources.length === 0) {
            resourceList.innerHTML = "<li>Nenhum recurso cadastrado.</li>";
        } else {
            resources.forEach(resource => {
                const li = document.createElement("li");
                li.textContent = `${resource.name} - ${resource.description} - ${resource.address}`;

                // Cria um contêiner de botões
                const buttonContainer = document.createElement("div");
                buttonContainer.classList.add("button-container");

                // Botão de editar
                const editButton = document.createElement("button");
                editButton.textContent = "Editar";
                editButton.classList.add("edit-button");
                editButton.onclick = () => {
                    resourceNameInput.value = resource.name;
                    resourceDescriptionInput.value = resource.description;
                    resourceAddressInput.value = resource.address;
                    editMode = true;
                    editId = resource.id;
                    voltarCadastro();
                };

                // Botão de deletar
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Deletar";
                deleteButton.classList.add("delete-button");
                deleteButton.onclick = () => deleteResource(resource.id);

                // Adiciona os botões ao contêiner de botões
                buttonContainer.appendChild(editButton);
                buttonContainer.appendChild(deleteButton);

                // Adiciona o contêiner de botões ao item da lista
                li.appendChild(buttonContainer);
                resourceList.appendChild(li);
            });
        }
    };

    window.voltarCadastro = function () {
        document.getElementById("cadastroContainer").style.display = "block";
        document.getElementById("visualizacaoContainer").style.display = "none";
    };
});
