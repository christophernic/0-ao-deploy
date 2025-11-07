/* Exemplo: array de músicas para uso na UI
	 Cada objeto contém:
	 - titulo: string
	 - artista: string
	 - capaUrl: string (caminho relativo para a imagem da capa)
*/
const musicas = [
	{ titulo: 'Blinding Lights', artista: 'The Weeknd', capaUrl: 'assets/capas/blinding-lights.jpg' },
	{ titulo: 'Levitating', artista: 'Dua Lipa', capaUrl: 'assets/capas/levitating.jpg' },
	{ titulo: 'Bad Habits', artista: 'Ed Sheeran', capaUrl: 'assets/capas/bad-habits.jpg' },
	{ titulo: 'drivers license', artista: 'Olivia Rodrigo', capaUrl: 'assets/capas/drivers-license.jpg' },
	{ titulo: 'Heat Waves', artista: 'Glass Animals', capaUrl: 'assets/capas/heat-waves.jpg' },
	{ titulo: 'As It Was', artista: 'Harry Styles', capaUrl: 'assets/capas/as-it-was.jpg' }
];

// Expor globalmente para uso sem módulos (ex.: em js/app.js ou inline scripts)
if (typeof window !== 'undefined') {
	window.musicas = musicas;
}

// Também exportar para CommonJS/ESM quando disponível (opcional)
try{
	if (typeof module !== 'undefined' && module.exports) module.exports.musicas = musicas;
}catch(e){}

/**
 * Renderiza o array `musicas` dentro da div com id `lista-de-musicas` (ou id passado).
 * Opcional: passar uma opção { onPlay: (musica, index) => {} } para interceptar o evento de play.
 * Retorna o elemento container usado (ou null se não encontrado).
 */
function renderMusicas(containerId = 'lista-de-musicas', options = {}){
	const container = (typeof document !== 'undefined') ? document.getElementById(containerId) : null;
	if (!container){
		if (typeof console !== 'undefined') console.warn(`renderMusicas: container "${containerId}" não encontrado`);
		return null;
	}

	container.innerHTML = '';

	musicas.forEach((m, idx) => {
		const article = document.createElement('article');
		article.className = 'musica-card';
		article.setAttribute('tabindex','0');
		article.setAttribute('role','group');
		article.setAttribute('aria-label', `Música: ${m.titulo} por ${m.artista}`);

		// Capa
		const cover = document.createElement('div');
		cover.className = 'musica-card__cover';
		const img = document.createElement('img');
		img.src = m.capaUrl || '';
		// fallback to a placeholder if image fails to load
		img.onerror = function(){
			this.onerror = null;
			this.src = 'https://via.placeholder.com/72x72?text=No+Image';
		};
		img.alt = `Capa da música ${m.titulo}`;
		cover.appendChild(img);

		// Play overlay
		const playWrap = document.createElement('div');
		playWrap.className = 'musica-card__play';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.setAttribute('aria-label','Tocar');
		btn.innerHTML = `
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>
		`.trim();

		// Handler de play (prevent propagation para não ativar clique no card)
		btn.addEventListener('click', (ev) => {
			ev.stopPropagation();
			if (options && typeof options.onPlay === 'function'){
				options.onPlay(m, idx);
			} else {
				// fallback: log no console
				console.log('Play:', m.titulo, ' — ', m.artista);
			}
		});

		playWrap.appendChild(btn);
		cover.appendChild(playWrap);

		// Info
		const info = document.createElement('div');
		info.className = 'musica-card__info';
		const title = document.createElement('div');
		title.className = 'musica-card__title';
		title.textContent = m.titulo;
		const artist = document.createElement('div');
		artist.className = 'musica-card__artist';
		artist.textContent = m.artista;
		info.appendChild(title);
		info.appendChild(artist);

		// Append
		article.appendChild(cover);
		article.appendChild(info);

		// Clique no artigo: comportamento padrão (por ex. abrir player)
		article.addEventListener('click', () => {
			if (options && typeof options.onPlay === 'function'){
				options.onPlay(m, idx);
			} else {
				console.log('Selecionado:', m.titulo);
			}
		});

		container.appendChild(article);
	});

	return container;
}

// Expor globalmente
if (typeof window !== 'undefined') window.renderMusicas = renderMusicas;
try{
	if (typeof module !== 'undefined' && module.exports) module.exports.renderMusicas = renderMusicas;
}catch(e){}

