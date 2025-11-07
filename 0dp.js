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
		// if capaUrl exists use it, else generate a colorful SVG cover data URL
		if (m.capaUrl) {
			img.src = m.capaUrl;
		} else {
			img.src = generateCoverSVGDataURL(m.titulo, m.artista);
		}
		// fallback to generated SVG if external image fails
		img.onerror = function(){
			this.onerror = null;
			this.src = generateCoverSVGDataURL(m.titulo, m.artista);
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

/** Generate a colorful SVG data URL for a cover using title/artist as seed */
function generateCoverSVGDataURL(title = '', artist = ''){
	// simple deterministic color generation from string
	function hashStr(s){
		let h = 2166136261;
		for (let i=0;i<s.length;i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
		return h;
	}
	const h1 = hashStr(title || artist || 'cover');
	const h2 = hashStr((artist||'') + (title||''));
	const color1 = `hsl(${h1 % 360}deg 70% 40%)`.replace('deg','');
	const color2 = `hsl(${h2 % 360}deg 65% 55%)`.replace('deg','');
	const initials = (title || '').split(' ').slice(0,2).map(p=>p[0]||'').join('').toUpperCase() || (artist||'').slice(0,2).toUpperCase();
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
		<defs>
			<linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
				<stop offset='0' stop-color='${color1}'/>
				<stop offset='1' stop-color='${color2}'/>
			</linearGradient>
		</defs>
		<rect width='100%' height='100%' fill='url(#g)' rx='8' ry='8'/>
		<text x='50%' y='54%' font-family='Poppins,Helvetica,Arial' font-weight='600' font-size='36' fill='rgba(255,255,255,0.92)' text-anchor='middle' dominant-baseline='middle'>${escapeXml(initials)}</text>
	</svg>`;
	return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function escapeXml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

// Expor globalmente
if (typeof window !== 'undefined') window.renderMusicas = renderMusicas;
try{
	if (typeof module !== 'undefined' && module.exports) module.exports.renderMusicas = renderMusicas;
}catch(e){}

/** Render sidebar (static links) */
function renderSidebar(){
	// nothing dynamic for now; placeholder in case we want to list user's playlists
	return true;
}

/** Render topbar (search behavior) */
function renderTopbar(){
	const input = document.querySelector('.topbar .search input');
	if (!input) return;
	input.addEventListener('input', (e)=>{
		const q = e.target.value.toLowerCase().trim();
		// simple filter by title or artist
		const cards = document.querySelectorAll('.musica-card');
		cards.forEach(c=>{
			const title = c.querySelector('.musica-card__title').textContent.toLowerCase();
			const artist = c.querySelector('.musica-card__artist').textContent.toLowerCase();
			if (!q || title.includes(q) || artist.includes(q)) c.style.display = '';
			else c.style.display = 'none';
		});
	});
}

/** Initialize the UI: render sidebar, topbar and music list */
function initUI(){
	try{ renderSidebar(); }catch(e){/* ignore */}
	try{ renderMusicas(); }catch(e){/* ignore */}
	try{ renderTopbar(); }catch(e){/* ignore */}
}

if (typeof window !== 'undefined') window.initUI = initUI;

