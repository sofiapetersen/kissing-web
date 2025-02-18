let cy;

        function openPopup(popupId) {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById(popupId).style.display = 'block';
        }

        // Função para fechar todos os popups
        function closeAllPopups() {
            const popups = document.querySelectorAll('.popup');
            popups.forEach(popup => {
                popup.style.display = 'none';
            });
            document.getElementById('overlay').style.display = 'none';
        }

        function closeAllPopupsAndOpenWelcomePopup() {
            closeAllPopups();
            openPopup('popupWelcome');
        }

        // welcome popup
        window.onload = function() {
            openPopup('popupWelcome');
            initializeGraph();
        }

        function initializeGraph() {
            fetch('/api/getallconnections')
            .then(response => response.json())
            .then(data => {
                renderGraph(data);
            })
            .catch(error => {
                console.error('Error initializing graph:', error);
                alert('Erro ao inicializar o gráfico.');
            });
        }

        // Event listener para o formulário "Adicione Alguém na Web" do popup
        document.getElementById('addNameFormPopup').addEventListener('submit', async function (event) {
            event.preventDefault();
            const name = document.getElementById('namePopup').value;
            const instagram = document.getElementById('instagramPopup').value;

            const response = await fetch('/api/addname', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, instagram })
            });

            const result = await response.json();
            if (result.success) {
                alert(`Nome '${name}' adicionado com sucesso! ID: ${result.id}`);
                document.getElementById('namePopup').value = "";
                document.getElementById('instagramPopup').value = "";
                closeAllPopupsAndOpenWelcomePopup(); 
                getAllConnections();
            } else {
                alert(`Erro: ${result.error}`);
            }
        });

        // Event listener para o formulário "Crie uma conexão na Web" do popup
        document.getElementById('createConnectionFormPopup').addEventListener('submit', async function (event) {
            event.preventDefault();
            const name1 = document.getElementById('name1Popup').value;
            const name2 = document.getElementById('name2Popup').value;

            const response = await fetch('/api/createconnection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name1, name2 })
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                document.getElementById('name1Popup').value = "";
                document.getElementById('name2Popup').value = "";
                closeAllPopupsAndOpenWelcomePopup(); 
                getAllConnections(); 
            } else {
                alert(`Erro: ${result.error || result.message}`);
            }
        });

        function searchConnections() {
            const name = document.getElementById('searchName').value;
            
            fetch('/api/getconnections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchName: name })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data received from API:', data);
                document.getElementById('searchName').value = '';
                renderGraph(data);
            })
            .catch(error => {
                console.error('Error fetching connections:', error);
                document.getElementById('searchName').value = '';
                alert('Erro ao buscar conexões.');
            });
        }

        function getAllConnections() {
            fetch('/api/getallconnections')
            .then(response => response.json())
            .then(data => {
                console.log('Data received from API:', data);
                renderGraph(data);
            })
            .catch(error => {
                console.error('Error fetching all connections:', error);
                alert('Erro ao buscar todas as conexões.');
            });
        }

        function clearLayout() {
            if (cy) {
                cy.elements().remove();
            }
        }

        function zoomIn() {
            cy.zoom(cy.zoom() * 1.2); 
        }

        function zoomOut() {
            cy.zoom(cy.zoom() / 1.2);
        }

        // Função para renderizar o gráfico Cytoscape
        function renderGraph(data) {
            if (!data || !data.nodes || !data.edges) {
                alert('Dados inválidos recebidos.');
                return;
            }

            const elements = [];

            data.nodes.forEach(node => {
                elements.push({ data: { id: node.id, label: node.label } });
            });

            data.edges.forEach(edge => {
                elements.push({ data: { source: edge.source, target: edge.target } });
            });

            cy = cytoscape({
                container: document.getElementById('cy'),
                elements: elements,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#FF007F',
                            'label': 'data(label)',
                            'text-valign': 'bottom',
                            'color': '#000000',
                            'font-size': '15px',
                            'width': '50px',
                            'height': '50px'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'line-color': '#ccc',
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle'
                        }
                    },
                    {
                        selector: '.highlighted',
                        style: {
                            'background-color': '#378EF0', 
                            'line-color': '#1157b3', 
                            'target-arrow-color': '#378EF0', 
                            'transition-property': 'background-color, line-color, target-arrow-color',
                            'transition-duration': '0.5s'
                        }
                    }
                ],
                layout: {
                    name: 'concentric',
                    fit: true,
                    padding: 30,
                    startAngle: 3 / 2 * Math.PI,
                    clockwise: true,
                    equidistant: false,
                    minNodeSpacing: 100,
                    avoidOverlap: true,
                    concentric: function(node){
                        return node.degree();
                    },
                    levelWidth: function(nodes){
                        return 2;
                    }
                }
            });

            cy.on('tap', 'node', function(event) {
                const node = event.target;
                const connectedEdges = node.connectedEdges();
                const connectedNodes = connectedEdges.targets().add(node).add(connectedEdges.sources());

                cy.elements().removeClass('highlighted');
                connectedNodes.addClass('highlighted');
                connectedEdges.addClass('highlighted');
            });

            cy.on('tap', function(event) {
                if (event.target === cy) {
                    cy.elements().removeClass('highlighted');
                }
            });
        }