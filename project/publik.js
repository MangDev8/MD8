// ============================================
// MD8 | Teknisi Rumahan - SCRIPT JS (PUBLIK)
// Mendukung: JSON file (prioritas) → localStorage → default
// ============================================

let projects = [];
let currentProjectId = null;

// ============ DATA DEFAULT ============
function getDefaultProjects() {
    return [
        {
            id: 1,
            title: 'Speaker Bluetooth Portable',
            category: 'PROJECT',
            description: `<h4>📌 Deskripsi</h4>
<p>Ini adalah <strong>contoh proyek</strong> speaker bluetooth portabel.</p>
<img src="https://via.placeholder.com/600x300?text=Speaker+BT" alt="Ilustrasi Speaker">
<h4>🔧 Komponen</h4>
<ul>
  <li>Baterai 18650 (2x)</li>
  <li>Modul Bluetooth MH-M18</li>
  <li>Speaker 3W 4Ω</li>
  <li>BMS 2S</li>
</ul>
<h4>📝 Cara Membuat</h4>
<p>Rangkai semua komponen sesuai skema.</p>`,
            images: [
                'https://via.placeholder.com/400x220?text=Speaker+BT+1',
                'https://via.placeholder.com/400x220?text=Speaker+BT+2'
            ],
            views: 25
        },
        {
            id: 2,
            title: 'Lampu Taman Solar Otomatis',
            category: 'PLTS',
            description: `<h4>📌 Deskripsi</h4>
<p>Lampu otomatis menyala saat malam dengan sensor LDR.</p>
<img src="https://via.placeholder.com/600x300?text=Lampu+Solar" alt="Skema">
<h4>🔧 Komponen</h4>
<ul>
  <li>Panel surya mini 5V</li>
  <li>Baterai 18650</li>
  <li>Sensor LDR</li>
  <li>LED 3W warm white</li>
</ul>`,
            images: [
                'https://via.placeholder.com/400x220?text=Lampu+Solar'
            ],
            views: 15
        }
    ];
}

// ============ LOAD DATA ============
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    
    try {
        // 1. Coba ambil dari file JSON (prioritas utama)
        // Path disesuaikan: karena publik.html ada di folder project/, maka naik satu level ke ../data/
        const response = await fetch('../data/projects.json');
        if (response.ok) {
            const jsonData = await response.json();
            if (Array.isArray(jsonData) && jsonData.length > 0) {
                // Gabungkan dengan data views dari localStorage
                const viewsData = getViewsFromLocalStorage();
                projects = jsonData.map(p => ({
                    ...p,
                    views: viewsData[p.id] || p.views || 0
                }));
                console.log('✅ Data dimuat dari file JSON:', projects.length, 'proyek');
                renderProjects();
                return;
            }
        }
        console.warn('⚠️ File JSON tidak ditemukan atau kosong, beralih ke localStorage...');
    } catch (e) {
        console.warn('⚠️ Gagal fetch JSON:', e.message);
    }

    // 2. Fallback ke localStorage
    try {
        const stored = localStorage.getItem('md8_projects_data');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                projects = parsed;
                console.log('✅ Data dimuat dari localStorage:', projects.length, 'proyek');
                renderProjects();
                return;
            }
        }
        console.warn('⚠️ Data di localStorage kosong, gunakan default...');
    } catch (e) {
        console.error('❌ Error membaca localStorage:', e);
    }

    // 3. Terakhir, pakai data default
    projects = getDefaultProjects();
    // Simpan default ke localStorage agar tidak perlu fetch ulang
    localStorage.setItem('md8_projects_data', JSON.stringify(projects));
    console.log('✅ Data default digunakan.');
    renderProjects();
}

// ============ AMBIL VIEWS DARI LOCALSTORAGE ============
function getViewsFromLocalStorage() {
    try {
        const stored = localStorage.getItem('md8_projects_views');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {}
    return {};
}

// ============ SIMPAN VIEWS KE LOCALSTORAGE ============
function saveViewsToLocalStorage() {
    try {
        const viewsData = {};
        projects.forEach(p => {
            viewsData[p.id] = p.views || 0;
        });
        localStorage.setItem('md8_projects_views', JSON.stringify(viewsData));
    } catch (e) {
        console.error('❌ Gagal menyimpan views:', e);
    }
}

// ============ RENDER PROJECTS ============
function renderProjects() {
    const grid = document.getElementById('projectsGrid');

    if (!projects || projects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>Belum Ada Proyek</h3>
                <p>Silakan tambahkan proyek melalui halaman admin.</p>
                <a href="admin.html">➕ Tambah Proyek</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = projects.map(project => {
        const firstImage = project.images && project.images.length > 0 
            ? project.images[0] 
            : 'https://via.placeholder.com/400x220?text=No+Image';
        
        const excerpt = stripHtml(project.description).substring(0, 150) + '...';
        const badgeClass = getBadgeClass(project.category);
        
        return `
            <div class="project-card" onclick="openModal('${project.id}')">
                <img src="${firstImage}" 
                     alt="${project.title}" 
                     class="card-image"
                     onerror="this.src='https://via.placeholder.com/400x220?text=Image+Error'">
                <div class="card-body">
                    <span class="badge ${badgeClass}">${project.category || 'PROJECT'}</span>
                    <h3>${project.title}</h3>
                    <div class="excerpt">${excerpt}</div>
                    <div class="meta">
                        <span><i class="fas fa-images"></i> ${project.images ? project.images.length : 0} gambar</span>
                        <span><i class="fas fa-eye"></i> ${project.views || 0} views</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============ GET BADGE CLASS ============
function getBadgeClass(category) {
    const cat = category.toLowerCase();
    if (cat.includes('plts') || cat.includes('solar')) return 'badge-plts';
    if (cat.includes('iot')) return 'badge-iot';
    if (cat.includes('robot')) return 'badge-robotik';
    if (cat.includes('elektronika')) return 'badge-elektronika';
    return 'badge-project';
}

// ============ STRIP HTML ============
function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// ============ OPEN MODAL ============
function openModal(id) {
    const project = projects.find(p => p.id == id);
    if (!project) return;

    currentProjectId = id;

    // Update views
    project.views = (project.views || 0) + 1;
    saveViewsToLocalStorage(); // simpan views ke localStorage terpisah

    // Header image
    const headerImg = document.getElementById('modalHeaderImage');
    headerImg.src = project.images && project.images.length > 0 
        ? project.images[0] 
        : 'https://via.placeholder.com/800x300?text=No+Image';
    headerImg.onerror = () => {
        headerImg.src = 'https://via.placeholder.com/800x300?text=Image+Error';
    };

    // Title & Badge
    document.getElementById('modalTitle').textContent = project.title;
    const badge = document.getElementById('modalBadge');
    badge.textContent = project.category || 'PROJECT';
    badge.className = `badge ${getBadgeClass(project.category)}`;

    // Meta
    document.getElementById('modalViews').textContent = project.views || 0;
    document.getElementById('modalImageCount').textContent = project.images ? project.images.length : 0;

    // Gallery
    const gallery = document.getElementById('modalGallery');
    if (project.images && project.images.length > 0) {
        gallery.innerHTML = project.images.map((img, i) => `
            <img src="${img}" 
                 alt="Gambar ${i + 1}" 
                 onerror="this.src='https://via.placeholder.com/150?text=Error'"
                 onclick="openLightbox('${img}')">
        `).join('');
        gallery.style.display = 'grid';
    } else {
        gallery.style.display = 'none';
    }

    // Description
    document.getElementById('modalDescription').innerHTML = project.description || '<p>Tidak ada deskripsi.</p>';

    // Tampilkan modal
    document.getElementById('modalDetail').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update grid (untuk update views)
    renderProjects();
}

// ============ CLOSE MODAL ============
function closeModal() {
    document.getElementById('modalDetail').classList.remove('active');
    document.body.style.overflow = '';
    currentProjectId = null;
}

// ============ LIGHTBOX ============
function openLightbox(src) {
    document.getElementById('lightboxImage').src = src;
    document.getElementById('lightboxOverlay').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('active');
    document.getElementById('lightboxImage').src = '';
}

// ============ EVENT LISTENERS ============
document.addEventListener('DOMContentLoaded', function() {
    // Tutup modal saat klik overlay
    document.getElementById('modalDetail').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Tutup lightbox saat klik overlay
    document.getElementById('lightboxOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('lightboxOverlay').classList.contains('active')) {
                closeLightbox();
            } else if (document.getElementById('modalDetail').classList.contains('active')) {
                closeModal();
            }
        }
    });

    // Load projects
    loadProjects();
});

// Listen perubahan data dari tab lain (hanya untuk localStorage)
window.addEventListener('storage', function(e) {
    if (e.key === 'md8_projects_data' || e.key === 'md8_projects_views') {
        console.log('📡 Data berubah dari tab lain, reload...');
        loadProjects();
    }
});

console.log('🚀 MD8 Public JS siap (JSON + localStorage)');